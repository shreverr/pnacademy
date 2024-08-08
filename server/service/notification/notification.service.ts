import { v4 as uuid } from "uuid";
import { AppError } from "../../lib/appError";
import { type UUID } from "crypto";

import {
  createGroupInDB,
  createNotificationInDB,
  deleteGroupsById,
  deleteNotificationInDB,
  getAllGroups,
  getGroupById,
  getGroupByName,
  getnotificationById,
  updateGroupInDB,
} from "../../model/notification/notification.model";
import { groupAttributes, NotificationData } from "../../types/notification.types";
import { GroupData } from "../../types/group.types";
import commonErrorsDictionary from "../../utils/error/commonErrors";

export const createNotification = async (notification: {
  description: string;
  title: string;
  image_url: string | null;
  file_url: string | null;
}): Promise<NotificationData | null> => {
  
  const notificationData = await createNotificationInDB({
    id: uuid(),
    title: notification.title,
    description: notification.description,
    image_url: notification.image_url || null,
    file_url: notification.file_url || null,
  });
  return notificationData;
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