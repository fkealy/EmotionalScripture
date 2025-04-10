"""
Store emotion data including descriptions and colors.
"""

EMOTION_COLORS = {
    "Happy": "#FFB6C1",
    "Sad": "#DDA0DD",
    "Scared": "#B19CD9",
    "Angry": "#87CEEB",
    "Embarrassed": "#98FB98",
    "Playful": "#FFA500",
    "Confident": "#FF6347",
    "Loved": "#FF69B4",
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

EMOTION_DESCRIPTIONS = {
    "Happy": "Happiness comes in many forms and intensities.",
    "Sad": "Sadness is a natural response to loss or disappointment.",
    "Scared": "Fear is your mind trying to keep you safe.",
    "Angry": "Anger can signal that something needs to change.",
    "Embarrassed": "Everyone feels embarrassed sometimes—it is part of being human.",
    "Playful": "Playfulness helps us stay creative and light-hearted.",
    "Confident": "Confidence helps us face challenges and try new things.",
    "Loved": "Love connects us to others and ourselves.",
    "Lonely": "Feeling lonely is a signal that you value connection.",
    "Hurt": "It's okay to feel hurt—your feelings matter.",
    "Disappointed": "Disappointment shows you care about outcomes.",
    "Anxious": "Anxiety is your mind trying to protect you.",
    "Powerless": "This feeling will pass—let's explore your options.",
    "Overwhelmed": "Let's break things down into smaller pieces.",
    "Bored": "Boredom can spark creativity and change.",
    "Jealous": "Jealousy can help us understand our desires.",
    "Annoyed": "What boundaries might need setting?",
    "Ashamed": "Shame doesn't define you—let's work through this.",
    "Excluded": "This feeling is temporary—there are people who care.",
    "Guilty": "Guilt can guide us to align with our values.",
    "Affectionate": "Affection connects us to others.",
    "Curious": "Curiosity leads to growth and learning.",
    "Creative": "Creativity helps us solve problems and express ourselves.",
    "Caring": "Your capacity to care is valuable.",
    "Grateful": "Gratitude helps us appreciate life's gifts.",
    "Excited": "Excitement energizes us for what is ahead.",
    "Brave": "Courage is not about not feeling fear—it's about facing it.",
    "Hopeful": "Hope helps us move forward.",
    "Powerful": "You have strengths and capabilities.",
    "Respected": "Respect is a fundamental human need.",
    "Valued": "Your worth is inherent and real.",
    "Accepted": "You deserve to feel accepted and valued."
}

EMOTION_HIERARCHY = {
    "Uncomfortable Emotions": {
        "color": "#90EE90",
        "text": "These emotions might feel challenging, but they are normal and valid.",
        "children": ["Sad", "Scared", "Angry", "Embarrassed"]
    },
    "Comfortable Emotions": {
        "color": "#FFD700",
        "text": "These emotions often feel pleasant and help us thrive.",
        "children": ["Happy", "Loved", "Confident", "Playful"]
    },
    "Sad": {
        "parent": "Uncomfortable Emotions",
        "children": ["Lonely", "Hurt", "Disappointed"]
    },
    "Scared": {
        "parent": "Uncomfortable Emotions",
        "children": ["Anxious", "Powerless", "Overwhelmed"]
    },
    "Angry": {
        "parent": "Uncomfortable Emotions",
        "children": ["Bored", "Jealous", "Annoyed"]
    },
    "Embarrassed": {
        "parent": "Uncomfortable Emotions",
        "children": ["Ashamed", "Excluded", "Guilty"]
    },
    "Playful": {
        "parent": "Comfortable Emotions",
        "children": ["Affectionate", "Curious", "Creative"]
    },
    "Happy": {
        "parent": "Comfortable Emotions",
        "children": ["Caring", "Grateful", "Excited"]
    },
    "Confident": {
        "parent": "Comfortable Emotions",
        "children": ["Brave", "Hopeful", "Powerful"]
    },
    "Loved": {
        "parent": "Comfortable Emotions",
        "children": ["Respected", "Valued", "Accepted"]
    }
} 