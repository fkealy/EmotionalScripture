// Basic types
export interface Quote {
  quote: string
  author: string
  sourceURL: string
  relevance?: string
  tags?: string[]
  scriptureSource?: string
}

export interface ReligionData {
  summary: string
  ideas: string
  quotes: Quote[]
}

// Emotion types
export interface EmotionBase {
  name: string
  color: string
  text: string
  parent?: string
  children?: string[]
}

export enum Religion {
  Christianity = 'Christianity',
  Buddhism = 'Buddhism',
  Hinduism = 'Hinduism',
  Islam = 'Islam',
  Sikhism = 'Sikhism'
}

// Explicitly define the Emotion type
export type Emotion = EmotionBase & {
  [key: string]: any // Allow string indexing
} & {
  christianity?: ReligionData
  buddhism?: ReligionData
  hinduism?: ReligionData
  islam?: ReligionData
  sikhism?: ReligionData
}

// Export a type guard for debugging
export function isEmotion(obj: any): obj is Emotion {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    typeof obj.color === 'string' &&
    typeof obj.text === 'string'
  )
}

export interface LoadingState {
  loading: boolean
  error: Error | null
} 