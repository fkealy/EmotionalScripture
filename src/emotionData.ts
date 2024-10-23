        // Updated emotions data
      export  const innerEmotions = [
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

     export const middleEmotions = [
          { 
              name: "Sad",
              color: "#DDA0DD",
              text: "Sadness is a natural response to loss or disappointment.",
              parent: "Uncomfortable Emotions",
              children: ["Lonely", "Hurt", "Disappointed"]
          },
          { 
              name: "Scared",
              color: "#B19CD9",
              text: "Fear is your mind trying to keep you safe.",
              parent: "Uncomfortable Emotions",
              children: ["Anxious", "Powerless", "Overwhelmed"]
          },
          { 
              name: "Angry",
              color: "#87CEEB",
              text: "Anger can signal that something needs to change.",
              parent: "Uncomfortable Emotions",
              children: ["Bored", "Jealous", "Annoyed"]
          },
          { 
              name: "Embarrassed",
              color: "#98FB98",
              text: "Everyone feels embarrassed sometimes - it is part of being human.",
              parent: "Uncomfortable Emotions",
              children: ["Ashamed", "Excluded", "Guilty"]
          },
          { 
              name: "Playful",
              color: "#FFA500",
              text: "Playfulness helps us stay creative and light-hearted.",
              parent: "Comfortable Emotions",
              children: ["Affectionate", "Curious", "Creative"]
          },
          { 
              name: "Happy",
              color: "#FFB6C1",
              text: "Happiness comes in many forms and intensities.",
              parent: "Comfortable Emotions",
              children: ["Caring", "Grateful", "Excited"]
          },
          { 
              name: "Confident",
              color: "#FF6347",
              text: "Confidence helps us face challenges and try new things.",
              parent: "Comfortable Emotions",
              children: ["Brave", "Hopeful", "Powerful"]
          },
          { 
              name: "Loved",
              color: "#FF69B4",
              text: "Love connects us to others and ourselves.",
              parent: "Comfortable Emotions",
              children: ["Respected", "Valued", "Accepted"]
          }
      ];

    export  const outerEmotions = [
          // Sad cluster
          { name: "Lonely", color: "#9370DB", text: "Feeling lonely is a signal that you value connection.", parent: "Sad" },
          { name: "Hurt", color: "#8A2BE2", text: "It is okay to feel hurt - your feelings matter.", parent: "Sad" },
          { name: "Disappointed", color: "#9400D3", text: "Disappointment shows you care about outcomes.", parent: "Sad" },
          
          // Scared cluster
          { name: "Anxious", color: "#4169E1", text: "Anxiety is your mind trying to protect you.", parent: "Scared" },
          { name: "Powerless", color: "#1E90FF", text: "This feeling will pass - let us explore your options.", parent: "Scared" },
          { name: "Overwhelmed", color: "#00BFFF", text: "Let us break things down into smaller pieces.", parent: "Scared" },
          
          // Angry cluster
          { name: "Bored", color: "#87CEEB", text: "Boredom can spark creativity and change.", parent: "Angry" },
          { name: "Jealous", color: "#20B2AA", text: "Jealousy can help us understand our desires.", parent: "Angry" },
          { name: "Annoyed", color: "#48D1CC", text: "What boundaries might need setting?", parent: "Angry" },
          
          // Embarrassed cluster
          { name: "Ashamed", color: "#3CB371", text: "Shame does not define you - let us work through this.", parent: "Embarrassed" },
          { name: "Excluded", color: "#32CD32", text: "This feeling is temporary - there are people who care.", parent: "Embarrassed" },
          { name: "Guilty", color: "#228B22", text: "Guilt can guide us to align with our values.", parent: "Embarrassed" },
          
          // Playful cluster
          { name: "Affectionate", color: "#FFA500", text: "Affection connects us to others.", parent: "Playful" },
          { name: "Curious", color: "#FF8C00", text: "Curiosity leads to growth and learning.", parent: "Playful" },
          { name: "Creative", color: "#FF7F50", text: "Creativity helps us solve problems and express ourselves.", parent: "Playful" },
          
          // Happy cluster
          { name: "Caring", color: "#FFE4E1", text: "Your capacity to care is valuable.", parent: "Happy" },
          { name: "Grateful", color: "#FFC0CB", text: "Gratitude helps us appreciate life's gifts.", parent: "Happy" },
          { name: "Excited", color: "#FFB6C1", text: "Excitement energizes us for what is ahead.", parent: "Happy" },
          
          // Confident cluster
          { name: "Brave", color: "#FF0000", text: "Courage is not about not feeling fear - it is about facing it.", parent: "Confident" },
          { name: "Hopeful", color: "#FF4500", text: "Hope helps us move forward.", parent: "Confident" },
          { name: "Powerful", color: "#FF6347", text: "You have strengths and capabilities.", parent: "Confident" },
          
          // Loved cluster
          { name: "Respected", color: "#FF69B4", text: "Respect is a fundamental human need.", parent: "Loved" },
          { name: "Valued", color: "#FF1493", text: "Your worth is inherent and real.", parent: "Loved" },
          { name: "Accepted", color: "#DC143C", text: "You deserve to feel accepted and valued.", parent: "Loved" }
      ];