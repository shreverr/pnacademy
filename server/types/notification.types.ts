import { NotificationAttributes } from "../schema/group/notification.schema";

export interface NotificationData {
  id: string;
  description: string;
  title: string;
  image_url: string | null;
  file_url: string | null;
}

export type groupAttributes = 'name' | 'id' | 'createdAt' | 'updatedAt';

export type NotificationAttributesWithOptionalImageAndFileUrl = Omit<
  NotificationAttributes,
  'image_key' | 'file_key'
> & {
  image_url?: string;
  file_url?: string;
}