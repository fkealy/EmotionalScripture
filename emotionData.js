// Updated emotions data with scriptures from the Bible and Christianity

const innerEmotions = [
    { 
        name: "Uncomfortable\nEmotions",
        color: "#90EE90",
        text: "These emotions might feel challenging, but they are normal and valid.",
        children: ["Sad", "Scared", "Angry", "Embarrassed"]
    },
    { 
        name: "Comfortable\nEmotions",
        color: "#FFD700",
        text: "These emotions often feel pleasant and help us thrive.",
        children: ["Happy", "Loved", "Confident", "Playful"]
    }
];

const middleEmotions = [
    { 
        name: "Sad",
        color: "#DDA0DD",
        text: "Sadness is a natural response to loss or disappointment.",
        parent: "Uncomfortable Emotions",
        children: ["Lonely", "Hurt", "Disappointed"],
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Psalm 34:18",
                summary: "God is close to those who are brokenhearted.",
                ideas: "In times of sadness, God's presence offers comfort.",
                similarTo: ["Comfort", "Hope"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+34%3A18&version=NIV",
                        quote: "\"The Lord is close to the brokenhearted and saves those who are crushed in spirit.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Matthew 5:4",
                summary: "Those who mourn will be comforted.",
                ideas: "Acknowledging sorrow opens the way for divine comfort.",
                similarTo: ["Comfort", "Blessing"],
                quotes: [
                    {
                        author: "Jesus Christ",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Matthew+5%3A4&version=NIV",
                        quote: "\"Blessed are those who mourn, for they will be comforted.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Scared",
        color: "#B19CD9",
        text: "Fear is your mind trying to keep you safe.",
        parent: "Uncomfortable Emotions",
        children: ["Anxious", "Powerless", "Overwhelmed"],
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Isaiah 41:10",
                summary: "God encourages us not to fear because He is with us.",
                ideas: "Divine presence provides strength and help in fearful times.",
                similarTo: ["Courage", "Faith"],
                quotes: [
                    {
                        author: "Prophet Isaiah",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Isaiah+41%3A10&version=NIV",
                        quote: "\"So do not fear, for I am with you; do not be dismayed, for I am your God.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Psalm 56:3",
                summary: "Trusting in God when afraid.",
                ideas: "Faith can alleviate fear.",
                similarTo: ["Trust", "Faith"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+56%3A3&version=NIV",
                        quote: "\"When I am afraid, I put my trust in you.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Angry",
        color: "#87CEEB",
        text: "Anger can signal that something needs to change.",
        parent: "Uncomfortable Emotions",
        children: ["Bored", "Jealous", "Annoyed"],
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Ephesians 4:26",
                summary: "Be angry but do not sin; resolve issues promptly.",
                ideas: "Manage anger responsibly without letting it lead to wrongdoing.",
                similarTo: ["Self-control", "Reconciliation"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Ephesians+4%3A26&version=NIV",
                        quote: "\"In your anger do not sin: Do not let the sun go down while you are still angry.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "James 1:19-20",
                summary: "Be slow to anger; human anger doesn't produce righteousness.",
                ideas: "Practice patience and listening to manage anger.",
                similarTo: ["Patience", "Righteousness"],
                quotes: [
                    {
                        author: "James the Just",
                        sourceURL: "https://www.biblegateway.com/passage/?search=James+1%3A19-20&version=NIV",
                        quote: "\"Everyone should be quick to listen, slow to speak and slow to become angry.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Embarrassed",
        color: "#98FB98",
        text: "Everyone feels embarrassed sometimes—it is part of being human.",
        parent: "Uncomfortable Emotions",
        children: ["Ashamed", "Excluded", "Guilty"],
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Romans 10:11",
                summary: "Belief in God prevents shame.",
                ideas: "Faith brings confidence and removes shame.",
                similarTo: ["Confidence", "Faith"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Romans+10%3A11&version=NIV",
                        quote: "\"Anyone who believes in him will never be put to shame.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Psalm 25:3",
                summary: "Trusting in God leads away from shame.",
                ideas: "Dependence on God alleviates feelings of embarrassment.",
                similarTo: ["Trust", "Hope"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+25%3A3&version=NIV",
                        quote: "\"No one who hopes in you will ever be put to shame.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Playful",
        color: "#FFA500",
        text: "Playfulness helps us stay creative and light-hearted.",
        parent: "Comfortable Emotions",
        children: ["Affectionate", "Curious", "Creative"],
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Ecclesiastes 3:4",
                summary: "There is a time for everything, including laughter and dance.",
                ideas: "Embrace joyful moments as part of life's balance.",
                similarTo: ["Joy", "Celebration"],
                quotes: [
                    {
                        author: "King Solomon",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Ecclesiastes+3%3A4&version=NIV",
                        quote: "\"A time to weep and a time to laugh, a time to mourn and a time to dance.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Matthew 18:3",
                summary: "Encourages childlike qualities.",
                ideas: "Adopting a childlike attitude can bring joy and openness.",
                similarTo: ["Innocence", "Openness"],
                quotes: [
                    {
                        author: "Jesus Christ",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Matthew+18%3A3&version=NIV",
                        quote: "\"Unless you change and become like little children, you will never enter the kingdom of heaven.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Happy",
        color: "#FFB6C1",
        text: "Happiness comes in many forms and intensities.",
        parent: "Comfortable Emotions",
        children: ["Caring", "Grateful", "Excited"],
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Philippians 4:4",
                summary: "Encourages constant rejoicing in the Lord.",
                ideas: "Spiritual joy is a continuous state of being.",
                similarTo: ["Joy", "Rejoicing"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Philippians+4%3A4&version=NIV",
                        quote: "\"Rejoice in the Lord always. I will say it again: Rejoice!\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Psalm 16:11",
                summary: "God's presence fills us with joy.",
                ideas: "True happiness is found in a relationship with God.",
                similarTo: ["Joy", "Fulfillment"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+16%3A11&version=NIV",
                        quote: "\"You make known to me the path of life; you will fill me with joy in your presence.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Confident",
        color: "#FF6347",
        text: "Confidence helps us face challenges and try new things.",
        parent: "Comfortable Emotions",
        children: ["Brave", "Hopeful", "Powerful"],
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Philippians 4:13",
                summary: "Strength comes through Christ.",
                ideas: "Faith empowers us to do all things.",
                similarTo: ["Strength", "Empowerment"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Philippians+4%3A13&version=NIV",
                        quote: "\"I can do all this through him who gives me strength.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Hebrews 10:35-36",
                summary: "Do not throw away your confidence; it will be rewarded.",
                ideas: "Perseverance in confidence leads to fulfillment of God's promises.",
                similarTo: ["Perseverance", "Faith"],
                quotes: [
                    {
                        author: "Unknown (traditionally attributed to Paul)",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Hebrews+10%3A35-36&version=NIV",
                        quote: "\"So do not throw away your confidence; it will be richly rewarded.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Loved",
        color: "#FF69B4",
        text: "Love connects us to others and ourselves.",
        parent: "Comfortable Emotions",
        children: ["Respected", "Valued", "Accepted"],
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "1 Corinthians 13:4-7",
                summary: "Describes the nature of true love.",
                ideas: "Love is patient, kind, and enduring.",
                similarTo: ["Compassion", "Kindness"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=1+Corinthians+13%3A4-7&version=NIV",
                        quote: "\"Love is patient, love is kind. It does not envy, it does not boast, it is not proud.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "John 15:12",
                summary: "Jesus commands us to love one another.",
                ideas: "Love others as a reflection of divine love.",
                similarTo: ["Compassion", "Service"],
                quotes: [
                    {
                        author: "Jesus Christ",
                        sourceURL: "https://www.biblegateway.com/passage/?search=John+15%3A12&version=NIV",
                        quote: "\"My command is this: Love each other as I have loved you.\""
                    }
                ]
            }
        ]
    }
];

// Outer emotions data with scriptures from the Bible and Christianity

const outerEmotions = [
    // Sad cluster
    { 
        name: "Lonely", 
        color: "#9370DB", 
        text: "Feeling lonely is a signal that you value connection.", 
        parent: "Sad",
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Hebrews 13:5",
                summary: "God promises to never leave us.",
                ideas: "Divine companionship in times of loneliness.",
                similarTo: ["Companionship", "Presence"],
                quotes: [
                    {
                        author: "Unknown (traditionally attributed to Paul)",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Hebrews+13%3A5&version=NIV",
                        quote: "\"Never will I leave you; never will I forsake you.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Psalm 68:6",
                summary: "God places the lonely in families.",
                ideas: "God provides community and belonging.",
                similarTo: ["Belonging", "Community"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+68%3A6&version=NIV",
                        quote: "\"God sets the lonely in families.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Hurt", 
        color: "#8A2BE2", 
        text: "It is okay to feel hurt—your feelings matter.", 
        parent: "Sad",
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Psalm 147:3",
                summary: "God heals the brokenhearted.",
                ideas: "Divine healing for emotional wounds.",
                similarTo: ["Healing", "Comfort"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+147%3A3&version=NIV",
                        quote: "\"He heals the brokenhearted and binds up their wounds.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Matthew 11:28",
                summary: "Jesus offers rest to those who are weary and burdened.",
                ideas: "Finding solace in God's presence.",
                similarTo: ["Rest", "Relief"],
                quotes: [
                    {
                        author: "Jesus Christ",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Matthew+11%3A28&version=NIV",
                        quote: "\"Come to me, all you who are weary and burdened, and I will give you rest.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Disappointed", 
        color: "#9400D3", 
        text: "Disappointment shows you care about outcomes.", 
        parent: "Sad",
        scripture: [
            {
                philosophy: "Christianity",
                scriptureSource: "Proverbs 13:12",
                summary: "Hope deferred makes the heart sick.",
                ideas: "Unrealized desires can cause emotional pain.",
                similarTo: ["Hope", "Expectation"],
                quotes: [
                    {
                        author: "King Solomon",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Proverbs+13%3A12&version=NIV",
                        quote: "\"Hope deferred makes the heart sick, but a longing fulfilled is a tree of life.\""
                    }
                ]
            },
            {
                philosophy: "Christianity",
                scriptureSource: "Romans 5:5",
                summary: "Hope in God does not disappoint.",
                ideas: "Faith sustains us beyond disappointment.",
                similarTo: ["Perseverance", "Faith"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Romans+5%3A5&version=NIV",
                        quote: "\"And hope does not put us to shame, because God's love has been poured out into our hearts.\""
                    }
                ]
            }
        ]
    },
    // Continue with other outer emotions similarly...
];

// Add these export statements at the end of the file
export { innerEmotions, middleEmotions, outerEmotions };
