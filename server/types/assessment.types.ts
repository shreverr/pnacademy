export interface AssementData {
  id: string;
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
  section: number;
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

export interface QuestionDetailedData {
  id: string;
  assessment_id: string;
  description: string;
  marks: number;
  section: number;
  options: OptionData[];
}

export interface AssementDetailedData {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: string;
  questions: QuestionDetailedData[];
}
export interface AssessmentDataBySection {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: string;
  sections: QuestionDetailedData[][]
}
export interface AIOptionData {
  description: string;
  is_correct: boolean;
}
export interface AiQuestionData {
  description: string;
  options: AIOptionData[];
}
export interface AiQuestions {
  questions: AiQuestionData[];
}

export type TagAttribute = "id" | "name" | "createdAt" | "updatedAt";

export type AssessmentAttribute =
  | "id"
  | "name"
  | "description"
  | "is_active"
  | "start_at"
  | "end_at"
  | "duration"
  | "created_by"
  | "createdAt"
  | "updatedAt";

export type AssessmentAssigendGroupData = {
  id: string;
};

export type UserResult = {
  user_id: string;
  correct_answers_count: number;
  marks_scored: number;
  correct_percentage: number;
  wrong_answers_count: number;
  createdAt: Date;
  updatedAt: Date;
  first_name: string;
  last_name: string;
  email: string;
}

export type UserResultAttributes = "user_id" | "first_name" | "last_name" | "email" | "correct_answers_count"
  | "marks_scored" | "correct_percentage" | "wrong_answers_count" | "createdAt" | "updatedAt"

export type AssessmentResultListAttributes =
  "assessment_id" |
  "total_marks" |
  "total_participants"|
  "average_marks" |
  "average_marks_percentage" |
  "is_published" |
  "createdAt" |
  "updatedAt"|
  "name"

export type AssessmentResult = {
  assessment_id: string
  total_marks: number
  total_participants: number
  average_marks: number
  average_marks_percentage: number
  is_published: boolean
  createdAt: Date
  updatedAt: Date
  name: string
}

export type AssessmentResultAnalyticsMetric = 'total_participants' | 'average_marks' | 'average_marks_percentage'

export type ChartData = {
  createdAt: Date;
  metricValue: number;
}

export interface AssessmentTime {
  duration: number;
  server_time: Date;
  start_at: Date;

}