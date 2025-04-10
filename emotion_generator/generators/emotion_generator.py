import os
from typing import Dict, List
import requests
from pathlib import Path
from dotenv import load_dotenv
import json
import re

# Load environment variables from .env file
load_dotenv()

from schemas.emotion_schema import EmotionData, ReligionData, Quote
from utils.logger import get_logger
from data.emotion_data import EMOTION_COLORS, EMOTION_DESCRIPTIONS, EMOTION_HIERARCHY

# Initialize logger
logger = get_logger()

class EmotionGenerator:
    def __init__(self):
        self.colors = EMOTION_COLORS
        self.descriptions = EMOTION_DESCRIPTIONS
        self.hierarchy = EMOTION_HIERARCHY
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        if not self.api_key:
            raise ValueError("PERPLEXITY_API_KEY environment variable is not set")
        
        self.api_url = "https://api.perplexity.ai/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def parse_response_content(self, content: str) -> dict:
        """Parse the response content, handling both direct JSON and markdown-formatted JSON."""
        def clean_json_string(s: str) -> str:
            """Clean and fix common JSON string issues."""
            # Replace incorrect backticks with proper quotes
            s = s.replace('`', '"')
            # Fix any double escaped quotes
            s = s.replace('\\"', '"')
            # Remove any markdown citations like [1], [2], etc.
            s = re.sub(r'\[\d+\]', '', s)
            # Replace smart quotes with regular quotes
            s = s.replace('"', '"').replace('"', '"')
            s = s.replace('"', '"').replace('"', '"')
            # Remove any non-breaking spaces
            s = s.replace('\xa0', ' ')
            # Remove any zero-width spaces
            s = s.replace('\u200b', '')
            # Remove any other non-printable characters
            s = ''.join(char for char in s if char.isprintable() or char in '\n\t')
            
            # Fix missing closing brackets in arrays and objects
            # Count opening and closing brackets
            open_braces = s.count('{')
            close_braces = s.count('}')
            open_brackets = s.count('[')
            close_brackets = s.count(']')
            
            # Add missing closing brackets
            if open_braces > close_braces:
                s += '}' * (open_braces - close_braces)
            if open_brackets > close_brackets:
                s += ']' * (open_brackets - close_brackets)
            
            return s

        try:
            # First try to parse as direct JSON
            return json.loads(clean_json_string(content))
        except json.JSONDecodeError:
            # If that fails, try to extract JSON from markdown code blocks
            logger.debug("Direct JSON parse failed, attempting to extract from markdown")
            
            # Look for JSON in code blocks
            json_pattern = r"```(?:json)?\n(.*?)\n```"
            matches = re.findall(json_pattern, content, re.DOTALL)
            
            if matches:
                # Try each matched block until we find valid JSON
                for match in matches:
                    try:
                        cleaned_json = clean_json_string(match.strip())
                        return json.loads(cleaned_json)
                    except json.JSONDecodeError as e:
                        logger.debug(f"Failed to parse JSON block: {str(e)}")
                        continue
                    
            # If we still haven't found valid JSON, try to find any {...} block
            json_pattern = r"\{.*\}"
            matches = re.findall(json_pattern, content, re.DOTALL)
            
            if matches:
                # Try each matched block until we find valid JSON
                for match in matches:
                    try:
                        cleaned_json = clean_json_string(match)
                        return json.loads(cleaned_json)
                    except json.JSONDecodeError:
                        continue
            
            raise ValueError("Failed to parse API response content as JSON")

    def generate_religion_data(self, emotion_name: str, religion: str) -> ReligionData:
        """Generate religious data for a specific emotion and religion."""
        logger.info(f"Generating {religion} data for emotion: {emotion_name}")
        
        # Define valid scripture sources based on religion
        buddhist_sources = """
For Buddhism, only use quotes from these canonical texts:
- Tripitaka (Pali Canon):
  * Vinaya Pitaka
  * Sutta Pitaka (especially the five Nikayas)
  * Abhidhamma Pitaka
- Major Mahayana Sutras:
  * Lotus Sutra
  * Heart Sutra
  * Diamond Sutra
- Dhammapada
Do not use modern interpretations or contemporary Buddhist authors."""

        scripture_guide = {
            "Buddhism": buddhist_sources,
            # Add other religions' source guides here as needed
        }
        
        # Construct the prompt
        prompt = f"Generate spiritual/religious content about the emotion of '{emotion_name}' from {religion} perspective. Focus specifically on:\n"
        prompt += "1. A clear summary of how this religion views this specific emotion - is it considered positive/negative/neutral? How should followers approach and handle this emotion?\n"
        prompt += "2. Key teachings and practical guidance about managing and understanding this emotion in daily life\n"
        prompt += "3. Three highly relevant quotes from religious texts that EXPLICITLY discuss this emotion or directly related emotional states\n\n"
        
        # Add religion-specific scripture guidance if available
        if religion in scripture_guide:
            prompt += f"\nIMPORTANT - Scripture Source Requirements:\n{scripture_guide[religion]}\n\n"
        
        prompt += "For each quote:\n"
        prompt += "- Ensure it explicitly discusses the emotion or directly related emotional states\n"
        prompt += "- Provide the exact scripture reference (book, chapter, verse) for verification\n"
        prompt += "- Use only authoritative online sources for URLs (e.g., sacred-texts.com, accesstoinsight.org for Buddhism)\n"
        prompt += "- Do not use PDF downloads, Goodreads, or modern interpretations as sources\n\n"
        
        prompt += "Format the response as a JSON object with this structure:\n"
        prompt += "{\n"
        prompt += '  "summary": "A focused analysis of how this religion views this specific emotion, including whether it\'s seen as positive/negative/neutral and how followers should approach it",\n'
        prompt += '  "ideas": "Practical teachings and guidance about understanding, experiencing, and managing this specific emotion in daily life, backed by religious principles",\n'
        prompt += '  "quotes": [\n'
        prompt += '    {\n'
        prompt += '      "author": "Original source/speaker (e.g., Buddha, specific sutra)",\n'
        prompt += '      "scriptureSource": "Exact scripture reference (e.g., Dhammapada, Verse 203)",\n'
        prompt += '      "sourceURL": "URL to authoritative online source (not PDFs or modern interpretations)",\n'
        prompt += '      "quote": "The exact quote that explicitly discusses this emotion",\n'
        prompt += '      "relevance": "Clear explanation of how this quote directly addresses the emotion and provides guidance",\n'
        prompt += '      "tags": ["emotion-specific", "scripture-based", "relevant-theme"]\n'
        prompt += '    }\n'
        prompt += '  ]\n'
        prompt += "}"

        try:
            # Make API call with structured output
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json={
                    "model": "sonar",  # Using the lightweight sonar model
                    "messages": [
                        {"role": "system", "content": "You are a religious scholar expert specializing in canonical religious texts. Always respond in valid JSON format. For scripture quotes: 1) Use only primary religious texts, not modern interpretations 2) Provide exact references (book, chapter, verse) 3) Use authoritative online sources (e.g., sacred-texts.com, accesstoinsight.org), never PDFs or modern platforms like Goodreads."},
                        {"role": "user", "content": prompt}
                    ]
                }
            )
            
            if response and response.status_code == 200:
                data = response.json()
                logger.debug(f"API Response for {religion}: {data}")
                
                if 'choices' in data and len(data['choices']) > 0:
                    content = data['choices'][0]['message']['content']
                    logger.debug(f"Content being parsed: {content}")
                    
                    try:
                        religion_data = self.parse_response_content(content)
                        return ReligionData(
                            summary=religion_data["summary"],
                            ideas=religion_data["ideas"],
                            quotes=[Quote(**quote) for quote in religion_data["quotes"]]
                        )
                    except (json.JSONDecodeError, ValueError) as e:
                        logger.error(f"Error parsing response content: {str(e)}")
                        logger.debug(f"Content being parsed: {content}")
                        raise ValueError(f"Failed to parse API response content as JSON")
                else:
                    raise ValueError("No choices in API response")
            else:
                raise ValueError(f"API request failed with status code: {response.status_code}")
            
        except Exception as e:
            logger.error(f"Error generating {religion} data for {emotion_name}: {str(e)}")
            raise

    def generate_emotion(self, emotion_name: str) -> EmotionData:
        """Generate data for a single emotion across all religions."""
        logger.info(f"Starting generation for emotion: {emotion_name}")
        
        if emotion_name not in self.colors:
            raise ValueError(f"Color not found for emotion: {emotion_name}")
            
        try:
            emotion_data = EmotionData(
                name=emotion_name,
                color=self.colors[emotion_name],
                text=self.descriptions.get(emotion_name, "Description not found"),
                christianity=self.generate_religion_data(emotion_name, "Christianity"),
                buddhism=self.generate_religion_data(emotion_name, "Buddhism"),
                hinduism=self.generate_religion_data(emotion_name, "Hinduism"),
                islam=self.generate_religion_data(emotion_name, "Islam"),
                sikhism=self.generate_religion_data(emotion_name, "Sikhism")
            )
            
            # Save the generated data
            output_dir = Path(__file__).parent.parent / "data" / "output"
            output_dir.mkdir(exist_ok=True)
            
            output_file = output_dir / f"{emotion_name.lower().replace(' ', '_')}.json"
            with open(output_file, "w") as f:
                f.write(emotion_data.model_dump_json(indent=2))
                
            logger.info(f"Successfully generated and saved data for emotion: {emotion_name}")
            return emotion_data
            
        except Exception as e:
            logger.error(f"Error in emotion generation pipeline for {emotion_name}: {str(e)}")
            raise

def test_single_emotion():
    """Test the generator with a single emotion."""
    generator = EmotionGenerator()
    test_emotion = "Happy"  # We can change this to any emotion from the emotionData.ts
    
    try:
        result = generator.generate_emotion(test_emotion)
        logger.info(f"Successfully generated test data for emotion: {test_emotion}")
        return result
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")
        raise

def process_all_emotions():
    """Process all emotions from the emotion data."""
    generator = EmotionGenerator()
    
    # Get all emotions from our color dictionary
    emotions = list(EMOTION_COLORS.keys())
    
    # Find the index of "Scared" and start from the next emotion
    try:
        start_index = emotions.index("Angry") + 1
    except ValueError:
        start_index = 0
        logger.warning("Could not find 'Scared' in emotions list, starting from beginning")
    
    # Get the remaining emotions
    remaining_emotions = emotions[start_index:]
    logger.info(f"Starting to process {len(remaining_emotions)} remaining emotions (starting after 'Scared')")
    
    results = []
    failed_emotions = []
    
    for emotion in remaining_emotions:
        try:
            logger.info(f"Processing emotion: {emotion}")
            result = generator.generate_emotion(emotion)
            results.append(result)
            logger.info(f"Successfully processed emotion: {emotion}")
        except Exception as e:
            logger.error(f"Failed to process emotion {emotion}: {str(e)}")
            failed_emotions.append((emotion, str(e)))
    
    # Log summary
    logger.info(f"Completed processing remaining emotions")
    logger.info(f"Successfully processed: {len(results)} emotions")
    if failed_emotions:
        logger.error(f"Failed to process {len(failed_emotions)} emotions:")
        for emotion, error in failed_emotions:
            logger.error(f"- {emotion}: {error}")
    
    return results, failed_emotions

if __name__ == "__main__":
    process_all_emotions() 