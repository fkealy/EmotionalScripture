# 📄 Product Requirements Document (PRD)

### Title:  
**Script Generator for Emotion-Based Scripture Wheel (Multi-Religion)**

---

## 🧩 Overview

This script uses a Large Language Model (LLM) to generate structured, validated JSON data that links emotions to relevant scriptures from **Buddhism, Hinduism, Islam, Christianity, and Sikhism**. It employs a two-stage process: generation and verification.

Each emotion will be tied to quotes from each religion, with each quote containing its own set of descriptive tags for deeper insight and future filtering.

---

## ✅ 0. Target Emotions

The script will run for each of the following 34 emotions:

```json
[
  "Accepted", "Valued", "Respected", "Powerful", "Hopeful", "Brave",
  "Excited", "Grateful", "Caring", "Creative", "Curious", "Affectionate",
  "Guilty", "Ashamed", "Excluded", "Embarrassed", "Annoyed", "Jealous",
  "Bored", "Overwhelmed", "Powerless", "Anxious", "Disappointed", "Hurt",
  "Lonely", "Loved", "Sad", "Scared", "Angry", "Playful", "Happy",
  "Confident"
]
```

Each emotion will have corresponding data in the `emotionData.ts` file with structured scriptures and quotes across the 5 major religions.

---

## 🎯 Goals

- Create structured, validated data connecting emotions to scriptural insights across major religions
- Include comprehensive tagging system for quotes to enable rich filtering and discovery
- Ensure data is accurate, attributed, and properly sourced
- Maintain consistent data structure across all emotions and religions

---

## 🛠️ Functional Requirements

### ✅ 1. Base Emotion Structure

Each emotion should follow this structure:

```typescript
interface EmotionData {
    name: string;
    color: string;
    text: string;
    parent?: string;
    [religionKey: string]: ReligionData; // Christianity, Buddhism, etc.
}
```

---

### ✅ 2. Religion Data Structure

Each religion's data should contain:

```typescript
interface ReligionData {
    summary: string;          // Overall summary of religious perspective on this emotion
    ideas: string;           // Key interpretations or spiritual lessons
    quotes: Quote[];         // Array of relevant quotes
}
```

---

### ✅ 3. Quote Structure

Each quote must include:

```typescript
interface Quote {
    author: string;          // Who said it or which tradition
    scriptureSource: string; // e.g., "Psalm 34:18" or "Dhammapada 204"
    sourceURL: string;       // Direct link to source
    quote: string;          // The actual quote text
    tags: string[];         // Array of relevant tags
}
```

### ✅ 4. Required Religions

Must include data for all five major religions:
- Christianity
- Buddhism
- Hinduism
- Islam
- Sikhism

### ✅ 5. Tagging System

Each quote must include relevant tags from these categories:

**Emotional Tags:**
- Comfort
- Hope
- Peace
- Joy
- Strength
- Love
- Wisdom
- Faith

**Action Tags:**
- Prayer
- Meditation
- Service
- Study
- Reflection
- Community

**Spiritual Tags:**
- Divine Support
- Inner Growth
- Transformation
- Unity
- Purpose
- Grace

Tags should be:
- Consistent across religions
- Relevant to the quote content
- Limited to 3-5 per quote
- Used to enable filtering and discovery

---

## 📦 Non-Functional Requirements

- Maintain consistent tag vocabulary across all religions
- Handle scriptural references with cultural sensitivity
- Ensure proper attribution and sourcing
- Enable easy addition of new religions or emotions
- Support efficient filtering and searching by tags

---

## 🧪 Testing Requirements

- Validate data structure compliance
- Verify tag consistency
- Check quote attribution accuracy
- Ensure proper scripture references
- Test filtering capabilities

---

## 🔐 Cultural Considerations

- Respect religious traditions and terminology
- Use authoritative sources for each religion
- Maintain neutral, inclusive language
- Preserve original meaning in translations
- Consider cultural context in tagging

---

## 🔄 Implementation Steps

1. Update existing Christianity data with new structure and tags
2. Add data for remaining religions
3. Implement tag consistency checks
4. Validate all quotes and sources
5. Test filtering and discovery features