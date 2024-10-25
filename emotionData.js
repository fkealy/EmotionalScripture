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
        Christianity: [
            {
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
        Christianity: [
            {
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
        Christianity: [
            {
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
        Christianity: [
            {
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
        Christianity: [
            {
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
        Christianity: [
            {
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
        Christianity: [
            {
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
        Christianity: [
            {
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
        Christianity: [
            {
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
        text: "It's okay to feel hurt—your feelings matter.", 
        parent: "Sad",
        Christianity: [
            {
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
        Christianity: [
            {
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
    // Scared cluster
    { 
        name: "Anxious", 
        color: "#4169E1", 
        text: "Anxiety is your mind trying to protect you.", 
        parent: "Scared",
        Christianity: [
            {
                scriptureSource: "Philippians 4:6-7",
                summary: "Encourages not to be anxious but to present requests to God.",
                ideas: "Prayer and thanksgiving bring peace beyond understanding.",
                similarTo: ["Peace", "Trust"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Philippians+4%3A6-7&version=NIV",
                        quote: "\"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.\""
                    }
                ]
            },
            {
                scriptureSource: "1 Peter 5:7",
                summary: "Cast all your anxiety on God because He cares for you.",
                ideas: "Trusting in God's care alleviates anxiety.",
                similarTo: ["Trust", "Care"],
                quotes: [
                    {
                        author: "Apostle Peter",
                        sourceURL: "https://www.biblegateway.com/passage/?search=1+Peter+5%3A7&version=NIV",
                        quote: "\"Cast all your anxiety on him because he cares for you.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Powerless", 
        color: "#1E90FF", 
        text: "This feeling will pass—let's explore your options.", 
        parent: "Scared",
        Christianity: [
            {
                scriptureSource: "2 Corinthians 12:9",
                summary: "Strength in weakness through God's grace.",
                ideas: "God's power is made perfect in weakness.",
                similarTo: ["Strength", "Grace"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=2+Corinthians+12%3A9&version=NIV",
                        quote: "\"My grace is sufficient for you, for my power is made perfect in weakness.\""
                    }
                ]
            },
            {
                scriptureSource: "Isaiah 40:29",
                summary: "God gives strength to the weary and increases the power of the weak.",
                ideas: "Divine empowerment in times of weakness.",
                similarTo: ["Strength", "Renewal"],
                quotes: [
                    {
                        author: "Prophet Isaiah",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Isaiah+40%3A29&version=NIV",
                        quote: "\"He gives strength to the weary and increases the power of the weak.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Overwhelmed", 
        color: "#00BFFF", 
        text: "Let's break things down into smaller pieces.", 
        parent: "Scared",
        Christianity: [
            {
                scriptureSource: "Psalm 61:2",
                summary: "Calling to God when overwhelmed.",
                ideas: "Seeking higher strength in times of feeling overwhelmed.",
                similarTo: ["Refuge", "Strength"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+61%3A2&version=NIV",
                        quote: "\"From the ends of the earth I call to you, I call as my heart grows faint; lead me to the rock that is higher than I.\""
                    }
                ]
            },
            {
                scriptureSource: "Matthew 11:28",
                summary: "Jesus offers rest to the weary.",
                ideas: "Finding rest in Christ when overwhelmed.",
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
    // Angry cluster
    { 
        name: "Bored", 
        color: "#87CEEB", 
        text: "Boredom can spark creativity and change.", 
        parent: "Angry",
        Christianity: [
            {
                scriptureSource: "Colossians 3:23",
                summary: "Work wholeheartedly as if for the Lord.",
                ideas: "Engage in activities with purpose to overcome boredom.",
                similarTo: ["Diligence", "Purpose"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Colossians+3%3A23&version=NIV",
                        quote: "\"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.\""
                    }
                ]
            },
            {
                scriptureSource: "Proverbs 19:15",
                summary: "Laziness brings on deep sleep, and the idle go hungry.",
                ideas: "Encourages active engagement to prevent idleness.",
                similarTo: ["Diligence", "Engagement"],
                quotes: [
                    {
                        author: "King Solomon",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Proverbs+19%3A15&version=NIV",
                        quote: "\"Laziness brings on deep sleep, and the shiftless go hungry.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Jealous", 
        color: "#20B2AA", 
        text: "Jealousy can help us understand our desires.", 
        parent: "Angry",
        Christianity: [
            {
                scriptureSource: "James 3:16",
                summary: "Envy leads to disorder and evil practices.",
                ideas: "Warns against jealousy and its negative effects.",
                similarTo: ["Contentment", "Peace"],
                quotes: [
                    {
                        author: "James the Just",
                        sourceURL: "https://www.biblegateway.com/passage/?search=James+3%3A16&version=NIV",
                        quote: "\"For where you have envy and selfish ambition, there you find disorder and every evil practice.\""
                    }
                ]
            },
            {
                scriptureSource: "Proverbs 14:30",
                summary: "Envy rots the bones.",
                ideas: "Encourages a peaceful heart over jealousy.",
                similarTo: ["Peace", "Health"],
                quotes: [
                    {
                        author: "King Solomon",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Proverbs+14%3A30&version=NIV",
                        quote: "\"A heart at peace gives life to the body, but envy rots the bones.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Annoyed", 
        color: "#48D1CC", 
        text: "What boundaries might need setting?", 
        parent: "Angry",
        Christianity: [
            {
                scriptureSource: "Proverbs 12:16",
                summary: "A prudent person overlooks an insult.",
                ideas: "Encourages patience and restraint when annoyed.",
                similarTo: ["Patience", "Self-control"],
                quotes: [
                    {
                        author: "King Solomon",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Proverbs+12%3A16&version=NIV",
                        quote: "\"Fools show their annoyance at once, but the prudent overlook an insult.\""
                    }
                ]
            },
            {
                scriptureSource: "Ephesians 4:2",
                summary: "Be completely humble and gentle; be patient.",
                ideas: "Practice patience and bear with one another in love.",
                similarTo: ["Humility", "Gentleness"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Ephesians+4%3A2&version=NIV",
                        quote: "\"Be completely humble and gentle; be patient, bearing with one another in love.\""
                    }
                ]
            }
        ]
    },
    // Embarrassed cluster
    { 
        name: "Ashamed", 
        color: "#3CB371", 
        text: "Shame doesn't define you—let's work through this.", 
        parent: "Embarrassed",
        Christianity: [
            {
                scriptureSource: "Romans 8:1",
                summary: "No condemnation for those in Christ.",
                ideas: "Freedom from shame through faith.",
                similarTo: ["Freedom", "Forgiveness"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Romans+8%3A1&version=NIV",
                        quote: "\"Therefore, there is now no condemnation for those who are in Christ Jesus.\""
                    }
                ]
            },
            {
                scriptureSource: "Psalm 34:5",
                summary: "Those who look to God are radiant; their faces are never covered with shame.",
                ideas: "Trust in God removes shame.",
                similarTo: ["Trust", "Radiance"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+34%3A5&version=NIV",
                        quote: "\"Those who look to him are radiant; their faces are never covered with shame.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Excluded", 
        color: "#32CD32", 
        text: "This feeling is temporary—there are people who care.", 
        parent: "Embarrassed",
        Christianity: [
            {
                scriptureSource: "Ephesians 2:19",
                summary: "We are no longer foreigners but fellow citizens.",
                ideas: "Belonging to the community of believers.",
                similarTo: ["Belonging", "Community"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Ephesians+2%3A19&version=NIV",
                        quote: "\"Consequently, you are no longer foreigners and strangers, but fellow citizens with God's people and also members of his household.\""
                    }
                ]
            },
            {
                scriptureSource: "Psalm 27:10",
                summary: "Even if family forsakes me, the Lord will receive me.",
                ideas: "God accepts us even if others exclude us.",
                similarTo: ["Acceptance", "Divine Love"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+27%3A10&version=NIV",
                        quote: "\"Though my father and mother forsake me, the Lord will receive me.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Guilty", 
        color: "#228B22", 
        text: "Guilt can guide us to align with our values.", 
        parent: "Embarrassed",
        Christianity: [
            {
                scriptureSource: "1 John 1:9",
                summary: "Confession leads to forgiveness and purification.",
                ideas: "Acknowledging guilt allows for forgiveness.",
                similarTo: ["Forgiveness", "Cleansing"],
                quotes: [
                    {
                        author: "Apostle John",
                        sourceURL: "https://www.biblegateway.com/passage/?search=1+John+1%3A9&version=NIV",
                        quote: "\"If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.\""
                    }
                ]
            },
            {
                scriptureSource: "Romans 3:23-24",
                summary: "All have sinned but are justified freely by grace.",
                ideas: "Everyone experiences guilt, but grace offers redemption.",
                similarTo: ["Grace", "Justification"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Romans+3%3A23-24&version=NIV",
                        quote: "\"For all have sinned and fall short of the glory of God, and all are justified freely by his grace through the redemption that came by Christ Jesus.\""
                    }
                ]
            }
        ]
    },
    // Playful cluster
    { 
        name: "Affectionate", 
        color: "#FFA500", 
        text: "Affection connects us to others.", 
        parent: "Playful",
        Christianity: [
            {
                scriptureSource: "1 John 4:7",
                summary: "Let us love one another, for love comes from God.",
                ideas: "Affection reflects divine love.",
                similarTo: ["Love", "Brotherly Love"],
                quotes: [
                    {
                        author: "Apostle John",
                        sourceURL: "https://www.biblegateway.com/passage/?search=1+John+4%3A7&version=NIV",
                        quote: "\"Dear friends, let us love one another, for love comes from God.\""
                    }
                ]
            },
            {
                scriptureSource: "John 13:34",
                summary: "A new command to love one another as Jesus loved us.",
                ideas: "Expressing affection through love is a commandment.",
                similarTo: ["Love", "Commandment"],
                quotes: [
                    {
                        author: "Jesus Christ",
                        sourceURL: "https://www.biblegateway.com/passage/?search=John+13%3A34&version=NIV",
                        quote: "\"A new command I give you: Love one another. As I have loved you, so you must love one another.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Curious", 
        color: "#FF8C00", 
        text: "Curiosity leads to growth and learning.", 
        parent: "Playful",
        Christianity: [
            {
                scriptureSource: "Proverbs 25:2",
                summary: "It is the glory of God to conceal a matter; to search out a matter is the glory of kings.",
                ideas: "Encourages seeking knowledge and understanding.",
                similarTo: ["Wisdom", "Discovery"],
                quotes: [
                    {
                        author: "King Solomon",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Proverbs+25%3A2&version=NIV",
                        quote: "\"It is the glory of God to conceal a matter; to search out a matter is the glory of kings.\""
                    }
                ]
            },
            {
                scriptureSource: "Matthew 7:7",
                summary: "Ask, seek, knock; and it will be given to you.",
                ideas: "Encourages active seeking and inquiry.",
                similarTo: ["Seeking", "Persistence"],
                quotes: [
                    {
                        author: "Jesus Christ",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Matthew+7%3A7&version=NIV",
                        quote: "\"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Creative", 
        color: "#FF7F50", 
        text: "Creativity helps us solve problems and express ourselves.", 
        parent: "Playful",
        Christianity: [
            {
                scriptureSource: "Exodus 35:31-32",
                summary: "God filled Bezalel with skill, ability, and knowledge in all kinds of crafts.",
                ideas: "Creativity is a gift from God.",
                similarTo: ["Skill", "Craftsmanship"],
                quotes: [
                    {
                        author: "Moses",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Exodus+35%3A31-32&version=NIV",
                        quote: "\"And he has filled him with the Spirit of God, with wisdom, with understanding, with knowledge and with all kinds of skills.\""
                    }
                ]
            },
            {
                scriptureSource: "Genesis 1:27",
                summary: "Humans are created in God's image.",
                ideas: "We reflect God's creativity.",
                similarTo: ["Image of God", "Creation"],
                quotes: [
                    {
                        author: "Moses",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Genesis+1%3A27&version=NIV",
                        quote: "\"So God created mankind in his own image, in the image of God he created them; male and female he created them.\""
                    }
                ]
            }
        ]
    },
    // Happy cluster
    { 
        name: "Caring", 
        color: "#FFE4E1", 
        text: "Your capacity to care is valuable.", 
        parent: "Happy",
        Christianity: [
            {
                scriptureSource: "Galatians 6:2",
                summary: "Carry each other's burdens.",
                ideas: "Caring for others fulfills Christ's law.",
                similarTo: ["Compassion", "Support"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Galatians+6%3A2&version=NIV",
                        quote: "\"Carry each other's burdens, and in this way you will fulfill the law of Christ.\""
                    }
                ]
            },
            {
                scriptureSource: "Philippians 2:4",
                summary: "Look not only to your own interests but also to the interests of others.",
                ideas: "Encourages selflessness and caring for others.",
                similarTo: ["Selflessness", "Concern"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Philippians+2%3A4&version=NIV",
                        quote: "\"Not looking to your own interests but each of you to the interests of the others.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Grateful", 
        color: "#FFC0CB", 
        text: "Gratitude helps us appreciate life's gifts.", 
        parent: "Happy",
        Christianity: [
            {
                scriptureSource: "1 Thessalonians 5:18",
                summary: "Give thanks in all circumstances.",
                ideas: "Gratitude is God's will for us.",
                similarTo: ["Thankfulness", "Contentment"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=1+Thessalonians+5%3A18&version=NIV",
                        quote: "\"Give thanks in all circumstances; for this is God's will for you in Christ Jesus.\""
                    }
                ]
            },
            {
                scriptureSource: "Psalm 107:1",
                summary: "Give thanks to the Lord for He is good.",
                ideas: "Expressing gratitude for God's enduring love.",
                similarTo: ["Thankfulness", "Praise"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+107%3A1&version=NIV",
                        quote: "\"Give thanks to the Lord, for he is good; his love endures forever.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Excited", 
        color: "#FFB6C1", 
        text: "Excitement energizes us for what is ahead.", 
        parent: "Happy",
        Christianity: [
            {
                scriptureSource: "Psalm 37:4",
                summary: "Delight in the Lord and He will give you the desires of your heart.",
                ideas: "Joy in God leads to fulfillment.",
                similarTo: ["Joy", "Desire"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+37%3A4&version=NIV",
                        quote: "\"Take delight in the Lord, and he will give you the desires of your heart.\""
                    }
                ]
            },
            {
                scriptureSource: "Romans 12:11",
                summary: "Never be lacking in zeal.",
                ideas: "Maintain enthusiasm in serving the Lord.",
                similarTo: ["Zeal", "Enthusiasm"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Romans+12%3A11&version=NIV",
                        quote: "\"Never be lacking in zeal, but keep your spiritual fervor, serving the Lord.\""
                    }
                ]
            }
        ]
    },
    // Confident cluster
    { 
        name: "Brave", 
        color: "#FF0000", 
        text: "Courage is not about not feeling fear—it's about facing it.", 
        parent: "Confident",
        Christianity: [
            {
                scriptureSource: "Joshua 1:9",
                summary: "Be strong and courageous; God is with you.",
                ideas: "Divine presence empowers bravery.",
                similarTo: ["Courage", "Strength"],
                quotes: [
                    {
                        author: "God speaking to Joshua",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Joshua+1%3A9&version=NIV",
                        quote: "\"Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.\""
                    }
                ]
            },
            {
                scriptureSource: "Psalm 27:1",
                summary: "The Lord is my light and salvation—whom shall I fear?",
                ideas: "Trust in God removes fear and instills bravery.",
                similarTo: ["Fearlessness", "Trust"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+27%3A1&version=NIV",
                        quote: "\"The Lord is my light and my salvation—whom shall I fear?\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Hopeful", 
        color: "#FF4500", 
        text: "Hope helps us move forward.", 
        parent: "Confident",
        Christianity: [
            {
                scriptureSource: "Romans 15:13",
                summary: "God fills you with joy and peace as you trust in Him, so you may overflow with hope.",
                ideas: "Faith leads to abundant hope.",
                similarTo: ["Faith", "Joy"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Romans+15%3A13&version=NIV",
                        quote: "\"May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope.\""
                    }
                ]
            },
            {
                scriptureSource: "Jeremiah 29:11",
                summary: "God has plans to give you hope and a future.",
                ideas: "Divine plans instill hope.",
                similarTo: ["Future", "Prosperity"],
                quotes: [
                    {
                        author: "Prophet Jeremiah",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Jeremiah+29%3A11&version=NIV",
                        quote: "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Powerful", 
        color: "#FF6347", 
        text: "You have strengths and capabilities.", 
        parent: "Confident",
        Christianity: [
            {
                scriptureSource: "Ephesians 3:20",
                summary: "God is able to do immeasurably more than all we ask or imagine, according to His power at work within us.",
                ideas: "Divine power works within us.",
                similarTo: ["Strength", "Divine Power"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Ephesians+3%3A20&version=NIV",
                        quote: "\"Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.\""
                    }
                ]
            },
            {
                scriptureSource: "2 Timothy 1:7",
                summary: "God gave us a spirit not of fear but of power, love, and self-discipline.",
                ideas: "We are empowered by God's Spirit.",
                similarTo: ["Empowerment", "Self-discipline"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=2+Timothy+1%3A7&version=NIV",
                        quote: "\"For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.\""
                    }
                ]
            }
        ]
    },
    // Loved cluster
    { 
        name: "Respected", 
        color: "#FF69B4", 
        text: "Respect is a fundamental human need.", 
        parent: "Loved",
        Christianity: [
            {
                scriptureSource: "1 Peter 2:17",
                summary: "Show proper respect to everyone.",
                ideas: "Respect is a commandment for all relationships.",
                similarTo: ["Honor", "Love"],
                quotes: [
                    {
                        author: "Apostle Peter",
                        sourceURL: "https://www.biblegateway.com/passage/?search=1+Peter+2%3A17&version=NIV",
                        quote: "\"Show proper respect to everyone, love the family of believers, fear God, honor the emperor.\""
                    }
                ]
            },
            {
                scriptureSource: "Romans 12:10",
                summary: "Honor one another above yourselves.",
                ideas: "Respect others deeply.",
                similarTo: ["Honor", "Brotherly Love"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Romans+12%3A10&version=NIV",
                        quote: "\"Be devoted to one another in love. Honor one another above yourselves.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Valued", 
        color: "#FF1493", 
        text: "Your worth is inherent and real.", 
        parent: "Loved",
        Christianity: [
            {
                scriptureSource: "Matthew 10:31",
                summary: "You are worth more than many sparrows.",
                ideas: "God values each person greatly.",
                similarTo: ["Worth", "Divine Care"],
                quotes: [
                    {
                        author: "Jesus Christ",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Matthew+10%3A31&version=NIV",
                        quote: "\"So don't be afraid; you are worth more than many sparrows.\""
                    }
                ]
            },
            {
                scriptureSource: "Psalm 139:14",
                summary: "You are fearfully and wonderfully made.",
                ideas: "Recognize your intrinsic value as God's creation.",
                similarTo: ["Identity", "Praise"],
                quotes: [
                    {
                        author: "Psalmist",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Psalm+139%3A14&version=NIV",
                        quote: "\"I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.\""
                    }
                ]
            }
        ]
    },
    { 
        name: "Accepted", 
        color: "#DC143C", 
        text: "You deserve to feel accepted and valued.", 
        parent: "Loved",
        Christianity: [
            {
                scriptureSource: "Romans 15:7",
                summary: "Accept one another as Christ accepted you.",
                ideas: "Mutual acceptance reflects Christ's acceptance of us.",
                similarTo: ["Unity", "Love"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Romans+15%3A7&version=NIV",
                        quote: "\"Accept one another, then, just as Christ accepted you, in order to bring praise to God.\""
                    }
                ]
            },
            {
                scriptureSource: "Ephesians 1:5-6",
                summary: "God predestined us for adoption through Jesus Christ.",
                ideas: "We are accepted into God's family.",
                similarTo: ["Adoption", "Grace"],
                quotes: [
                    {
                        author: "Apostle Paul",
                        sourceURL: "https://www.biblegateway.com/passage/?search=Ephesians+1%3A5-6&version=NIV",
                        quote: "\"He predestined us for adoption to sonship through Jesus Christ... to the praise of his glorious grace, which he has freely given us in the One he loves.\""
                    }
                ]
            }
        ]
    }
];

// Export statements
export { innerEmotions, middleEmotions, outerEmotions };