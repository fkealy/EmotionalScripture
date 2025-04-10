// Basic types
export interface Quote {
  quote: string
  author: string
  sourceURL: string
  relevance?: string
  tags?: string[]
}

export interface Scripture {
  scriptureSource: string
  summary: string
  ideas: string
  similarTo: string[]
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

export type Emotion = EmotionBase & {
  [key in Religion]?: Scripture[]
}

export interface LoadingState {
  loading: boolean
  error: Error | null
} 