import { innerEmotions, middleEmotions, outerEmotions } from '../emotionData'
import type { Emotion, ReligionData } from '../types/emotions'
import { Religion } from '../types/emotions'

export type { ReligionData as EmotionScripture }

async function fetchEmotionJson(emotionName: string): Promise<any> {
  try {
    const response = await fetch(`/output/${emotionName.toLowerCase()}.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching JSON for ${emotionName}:`, error)
    return null
  }
}

export async function loadEmotionData(emotionName: string): Promise<Emotion> {
  const baseEmotion = [...innerEmotions, ...middleEmotions, ...outerEmotions].find(
    e => e.name.toLowerCase() === emotionName.toLowerCase()
  )

  if (!baseEmotion) {
    throw new Error(`Emotion ${emotionName} not found`)
  }

  try {
    const response = await fetch(`/output/${emotionName.toLowerCase()}.json`)
    if (!response.ok) {
      console.error(`Failed to fetch data for ${emotionName}: ${response.status}`)
      return baseEmotion as Emotion
    }

    const jsonData = await response.json()
    console.log(`Loaded JSON data for ${emotionName}:`, jsonData)

    // Create the emotion object with properly structured religion data
    const result: Emotion = {
      ...baseEmotion,
      // Store data with both cases to ensure compatibility
      Christianity: jsonData.christianity || jsonData.Christianity || { summary: '', ideas: '', quotes: [] },
      christianity: jsonData.christianity || jsonData.Christianity || { summary: '', ideas: '', quotes: [] },
      Buddhism: jsonData.buddhism || jsonData.Buddhism || { summary: '', ideas: '', quotes: [] },
      buddhism: jsonData.buddhism || jsonData.Buddhism || { summary: '', ideas: '', quotes: [] },
      Hinduism: jsonData.hinduism || jsonData.Hinduism || { summary: '', ideas: '', quotes: [] },
      hinduism: jsonData.hinduism || jsonData.Hinduism || { summary: '', ideas: '', quotes: [] },
      Islam: jsonData.islam || jsonData.Islam || { summary: '', ideas: '', quotes: [] },
      islam: jsonData.islam || jsonData.Islam || { summary: '', ideas: '', quotes: [] },
      Sikhism: jsonData.sikhism || jsonData.Sikhism || { summary: '', ideas: '', quotes: [] },
      sikhism: jsonData.sikhism || jsonData.Sikhism || { summary: '', ideas: '', quotes: [] }
    }

    console.log(`Processed emotion data for ${emotionName}:`, result)
    return result
  } catch (error) {
    console.error(`Error loading emotion data for ${emotionName}:`, error)
    return baseEmotion as Emotion
  }
}

export async function loadEmotionScriptures(emotionName: string, religion: keyof typeof Religion): Promise<ReligionData[]> {
  console.log(`Loading scriptures for emotion: ${emotionName}, religion: ${religion}`)
  const data = await loadEmotionData(emotionName)
  const religionData = data[Religion[religion]]
  
  if (!religionData) {
    console.log(`No scripture data found for ${emotionName} in ${religion}`)
    return []
  }

  console.log(`Found scripture data:`, religionData)
  return religionData
} 