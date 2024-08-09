export interface AssementData {
  name: string
  description: string
  is_active: boolean
  start_at: Date
  end_at: Date
  duration: number
  created_by: string
}
export interface QuestionData {
  id: string
  assessment_id: string
  description: string
  marks: number
  section: number
}
export interface OptionData {
  id: string
  question_id: string
  description: string
  is_correct: boolean
}
export interface TagData {
  id: string
  name: string
}

export interface QuestionDetailedData {
  id: string
  assessment_id: string
  description: string
  marks: number
  section: number
  options: OptionData[]
}

export interface AssementDetailedData {
  id: string
  name: string
  description: string
  is_active: boolean
  start_at: Date
  end_at: Date
  duration: number
  created_by: string
  questions: QuestionDetailedData[]
}

export type TagAttribute = 'id' | 'name' | 'createdAt' | 'updatedAt'

export type AssessmentAttribute = 'id' | 'name' | 'description' | 'is_active' | 'start_at' | 'end_at' | 'duration' | 'created_by' | 'createdAt' | 'updatedAt'