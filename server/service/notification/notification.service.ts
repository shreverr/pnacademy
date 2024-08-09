import { v4 as uuid } from "uuid";
import { AppError } from "../../lib/appError";
import { type UUID } from "crypto";

import {
  createGroupInDB,
  createNotificationInDB,
  deleteGroupsById,
  deleteNotificationInDB,
  getAllGroups,
  getAllNotifications,
  getGroupById,
  getGroupByName,
  getnotificationById,
  updateGroupInDB,
} from "../../model/notification/notification.model";
import { groupAttributes, NotificationAttributesWithOptionalImageAndFileUrl, NotificationSortBy } from "../../types/notification.types";
import { GroupData } from "../../types/group.types";
import commonErrorsDictionary from "../../utils/error/commonErrors";
import { deleteFileFromDisk, deleteFileFromS3, uploadFileToS3 } from "../../lib/file";
import path from "path";
import { generatePresignedUrl } from "../../utils/s3";
import { NotificationAttributes } from "../../schema/group/notification.schema";

export const createNotification = async (notification: {
  description: string;
  title: string;
  image?: Express.Multer.File;
  file?: Express.Multer.File;
}): Promise<NotificationAttributesWithOptionalImageAndFileUrl | undefined> => {
  let notificationImageKey: string | null = null;
  let notificationFileKey: string | null = null;
  try {
    if (notification.image) {
      notificationImageKey = `notification-images/${uuid()}${path.extname(notification.image.path)}`

      await uploadFileToS3(
        notification.image.path,
        notificationImageKey,
        'image'
      );

      deleteFileFromDisk(notification.image.path)
    }

    if (notification.file) {
      notificationFileKey = `notification-files/${uuid()}${path.extname(notification.file.path)}`

      await uploadFileToS3(
        notification.file.path,
        notificationFileKey,
        'other'
      );

      deleteFileFromDisk(notification.file.path)
    }

    const notificationDataInDB = await createNotificationInDB({
      id: uuid(),
      title: notification.title,
      description: notification.description,
      image_key: notificationImageKey,
      file_key: notificationFileKey,
    });

    let notificationData: any = notificationDataInDB;
    delete notificationData.image_key;
    delete notificationData.file_key;

    if (notificationImageKey) {
      notificationData.image_url = await generatePresignedUrl(notificationImageKey, 60 * 60)
    }

    if (notificationFileKey) {
      notificationData.file_url = await generatePresignedUrl(notificationFileKey, 60 * 60)
    }

    return notificationData;
  } catch (error: any) {
    if (notificationFileKey) {
      try {
        await deleteFileFromS3(notificationFileKey as string)
      } catch (error) {
        throw error
      }
    } else if (error instanceof AppError && error.name === 'error creating notification') {
      try {
        await deleteFileFromS3(notificationImageKey as string)
        await deleteFileFromS3(notificationFileKey as string)
      } catch (error) {
        throw error
      }
    } else {
      throw error
    }
  }

  return undefined;
};

export const deleteNotification = async (notification: {
  id: UUID;
}): Promise<boolean | null> => {
  const checkNotification = await getnotificationById(notification.id);
  if (!checkNotification) {
    throw new AppError(
      "Notification not found",
      404,
      "Notification with that id does not exist",
      false
    );
  }
  const notificationData = await deleteNotificationInDB({
    id: notification.id,
  });
  return true;
}


export const createGroup = async (group: {
  name: string;
}): Promise<GroupData | null> => {
  const groupExists = await getGroupByName(group.name);
  if (groupExists) {
    throw new AppError(
      "Group already exists",
      409,
      "Group with that name already exists",
      false
    );
  } else {
    const groupData = await createGroupInDB({
      id: uuid(),
      name: group.name,
    });
    return groupData;
  }
};

export const updateGroup = async (
  id: UUID,
  name: string
): Promise<GroupData | null> => {
  const existingGroup = await getGroupById(id)
  if (existingGroup == null) {
    throw new AppError(
      'Group not found',
      404,
      "Group with this id does not exist so Can't update group",
      false
    )
  }
  const updatedGroup = await updateGroupInDB(
    id,
    name
  )

  return updatedGroup
}

export const deleteGroups = async (groupIds: string[]): Promise<boolean> => {
  const result = await deleteGroupsById(groupIds);
  return result;
};

export const viewAllGroups = async (
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: groupAttributes,
  order?: "ASC" | "DESC",
): Promise<{
  groups: GroupData[],
  totalPages: number,
}> => {
  const page = parseInt(pageStr ?? '1');
  const pageSize = parseInt(pageSizeStr ?? '10');
  sortBy = sortBy ?? 'name';
  order = order ?? 'ASC';

  const offset = (page - 1) * pageSize;

  const { rows: allGroupsData, count: allGroupsCount } = await getAllGroups(
    offset,
    pageSize,
    sortBy,
    order
  )

  if (!allGroupsData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }

  const totalPages = Math.ceil(allGroupsCount / pageSize);

  return {
    groups: allGroupsData,
    totalPages: totalPages
  };
};

export const viewAllNotifications = async (
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: NotificationSortBy,
  order?: "ASC" | "DESC"
): Promise<{
  notifications: NotificationAttributesWithOptionalImageAndFileUrl[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "title";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;
  const { rows: allNotificationsData, count: allNotificationsCount } =
    await getAllNotifications(offset, pageSize, sortBy, order);

  if (!allNotificationsData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }

  let notificationsData = await Promise.all(allNotificationsData.map(async (notification) => {
    let notificationData: any = notification;
  
    if (notificationData.image_key) {
      notificationData.image_url = await generatePresignedUrl(notificationData.image_key, 60 * 60)
    }
    
    if (notificationData.file_key) {
      notificationData.file_url = await generatePresignedUrl(notificationData.file_key, 60 * 60)
    }
  
    delete notificationData.image_key;
    delete notificationData.file_key;
    return notificationData
  }));

  const totalPages = Math.ceil(allNotificationsCount / pageSize);
  return {
    notifications: notificationsData,
    totalPages: totalPages,
  };
};
