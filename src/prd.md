Absolutely — here’s the updated PRD and JSON schema reflecting the change to use quote-level tags, while keeping the structure clean and extensible.

📄 Product Requirements Document (PRD)

Title:

Script Generator for Emotion-Based Scripture Wheel (Multi-Religion)

🧩 Overview

This script uses a Large Language Model (LLM) to generate structured, validated JSON data that links emotions to relevant scriptures from Buddhism, Hinduism, Islam, Christianity, and Sikhism. It employs a two-stage process: generation and verification.

Each emotion will be tied to quotes from each religion, with each quote containing its own set of descriptive tags for deeper insight and future filtering (e.g., “Divine Support”, “Forgiveness”, “Self-Discipline”).

🎯 Goals
	•	Create structured, validated JSON data connecting emotions to scriptural insights across major religions.
	•	Include tags at the quote level for granular filtering and richer UX.
	•	Ensure data is accurate, attributed, and sourced.
	•	Output format should be consistent and ready to use client-side in a Vue.js PWA.

🛠️ Functional Requirements

✅ 1. Input
	•	Takes a single emotion object:

{
  "name": "Lonely",
  "color": "#9370DB",
  "text": "Feeling lonely is a signal that you value connection.",
  "parent": "Sad"
}

✅ 2. Stage 1 – Generation

For each religion (Christianity, Islam, Hinduism, Buddhism, Sikhism):
	•	Ask the LLM to return 1–2 scriptures relevant to the emotion.
	•	Each scripture includes:
	•	scriptureSource – Canonical text name & reference
	•	summary – Summary of the scripture’s message
	•	ideas – Key interpretations or spiritual lessons
	•	quotes – Array of quotes, each containing:
	•	author – Who said it or which tradition it’s from
	•	sourceURL – Direct link to the source
	•	quote – Direct quote
	•	tags – Array of keywords (e.g., “Hope”, “Compassion”, “Community”)

✅ 3. Stage 2 – Verification
	•	A second LLM (or validator module) will:
	•	Confirm the scripture and quote exist
	•	Assess contextual relevance to the emotion
	•	Validate citation format and accuracy
	•	Confirm tags are appropriate and not hallucinated

Only verified entries will be included in the final output.

✅ 4. Output
	•	JSON file saved per emotion, e.g.:

data/emotions/lonely.json

🧾 Updated JSON Schema

interface EmotionScriptureData {
  name: string;
  color: string;
  text: string;
  parent: string;
  religions: {
    [religion: string]: {
      scriptureSource: string;
      summary: string;
      ideas: string;
      quotes: {
        author: string;
        sourceURL: string;
        quote: string;
        tags: string[];
      }[];
    }[];
  };
}

📦 Non-Functional Requirements
	•	JSON must be valid and parsable
	•	Handle scriptural references with cultural sensitivity
	•	Clear error handling for LLM hallucinations
	•	Extensible to more emotions or religions

🧪 Testing Requirements
	•	Validate JSON output against the schema
	•	Manual spot-check 2–3 quotes per run
	•	Unit tests for schema compliance
	•	LLM hallucination detection on citation structure (e.g. “Quran X:Y” or “Psalm N”)

🔐 Ethical & Cultural Considerations
	•	Scriptures must be handled respectfully
	•	All quotes should be attributed
	•	The language should remain neutral, not preachy
	•	Do not infer theological interpretation; keep insights based on the text

🧰 Tech Stack
	•	Language: Python or Node.js
	•	LLM: GPT-4 (or Claude) with JSON-mode or structured prompting
	•	JSON validation: pydantic or ajv
	•	Output: Files stored to /data/emotions/*.json

✅ Next Steps
	1.	Scaffold script for one emotion + one religion (e.g. Lonely + Christianity)
	2.	Implement Stage 1 LLM generation (JSON structured)
	3.	Implement Stage 2 verification
	4.	Test & refine outputs
	5.	Scale to other emotions + religions

Let me know if you want me to scaffold the base script logic (e.g. prompt generator + JSON handler + verification loop), happy to build that out for Python or JS.