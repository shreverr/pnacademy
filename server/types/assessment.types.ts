export interface AssementData {
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: string;
}
export interface QuestionData {
  id: string;
  assessment_id: string;
  description: string;
  marks: number;
}
export interface OptionData {
  id: string;
  question_id: string;
  description: string;
  is_correct: boolean;
}
export interface TagData {
  id: string;
  name: string;
}

export interface NotificationData {
  id: string;
  description: string;
  title: string;
  image_url: string | null;
  file_url: string | null;
}

export interface GroupData {
  name: string;
  id: string;
}