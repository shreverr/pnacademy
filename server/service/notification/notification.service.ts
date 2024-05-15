import { v4 as uuid } from "uuid";
import { AppError } from "../../lib/appError";
import { type UUID } from "crypto";

import {
  createGroupInDB,
  createNotificationInDB,
  deleteNotificationInDB,
  getGroupByName,
  getnotificationById,
} from "../../model/notification/notification.model";
import { NotificationData } from "../../types/notification.types";
import { GroupData } from "../../types/group.types";

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
