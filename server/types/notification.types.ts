export interface NotificationData {
  id: string;
  description: string;
  title: string;
  image_url: string | null;
  file_url: string | null;
}

export type groupAttributes = 'name' | 'id' | 'createdAt' | 'updatedAt';