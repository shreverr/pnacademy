import { TestCaseAttributes } from "../schema/assessment/testCase.schema";

export interface AssementData {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: string | null;
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
  type: QuestionType;
  image_key: string | null
  time_limit: number | null
  allowed_languages: ProgrammingLanguage[] | null
  options: OptionData[];
  test_cases: TestCaseAttributes[]
}

export type QuestionType = "MCQ" | "CODE";

export interface AssementDetailedData {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: string | null;
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
  created_by: string | null;
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
  name: string;
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
  "total_participants" |
  "average_marks" |
  "average_marks_percentage" |
  "is_published" |
  "createdAt" |
  "updatedAt" |
  "name"

export type UserAssessmentResultListAttributes = "correct_answers_count" | "marks_scored" | "correct_percentage" | "wrong_answers_count" | "name" | "description" | "createdAt"

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
  started_at: Date;

}

export type SectionDetailedStatus = {
  section: number,
  status: 'started' | 'submitted' | 'not-started'
}
export type CountType = 'scheduled' | 'past' | 'ongoing' | 'total' | 'draft';


export interface AssessmentCountParams  {
  type: CountType;
  user_id?: string;
}

// Define the language enum type
export const ProgrammingLanguages = [
  'java',
  'python',
  'c',
  'cpp',
  'nodejs',
  'javascript',
  'haskell',
  'lua',
  'elixir',
  'php',
  'python2',
  'csharp',
  'perl',
  'ruby',
  'go',
  'r',
  'bash',
  'typescript',
  'kotlin',
  'rust',
  'swift',
  'objectivec'
] as const;

export type ProgrammingLanguage = typeof ProgrammingLanguages[number];