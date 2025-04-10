from typing import Dict

EMOTION_COLORS = {
    # Inner emotions
    "Uncomfortable Emotions": "#90EE90",
    "Comfortable Emotions": "#FFD700",
    
    # Middle emotions
    "Sad": "#DDA0DD",
    "Scared": "#B19CD9",
    "Angry": "#87CEEB",
    "Embarrassed": "#98FB98",
    "Playful": "#FFA500",
    "Happy": "#FFB6C1",
    "Confident": "#FF6347",
    "Loved": "#FF69B4",
    
    # Outer emotions
    "Lonely": "#9370DB",
    "Hurt": "#8A2BE2",
    "Disappointed": "#9400D3",
    "Anxious": "#4169E1",
    "Powerless": "#1E90FF",
    "Overwhelmed": "#00BFFF",
    "Bored": "#87CEEB",
    "Jealous": "#20B2AA",
    "Annoyed": "#48D1CC",
    "Ashamed": "#3CB371",
    "Excluded": "#32CD32",
    "Guilty": "#228B22",
    "Affectionate": "#FFA500",
    "Curious": "#FF8C00",
    "Creative": "#FF7F50",
    "Caring": "#FFE4E1",
    "Grateful": "#FFC0CB",
    "Excited": "#FFB6C1",
    "Brave": "#FF0000",
    "Hopeful": "#FF4500",
    "Powerful": "#FF6347",
    "Respected": "#FF69B4",
    "Valued": "#FF1493",
    "Accepted": "#DC143C"
}

def load_emotion_colors() -> Dict[str, str]:
    """Returns a dictionary mapping emotion names to their color codes"""
    return EMOTION_COLORS 