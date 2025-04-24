'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createDefaultAnalyzer } from '@/utils/ChatAnalyzer';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

type ResponseType = 'memory' | 'nickname' | 'joke' | 'music' | 'special' | 'wish' | 'chat';

// Knowledge base for RAG-like functionality
const knowledgeBase = {
  birthday: {
    cake: "Birthday cakes started in ancient Greece! They made round cakes to honor Artemis, the moon goddess. The candles represented moonlight!",
    song: "The 'Happy Birthday' song is from 1893! It was first called 'Good Morning to All' and written by two sisters, Patty and Mildred Hill.",
    presents: "Birthday gifts started in Europe because people thought evil spirits visited on birthdays, so friends brought gifts to ward them off!",
    candles: "Adding candles for each year started in Germany. They put a big candle called 'lebensklicht' (light of life) in the middle.",
    wishes: "Making wishes before blowing candles started because people believed the smoke carried wishes to heaven!",
    facts: "Birthdays weren't celebrated much until the 1800s because keeping birth records wasn't common before then."
  },
  
  facts: {
    space: "There are more stars in the universe than grains of sand on all Earth beaches! The universe is truly mind-blowing.",
    ocean: "The ocean is deeper than Mount Everest is tall! The Mariana Trench goes down about 11 kilometers.",
    animals: "A blue whale's heart is so big that a human could swim through its arteries! They're the largest animals ever.",
    technology: "The first computer programmer was a woman named Ada Lovelace who wrote the first algorithm in the 1840s!",
    food: "Honey never spoils! Archaeologists found 3,000-year-old honey in Egyptian tombs that's still perfectly good!",
    music: "Your brain processes music in the same area as language, which is why songs get stuck in your head so easily!",
    friendship: "Strong friendships can boost your immune system and even increase your lifespan according to science!"
  },
  
  aviu: {
    // Add personalized facts about Aviu here (this is placeholder)
    traits: "You're one of the most thoughtful people I know, always remembering little details about everyone!",
    memories: "Remember that time we stayed up way too late talking about everything and nothing? Best night ever!",
    friendship: "I'm so lucky to have you as a friend - you always know how to make me laugh even on the worst days."
  }
};

// Create a utility function to get personalized content based on the chat data
function getPersonalizedContent() {
  // Sample from the chat (from the small sample shared)
  const sampleChat = `03/11/20, 7:34 pm - Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more.
03/11/20, 7:34 pm - Avii: <Media omitted>
03/11/20, 7:34 pm - Avii: <Media omitted>
03/11/20, 7:35 pm - Avii: Its me yashasvi
03/11/20, 7:35 pm - Divija Joshi: Oh hii
03/11/20, 7:35 pm - Divija Joshi: I didnt recognize ur voice
03/11/20, 7:35 pm - Avii: Well i have multiple voices
03/11/20, 7:35 pm - Divija Joshi: I was just gonna block u😂
03/11/20, 7:35 pm - Avii: Damnn
03/11/20, 7:36 pm - Avii: I said sigh
03/11/20, 7:36 pm - Divija Joshi: 😂thats not a sigh
03/11/20, 7:36 pm - Avii: Yeah i know
03/11/20, 7:36 pm - Divija Joshi: Nd whose no. Is this
03/11/20, 7:36 pm - Avii: Mine
03/11/20, 7:36 pm - Divija Joshi: Woah
03/11/20, 7:36 pm - Avii: But for some reason calling is not working
03/11/20, 7:36 pm - Divija Joshi: Ohh
03/11/20, 7:36 pm - Avii: Only net sim is working
03/11/20, 7:36 pm - Divija Joshi: Achhha
03/11/20, 7:37 pm - Avii: Yep`;

  try {
    let analysis;
    // Check if we have saved analysis from an uploaded file
    if (typeof window !== 'undefined' && window.sessionStorage.getItem('chatAnalysis')) {
      // Use the stored analysis
      analysis = JSON.parse(window.sessionStorage.getItem('chatAnalysis') || '{}');
    } else {
      // Use the default analyzer
      analysis = createDefaultAnalyzer();
      
      // Customize based on the small sample we have
      analysis.messagePatterns.greetings = ["Oh hii", "Heyyy", "Hii", "Hello there", "Achhha"];
      analysis.messagePatterns.laughs = ["😂", "Lolll", "Hahaha"];
      analysis.commonPhrases = ["Oh hii", "I was just gonna", "Achhha", "Ohh", "Woah", "Nd whose", "I didnt recognize"];
    }

    // Return personalized content
    return {
      birthdayWishes: [
        "HAPPY BIRTHDAYYYY AVIUUUU! 🎂😂",
        "Aviu, have I mentioned it's your birthday today?? HAPPY BIRTHDAY!",
        "Another minute, another birthday wish! Happy Birthday Aviu! 🎁",
        "SURPRISE! It's still your birthday! Hope it's amazing! 🎈",
        "HBD AVIU! Hope your day is as awesome as you are! 💯",
        "Randommmm birthday wish because you deserve it! Happy Birthday! 🌟",
        "Did someone say birthday? Oh right, it's YOURS! Happy Birthday Aviu!",
        "Happy happy happy birthday to the best Aviu in the world! 🎊",
        "Birthday bot activated to wish you the happiest day ever! 🤖🎂",
        "Sending virtual cake and real wishes! Happy Birthday!"
      ],
      
      botResponses: {
        default: [
          "Hmm, interesting thought! Also, did I mention it's your BIRTHDAY?? 🎉",
          "Achhha that's so you, Aviu! Hope your birthday is amazing! 🎂",
          "Hmm, let me think about that... while I remind you it's your BIRTHDAY! 🥳",
          "That's a good question! Speaking of good things, HAPPY BIRTHDAY! 🎈",
          "Hahaha, you always say the funniest things! Hope your birthday is just as fun! 🎁"
        ],
        
        greeting: [
          "Oh hii Aviu!! HAPPY BIRTHDAY!! How's the birthday celebration going? 🎉",
          "Heyyy birthday person! How's your special day treating you? 🎂",
          "Hi Aviu! Just dropping in to say HAPPY BIRTHDAY again! 🥳",
          "What's up birthday star? Having an amazing day I hope! 🌟"
        ],
        
        music: [
          "Omg that song is such a bop! You should add it to your birthday playlist! 🎵🎂",
          "Music taste on point as always! We should make you a birthday playlist! 🎧🎉",
          "That's one of my favorites too! Perfect for a birthday dance party! 💃🎁",
          "Have you heard the birthday remix? Jk, but seriously, HAPPY BIRTHDAY! 🎼🎂"
        ],
        
        food: [
          "Foooood! Did you get any birthday cake yet? If not, I'm bringing some! 🍰",
          "That sounds delicious! Almost as sweet as your birthday celebration should be! 🍕🎂",
          "I'm hungry now! Birthday person gets to choose where we eat next time! 🌮🎉",
          "Yummm! Birthday calories don't count, you know! Eat all the treats! 🍦🎁"
        ],
        
        movies: [
          "We should watch that for your birthday movie marathon! 🎬🎂",
          "That movie is so good! Birthday viewing party at your place? 📽️🎉",
          "Classic choice! Let's watch all your favorites for your birthday! 🎞️🎁",
          "I haven't seen that one! We can watch it together to celebrate your birthday! 🍿🎈"
        ],
        
        funny: [
          "Lolll you're hilarious! Birthday humor on point! 😂🎂",
          "I'm laughing so hard! You always bring the fun, birthday person! 🤣🎉",
          "Hahaha! Your jokes get better every year! Happy Birthday! 😆🎁",
          "That's why you're my favorite! Funny AND it's your birthday! 😹🎈"
        ]
      },
      
      memories: analysis.memories || [
        "Remember that time we laughed for hours about that inside joke? Those are the moments I cherish! 🎭",
        "That late night when we stayed up talking about life dreams... I knew then our friendship was special ✨",
        "Remember our spontaneous adventure when we got completely lost? Best detour ever! 🚗",
        "Our movie marathon with all that junk food... we were so sick after but totally worth it 🎬",
        "That time we tried cooking something fancy and almost burned down the kitchen! Fire extinguisher to the rescue! 🔥"
      ],
      
      divijaStyle: {
        usesEmojis: analysis.responseStyle?.usesEmojis || true,
        usesShortMessages: analysis.responseStyle?.averageLength < 30 || true,
        commonWords: analysis.commonPhrases?.slice(0, 5) || ["Achhha", "Ohh", "Woah", "Nd", "Lolll"],
        punctuationStyle: analysis.responseStyle?.punctuationStyle || "often omits punctuation"
      },
      specialMessages: [
        "You pretending not to care while secretly caring is your cutest toxic trait.",
        "You're not allowed to leave. We've trauma bonded and now I legally own you.",
        "You're my emotional support penguin, whether you like it or not. Cry about it. 🐧"
      ]
    };
  } catch (error) {
    console.error("Error analyzing chat data:", error);
    
    // Fallback to default content
    return {
      birthdayWishes: [
        "HAPPY BIRTHDAYYYY AVIUUUU! 🎂😂",
        "Aviu, have I mentioned it's your birthday today?? HAPPY BIRTHDAY!",
        "Happy Birthday Aviu! 🎁",
        "Hope it's amazing! 🎈",
        "HBD AVIU! Hope your day is as awesome as you are! 💯"
      ],
      botResponses: {
        default: [
          "Oh hii! Did I mention it's your BIRTHDAY?? 🎉",
          "Achhha that's interesting! Happy birthday! 🎂",
          "Hmm, let me think about that... HAPPY BIRTHDAY by the way! 🥳",
          "That's a good question! HAPPY BIRTHDAY! 🎈",
          "Hahaha, funny! Hope your birthday is fun! 🎁"
        ],
        greeting: ["Oh hii Aviu!! HAPPY BIRTHDAY!!"],
        music: ["That song is such a bop! 🎵🎂"],
        food: ["Foooood! Cake time! 🍰"],
        movies: ["We should watch that! 🎬🎂"],
        funny: ["Lolll 😂🎂"]
      },
      memories: [
        "Avi, I literally steal his food after saying I'm not hungry. Every. Single. Time. 😌🍟",
        "He's threatened to block me 738 times, but replies faster than my screen loads.",
        "Our midnight rants start with 'I hate people' and end with memes, therapy, and chaos 🌚💬",
        "I call him 'penguin,' he says he hates it, but you should see the little smile he gets 😏",
        "The 28th time he called me annoying, I just said 'I know, but I'm your annoying.' 💁‍♀️",
        "I told him hugs are healing and he looked personally attacked. But he didn't run. So. 🫂",
        "Told him he's important. He laughed. Then texted 'thanks idiot' 3 hours later. 💀",
        "We once laughed so hard over a meme, I cried and choked. Best day.",
        "My 'are you okay?' texts always come with threats, food pics, and mild insults.",
        "His voice notes sound like angry podcast episodes I never subscribed to 🎙️😂",
        "I say 'love you' platonically. He fake gags. But I know. He melts.",
        "We made a fake Goa plan in 2026. We're never going. But we might. 🏝️",
        "We fight over who gives better pep talks like it's the Olympics.",
        "He says 'I'll kill you' but in a tone even Alexa would blush at.",
        "We've concluded that everyone else is trash. Only we're tolerable. 👯‍♀️",
        "At least 6 'bro am I dying or just anxious' convos a month. Iconic.",
        "Had a deep convo once that basically exposed we're each other's emotional support animals 😭",
        "I ghosted for a day and he went FBI mode. I felt SO special.",
        "We send playlists we never listen to but pretend we do. Bonding. 🎧",
        "I give him self-care lectures like I'm his mom, therapist, and chaos manager combined.",
        "We planned to write a book. It's 90% memes, 10% trauma, 100% gold.",
        "He notices I'm off before I do. And then sends 'don't be stupid' with care.",
        "We've tag-teamed through breakdowns and exams. Warrior mode unlocked.",
        "We talk in bestie code. No one else gets us. Elite.",
        "Once, we just vibed in silence. No drama. Just peace.",
        "I once said I'm a burden and he went full motivational coach on me. I cried.",
        "I act fine, he sees through it, sends chaos, and comforts me anyway.",
        "We didn't talk for two days once and it felt like abandonment. Never again.",
        "His 'take care' texts have murder anyone who hurts you energy.",
        "We get emotional over baby animal videos. I have receipts. 🐶",
        "He said something super deep ONCE. I cried and saved the chat.",
        "I reread his long texts when I'm sad. They hit every time.",
        "We both vented one night and ended up saying, 'I'm glad I have you,' in our own weird ways.",
        "I annoy him for sport. His rage? Chef's kiss.",
        "We've laughed till our stomachs hurt. I needed CPR.",
        "He remembered some small thing I said and brought it up later. 🥺",
        "I cried once, he stayed silent but didn't leave. That silence healed.",
        "We joked about therapy sessions with both of us in the same room. Chaos.",
        "He's called at the exact moment everything fell apart. Like a glitch in the matrix.",
        "We admitted we're scared of losing each other. It was a 'don't cry challenge,' and we failed.",
        "We vibe to the same song but give it totally different meanings. Dual-core besties.",
        "He's helped me through a spiral like it's his job. No complaints.",
        "I tell him weird dreams. He either laughs or gets weirdly philosophical.",
        "We send TikToks that would confuse a therapist. But we get them.",
        "Had one convo that changed my entire week. Or maybe my whole life.",
        "I once told him, 'I wish you could see yourself like I do.' He got quiet.",
        "Sometimes we sit in silence. It's still the safest place I know.",
        "We joke about our trauma. It's healing. It's messed up. It's us.",
        "I know when he's lying about being okay. And I call him out every time.",
        "He's not just my best friend, Avi. He's my chosen family. That penguin's stuck with me forever. 💖🐧"
      ],
      divijaStyle: {
        usesEmojis: true,
        usesShortMessages: true,
        commonWords: ["Achhha", "Ohh", "Woah", "Nd", "Lolll"],
        punctuationStyle: "often omits punctuation"
      },
      specialMessages: [
        "You pretending not to care while secretly caring is your cutest toxic trait.",
        "You're not allowed to leave. We've trauma bonded and now I legally own you.",
        "You're my emotional support penguin, whether you like it or not. Cry about it. 🐧"
      ]
    };
  }
}

// Get personalized content
const personalizedContent = getPersonalizedContent();

const memoryPrompts = [
  "Remember that time we...",
  "Remember when we almost...",
  "That trip we took where...",
  "That inside joke about...",
  "The time we couldn't stop laughing about...",
  "When we stayed up all night talking about..."
];

// Function to make messages look like Divija's texting style
function divijafy(text: string): string {
  const divijaStyle = personalizedContent.divijaStyle;
  
  // Don't modify already styled messages
  if (!text) return text;
  
  let modifiedText = text;
  
  // Apply common word substitutions (like "and" -> "nd")
  if (divijaStyle.commonWords) {
    if (divijaStyle.commonWords.includes("Nd") || divijaStyle.commonWords.includes("nd")) {
      modifiedText = modifiedText.replace(/\band\b/gi, "nd");
    }
  }
  
  // Add doubled letters in common words
  modifiedText = modifiedText
    .replace(/\b(hi)\b/gi, "hii")
    .replace(/\b(hey)\b/gi, "heyy")
    .replace(/\b(ok)\b/gi, "okk")
    .replace(/\b(oh)\b/gi, "ohh");
  
  // Sometimes drop end punctuation based on style
  if (divijaStyle.punctuationStyle === "often omits punctuation" && Math.random() > 0.5) {
    modifiedText = modifiedText.replace(/[.!?]$/, "");
  }
  
  // Random chance to add extra exclamation marks
  if (modifiedText.includes("!") && Math.random() > 0.6) {
    modifiedText = modifiedText.replace("!", "!!");
  }
  
  // Random chance to add emoji if not already present
  const emojiPattern = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\u2B50-\u2BFF]/;
  if (divijaStyle.usesEmojis && !emojiPattern.test(modifiedText) && Math.random() > 0.6) {
    const commonEmojis = ["😂", "❤️", "👍", "✨", "🎉", "💕", "🫶"];
    modifiedText += " " + commonEmojis[Math.floor(Math.random() * commonEmojis.length)];
  }
  
  // Sometimes start with one of Divija's common phrases
  if (Math.random() > 0.9) {
    const starters = ["Oh hii ", "Achhha ", "Hmm ", "Woah ", "Wait "];
    modifiedText = starters[Math.floor(Math.random() * starters.length)] + modifiedText.charAt(0).toLowerCase() + modifiedText.slice(1);
  }
  
  return modifiedText;
}

// Add a function to extract topic-based responses
function extractTopicResponses(responses: {context: string, response: string}[]): Record<string, string[]> {
  const topics: Record<string, string[]> = {
    greeting: [],
    birthday: [],
    music: [],
    food: [],
    movies: [],
    funny: [],
    memory: [],
    question: [],
    emotional: [],
    plans: [],
    compliment: [],
    default: []
  };

  // Sort responses into topics based on context keywords
  for (const item of responses) {
    const context = item.context.toLowerCase();
    
    // Check for topic indicators
    if (/^(hi|hello|hey|hii|heyy|heyyy|good morning|good afternoon|good evening|howdy)/i.test(context)) {
      topics.greeting.push(item.response);
    } else if (/\b(birthday|bday|hbd|happy birthday|celebrate|party|gift|present|wish)/i.test(context)) {
      topics.birthday.push(item.response);
    } else if (/\b(music|song|album|artist|band|playlist|concert)/i.test(context)) {
      topics.music.push(item.response);
    } else if (/\b(food|eat|hungry|restaurant|meal|cook|recipe|dish|pizza|burger|cake)/i.test(context)) {
      topics.food.push(item.response);
    } else if (/\b(movie|film|watch|show|series|netflix|actor|actress|tv)/i.test(context)) {
      topics.movies.push(item.response);
    } else if (/\b(lol|lmao|haha|hehe|funny|joke|humor|hilarious|laugh)/i.test(context)) {
      topics.funny.push(item.response);
    } else if (/\b(remember|memory|memories|recall|past|time when|that time|years ago)/i.test(context)) {
      topics.memory.push(item.response);
    } else if (context.includes('?') || /^(what|who|where|when|why|how|is|are|do|does|did)/i.test(context.split(' ')[0])) {
      topics.question.push(item.response);
    } else if (/\b(happy|sad|angry|excited|love|hate|feel|feeling|emotion|mood)/i.test(context)) {
      topics.emotional.push(item.response);
    } else if (/\b(plan|future|tomorrow|next|soon|later|upcoming|schedule)/i.test(context)) {
      topics.plans.push(item.response);
    } else if (/\b(nice|great|awesome|amazing|wonderful|beautiful|pretty|smart|cool)/i.test(context)) {
      topics.compliment.push(item.response);
    } else {
      // Default fallback
      topics.default.push(item.response);
    }
  }
  
  // Ensure each category has at least some responses by copying from default if needed
  for (const [key, value] of Object.entries(topics)) {
    if (value.length === 0 && key !== 'default') {
      topics[key] = topics.default.length > 0 ? 
        [...topics.default] : 
        ["That's interesting!", "Oh, I see!", "Tell me more about that!", "That's cool!"];
    }
  }
  
  return topics;
}

// Add these utility functions to extract information from messages
function extractCommonPhrases(messages: string[]): string[] {
  const phraseCounts: Record<string, number> = {};
  
  for (const message of messages) {
    // Look for short phrases like "Oh hii", "Achhha", etc.
    const words = message.split(/\s+/);
    if (words.length === 1 && words[0].length > 2) {
      phraseCounts[words[0]] = (phraseCounts[words[0]] || 0) + 1;
    } else if (words.length === 2 && message.length < 15) {
      phraseCounts[message] = (phraseCounts[message] || 0) + 1;
    }
    
    // Check for common starting phrases
    if (message.startsWith("Oh ") || message.startsWith("Hii") || 
        message.startsWith("Achhha") || message.startsWith("Woah") ||
        message.startsWith("Lol") || message.startsWith("Hmm")) {
      const startingPhrase = message.split(' ')[0];
      phraseCounts[startingPhrase] = (phraseCounts[startingPhrase] || 0) + 1;
    }
  }
  
  // Return top phrases
  return Object.entries(phraseCounts)
    .sort(([_, countA], [__, countB]) => countB - countA)
    .slice(0, 10)
    .map(([phrase]) => phrase);
}

function extractCommonEmojis(messages: string[]): Record<string, number> {
  const emojiCounts: Record<string, number> = {};
  // Simpler emoji detection without unicode flag
  const commonEmojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
    '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤔', '🤨', '😐', 
    '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', 
    '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', 
    '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', 
    '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '👍', '👎', '❤️', '🙌'];
  
  for (const message of messages) {
    for (const emoji of commonEmojis) {
      if (message.includes(emoji)) {
        emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
      }
    }
  }
  
  return emojiCounts;
}

function countEmojis(messages: string[]): number {
  // Simpler emoji detection without unicode flag
  const commonEmojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
    '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤔', '🤨', '😐', 
    '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', 
    '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', 
    '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', 
    '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '👍', '👎', '❤️', '🙌'];
  
  let count = 0;
  
  for (const message of messages) {
    for (const emoji of commonEmojis) {
      if (message.includes(emoji)) {
        count++;
      }
    }
  }
  
  return count;
}

// Add missing function declarations
function extractStartingPhrases(messages: string[]): string[] {
  const phrases: Record<string, number> = {};
  
  for (const message of messages) {
    // Get the first 1-3 words
    const words = message.split(/\s+/);
    if (words.length > 0) {
      const firstWord = words[0];
      if (firstWord.length > 1) {
        phrases[firstWord] = (phrases[firstWord] || 0) + 1;
      }
      
      if (words.length > 1) {
        const firstTwoWords = `${words[0]} ${words[1]}`;
        phrases[firstTwoWords] = (phrases[firstTwoWords] || 0) + 1;
      }
      
      if (words.length > 2) {
        const firstThreeWords = `${words[0]} ${words[1]} ${words[2]}`;
        phrases[firstThreeWords] = (phrases[firstThreeWords] || 0) + 1;
      }
    }
  }
  
  return Object.entries(phrases)
    .filter(([_, count]) => count > 1) // Must appear more than once
    .sort(([_, countA], [__, countB]) => countB - countA)
    .slice(0, 15)
    .map(([phrase]) => phrase);
}

function extractEndingPhrases(messages: string[]): string[] {
  const phrases: Record<string, number> = {};
  
  for (const message of messages) {
    // Get the last 1-2 words
    const words = message.split(/\s+/);
    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      if (lastWord.length > 1) {
        phrases[lastWord] = (phrases[lastWord] || 0) + 1;
      }
      
      if (words.length > 1) {
        const lastTwoWords = `${words[words.length - 2]} ${words[words.length - 1]}`;
        phrases[lastTwoWords] = (phrases[lastTwoWords] || 0) + 1;
      }
    }
  }
  
  return Object.entries(phrases)
    .filter(([_, count]) => count > 1)
    .sort(([_, countA], [__, countB]) => countB - countA)
    .slice(0, 10)
    .map(([phrase]) => phrase);
}

function extractQuestionPatterns(messages: string[]): string[] {
  return messages
    .filter(msg => msg.includes('?'))
    .slice(0, 15);
}

function extractExclamationPatterns(messages: string[]): string[] {
  return messages
    .filter(msg => msg.includes('!'))
    .slice(0, 15);
}

function calculateAverageLength(messages: string[]): number {
  if (messages.length === 0) return 0;
  return Math.round(messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length);
}

function analyzePunctuation(messages: string[]): string {
  let missingEndPunctuation = 0;
  let multipleExclamation = 0;
  let multipleQuestion = 0;
  
  for (const message of messages) {
    if (message.length < 5) continue;
    
    // Check for missing end punctuation
    if (!/[.!?]$/.test(message)) {
      missingEndPunctuation++;
    }
    
    // Check for multiple exclamation marks
    if (/!!+/.test(message)) {
      multipleExclamation++;
    }
    
    // Check for multiple question marks
    if (/\?\?+/.test(message)) {
      multipleQuestion++;
    }
  }
  
  if (missingEndPunctuation > messages.length * 0.5) {
    return "often omits end punctuation";
  } else if (multipleExclamation > messages.length * 0.2) {
    return "uses multiple exclamation marks";
  } else if (multipleQuestion > messages.length * 0.2) {
    return "uses multiple question marks";
  }
  
  return "standard punctuation";
}

function findCommonAbbreviations(messages: string[]): Record<string, string> {
  const abbreviations: Record<string, number> = {};
  const commonAbbreviations = [
    'u', 'ur', 'r', 'y', 'tht', 'idk', 'lol', 'lmao', 'omg', 'brb', 
    'btw', 'tbh', 'imo', 'rn', 'af', 'lmk', 'hmu', 'smh', 'ily', 
    'thx', 'thnx', 'np', 'ofc', 'bc', 'cuz', 'b4', 'pls', 'plz'
  ];
  
  // Count occurrences of common abbreviations
  for (const message of messages) {
    const words = message.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (commonAbbreviations.includes(word)) {
        abbreviations[word] = (abbreviations[word] || 0) + 1;
      }
    }
  }
  
  // Map abbreviations to full forms if they appear often
  const result: Record<string, string> = {};
  if (abbreviations['u'] && abbreviations['u'] > 2) result['you'] = 'u';
  if (abbreviations['ur'] && abbreviations['ur'] > 2) result['your'] = 'ur';
  if (abbreviations['r'] && abbreviations['r'] > 2) result['are'] = 'r';
  if (abbreviations['tht'] && abbreviations['tht'] > 2) result['that'] = 'tht';
  if (abbreviations['idk'] && abbreviations['idk'] > 2) result["I don't know"] = 'idk';
  
  return result;
}

function extractWordSubstitutions(messages: string[]): Record<string, string> {
  const subs: Record<string, string> = {};
  let andCount = 0;
  let ndCount = 0;
  
  for (const message of messages) {
    // Count occurrences of "and" vs "nd"
    const words = message.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (word === 'and') andCount++;
      if (word === 'nd') ndCount++;
    }
    
    // Count occurrences of words with doubled letters
    if (/\b(hii|heii|heyy|okk|noo|yess|yeahh|hmm)\b/i.test(message)) {
      const matches = message.match(/\b(hii|heii|heyy|okk|noo|yess|yeahh|hmm)\b/ig);
      if (matches) {
        for (const match of matches) {
          const normal = match.replace(/([a-z])\1+/ig, '$1');
          subs[normal.toLowerCase()] = match.toLowerCase();
        }
      }
    }
  }
  
  // Add "and" -> "nd" if it's common
  if (ndCount > andCount * 0.3) {
    subs['and'] = 'nd';
  }
  
  return subs;
}

// Enhance the analyzeInput function to better understand user intent
const analyzeInput = (input: string) => {
  // Convert to lowercase for easier matching
  const lowerInput = input.toLowerCase();
  
  // Check for specific topic indicators with more nuanced categorization
  
  // Greetings
  if (/^(hi|hello|hey|hii|heyy|heyyy|good morning|good afternoon|good evening|greetings|howdy|namaste)/i.test(lowerInput)) {
    return 'greeting';
  }
  
  // Birthday related
  if (/\b(birthday|bday|hbd|happy birthday|born|birth|age|celebrate|party|gift|present|wish|surprise)\b/i.test(lowerInput)) {
    return 'birthday';
  }
  
  // Music related
  if (/\b(music|song|album|artist|band|playlist|spotify|concert|melody|tune|singing|lyrics|genre|pop|rock|rap|classical|dj|beat|rhythm)\b/i.test(lowerInput)) {
    return 'music';
  }
  
  // Food related
  if (/\b(food|eat|lunch|dinner|breakfast|hungry|restaurant|meal|cook|cooking|chef|recipe|dish|cuisine|pizza|burger|cake|chocolate|ice cream|hungry|delicious|tasty|yummy)\b/i.test(lowerInput)) {
    return 'food';
  }
  
  // Movie/entertainment related
  if (/\b(movie|film|watch|cinema|theater|show|series|episode|netflix|amazon|disney|hbo|actor|actress|director|scene|plot|character|tv|television|stream|streaming)\b/i.test(lowerInput)) {
    return 'movies';
  }
  
  // Funny/Humor related
  if (/\b(lol|lmao|rofl|haha|hehe|funny|joke|humor|hilarious|laughing|laugh|comedy)\b/i.test(lowerInput)) {
    return 'funny';
  }
  
  // Memories or past experiences
  if (/\b(remember|memory|memories|recall|past|time when|time that|back when|years ago|that day|that time|reminds me|reminded me|throwback|used to)\b/i.test(lowerInput)) {
    return 'memory';
  }
  
  // Questions - detect various question types
  if (input.includes('?') || 
      /^(what|who|where|when|why|how|is|are|do|does|did|can|could|would|will|should)/i.test(lowerInput.split(' ')[0])) {
    return 'question';
  }
  
  // Emotional statements
  if (/\b(happy|sad|angry|upset|excited|thrilled|love|hate|feel|feeling|emotion|mood|miss|regret|sorry|grateful|thankful|appreciate)\b/i.test(lowerInput)) {
    return 'emotional';
  }
  
  // Plans or future events
  if (/\b(plan|future|tomorrow|next|soon|later|upcoming|schedule|event|meeting)\b/i.test(lowerInput)) {
    return 'plans';
  }
  
  // Compliments
  if (/\b(nice|great|awesome|amazing|wonderful|beautiful|pretty|handsome|smart|intelligent|cool|fantastic|excellent|brilliant|talented)\b/i.test(lowerInput)) {
    return 'compliment';
  }
  
  // Default fallback - use conversational context analysis
  return 'default';
};

// Function to detect if a message is a question
function isQuestion(message: string): boolean {
  // Check for question marks
  if (message.includes('?')) return true;
  
  // Check for question words at the beginning
  const questionStarters = [
    'what', 'who', 'where', 'when', 'why', 'how', 'is', 'are', 'do', 'does',
    'did', 'can', 'could', 'would', 'will', 'should', 'has', 'have', 'had'
  ];
  
  const firstWord = message.toLowerCase().trim().split(/\s+/)[0];
  return questionStarters.includes(firstWord);
}

// Function to extract question topics
function extractQuestionTopic(message: string): string[] {
  // Remove question words to focus on the actual topic
  const cleanedMessage = message.toLowerCase()
    .replace(/^(what|who|where|when|why|how|is|are|do|does|did|can|could|would|will|should)\s+/i, '')
    .replace(/\?/g, '');
  
  // Extract key nouns (simplified approach)
  const words = cleanedMessage.split(/\s+/);
  const importantWords = words.filter(word => word.length > 3);
  
  return importantWords;
}

// Function to retrieve relevant knowledge based on query
function retrieveKnowledge(query: string): string {
  query = query.toLowerCase();
  let bestMatch = '';
  
  // Check each category in the knowledge base
  // Birthday facts
  for (const [key, value] of Object.entries(knowledgeBase.birthday)) {
    if (query.includes(key)) {
      return value;
    }
  }
  
  // General facts - check if any topic is mentioned
  for (const [key, value] of Object.entries(knowledgeBase.facts)) {
    if (query.includes(key)) {
      return value;
    }
  }
  
  // Aviu-specific facts
  for (const [key, value] of Object.entries(knowledgeBase.aviu)) {
    if (query.includes(key)) {
      return value;
    }
  }
  
  return bestMatch;
}

// Update generateResponse function with RAG-like capabilities
const generateResponse = (category: string, userInput: string = '') => {
  // Load analysis if available
  const analysis = typeof window !== 'undefined' && window.sessionStorage.getItem('chatAnalysis')
    ? JSON.parse(window.sessionStorage.getItem('chatAnalysis') || '{}')
    : {};
  
  // Load Divija's contextual responses
  const divijaResponses = typeof window !== 'undefined' && window.sessionStorage.getItem('divijaResponses')
    ? JSON.parse(window.sessionStorage.getItem('divijaResponses') || '[]')
    : [];
  
  // First determine if this is a factual question that requires accurate information
  if (userInput && isQuestion(userInput)) {
    // Extract the question topics
    const userInputLower = userInput.toLowerCase();
    
    // Check birthday knowledge
    for (const [key, value] of Object.entries(knowledgeBase.birthday)) {
      if (userInputLower.includes(key)) {
        const prefaces = [
          "Oh! I actually know this one! ",
          "I just read about this recently! ",
          "Achhha, so I learned that ",
          "That's interesting you ask - ",
          "Hmm, so the thing is, "
        ];
        const preface = prefaces[Math.floor(Math.random() * prefaces.length)];
        return divijafy(preface + value);
      }
    }
    
    // Check general facts
    for (const [key, value] of Object.entries(knowledgeBase.facts)) {
      if (userInputLower.includes(key)) {
        const prefaces = [
          "Oh! I know this cool fact - ",
          "I was just reading that ",
          "So apparently, ",
          "Did you know that ",
          "I learned this recently: "
        ];
        const preface = prefaces[Math.floor(Math.random() * prefaces.length)];
        return divijafy(preface + value);
      }
    }
    
    // Check Aviu facts
    for (const [key, value] of Object.entries(knowledgeBase.aviu)) {
      if (userInputLower.includes(key)) {
        return divijafy(value);
      }
    }
  }
  
  // If not a factual question or no fact found, continue with contextual matching
  
  // Check for direct contextual matches first (highest priority)
  if (divijaResponses.length > 0 && userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // Try to find exact or very close matches first
    const exactMatches = divijaResponses.filter((item: {context: string}) => {
      const context = item.context.toLowerCase();
      // Check if user input matches at least 70% of the context
      return context === lowerInput || 
             (context.length > 5 && lowerInput.includes(context)) ||
             (lowerInput.length > 5 && context.includes(lowerInput));
    });
    
    if (exactMatches.length > 0) {
      // Use a direct match for highest accuracy
      return divijafy(exactMatches[Math.floor(Math.random() * exactMatches.length)].response);
    }
    
    // Try to find contexts with similar keywords
    const keywordMatches = divijaResponses.filter((item: {context: string}) => {
      const contextWords = item.context.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const inputWords = lowerInput.split(/\s+/).filter(w => w.length > 3);
      
      // Check for overlap in significant words
      return inputWords.some(word => contextWords.some(contextWord => 
        contextWord.includes(word) || word.includes(contextWord)
      ));
    });
    
    if (keywordMatches.length > 0) {
      // Use a keyword-based contextual match
      return divijafy(keywordMatches[Math.floor(Math.random() * keywordMatches.length)].response);
    }
  }
  
  // If no direct match found, use category-based responses
  if (analysis.topicResponses && analysis.topicResponses[category] && analysis.topicResponses[category].length > 0) {
    const topicResponses = analysis.topicResponses[category];
    const response = topicResponses[Math.floor(Math.random() * topicResponses.length)];
    return divijafy(response);
  }
  
  // Generate appropriate fallback responses based on the specific category
  let response;
  
  switch(category) {
    case 'greeting':
      response = [
        "Oh hii! How are you doing?",
        "Heyyy! What's up?",
        "Hi Aviu! How's your day going?",
        "Helloooo birthday person!",
        "Oh hii Aviu! Happy birthdayyy!"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'birthday':
      response = [
        "It's your birthdayyyy! How does it feel to be a year older?",
        "Hope you're having the best birthday ever!",
        "Birthday celebrations going well?",
        "What's your favorite birthday gift so far?",
        "Are you doing anything special for your birthday?"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'music':
      response = [
        "Ohhh I love that song!",
        "Have you heard the new album?",
        "We should make you a birthday playlist!",
        "What kind of music are you into lately?",
        "That's a bop!"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'food':
      response = [
        "Omg that sounds delicious!",
        "I'm hungry now just thinking about it",
        "We should get food together sometime",
        "Have you tried that new place?",
        "Birthday cake is the best kind of food!"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'movies':
      response = [
        "I've been wanting to watch that!",
        "Was it good? Worth watching?",
        "We should have a movie night!",
        "What's your favorite part?",
        "I haven't seen that one yet"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'funny':
      response = [
        "Lolll that's hilarious",
        "Hahahaha stop",
        "You're too funny",
        "I can't even 😂",
        "Lmao you always make me laugh"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'memory':
      const randomPrompt = memoryPrompts[Math.floor(Math.random() * memoryPrompts.length)];
      const randomMemory = personalizedContent.memories[Math.floor(Math.random() * personalizedContent.memories.length)];
      response = `${randomPrompt} ${randomMemory}`;
      break;
      
    case 'question':
      // If we got here, it's a question we don't have a specific answer for
      response = [
        "Hmm let me think... Not totally sure about that one!",
        "That's a good question! I'd have to research that",
        "You know what, I'm not 100% sure about that",
        "I think... wait no actually I'm not sure. Let me know if you find out!",
        "Woah that's a good question. I wish I knew!"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'emotional':
      response = [
        "Aww I know what you mean",
        "I feel the same way sometimes",
        "That's totally understandable",
        "I'm here for you!",
        "Sending you good vibes"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'plans':
      response = [
        "Sounds like fun!",
        "Let me know how it goes",
        "Wish I could join!",
        "That sounds exciting",
        "Make sure to take pictures!"
      ][Math.floor(Math.random() * 5)];
      break;
      
    case 'compliment':
      response = [
        "Aww thank you!",
        "You're too sweet",
        "No u!",
        "That means a lot coming from you",
        "You're the best!"
      ][Math.floor(Math.random() * 5)];
      break;
      
    default:
      // Use default messages from our content library
      const defaultResponses = personalizedContent.botResponses.default;
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  // Apply Divija's style to the response
  response = divijafy(response);
  
  // Occasionally add birthday wishes
  if (Math.random() > 0.85) {
    const randomWish = personalizedContent.birthdayWishes[Math.floor(Math.random() * personalizedContent.birthdayWishes.length)];
    response += `\n\n${divijafy(randomWish)}`;
  }
  
  return response;
};

// Update the handleSpecialMemory function to be more personalized
const handleSpecialMemory = (setIsTyping: React.Dispatch<React.SetStateAction<boolean>>, 
                            setMessages: React.Dispatch<React.SetStateAction<{text: string, sender: 'user' | 'bot'}[]>>) => {
  setIsTyping(true);
  
  setTimeout(() => {
    // Create a more authentic special memory
    const specialMemories = personalizedContent.specialMessages;
    
    const response = divijafy(specialMemories[Math.floor(Math.random() * specialMemories.length)]);
    
    setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    setIsTyping(false);
  }, 1500);
};

export default function BirthdayBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Oh hii Aviu! It's me, Divija! HAPPY BIRTHDAY!!! 🎉🎂 I made this bot for you - ask me anything or choose a topic and I'll chat with you just like I normally do! (But with extra birthday wishes because TODAY IS YOUR DAY!)",
      sender: 'bot'
    }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastWishTime, setLastWishTime] = useState<number>(Date.now());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto birthday wish timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      // Send random birthday wish every 30-60 seconds
      if (now - lastWishTime > (Math.random() * 30000 + 30000)) {
        if (!isTyping) {
          sendBirthdayWish();
          setLastWishTime(now);
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [lastWishTime, isTyping]);

  const sendBirthdayWish = () => {
    setIsTyping(true);
    setTimeout(() => {
      const wishes = personalizedContent.birthdayWishes;
      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      setMessages((prev: Message[]) => [...prev, { text: divijafy(randomWish), sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionClick = (type: ResponseType) => {
    setIsTyping(true);
    setTimeout(() => {
      if (type === 'memory') {
        const memory = personalizedContent.memories[Math.floor(Math.random() * personalizedContent.memories.length)];
        setMessages((prev: Message[]) => [...prev, { text: memory, sender: 'bot' }]);
      } else {
        const response = generateResponse(type, '');
        setMessages((prev: Message[]) => [...prev, { text: response, sender: 'bot' }]);
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleSpecialMessage = () => {
    setIsTyping(true);
    setTimeout(() => {
      const specialMemories = personalizedContent.specialMessages;
      
      const response = divijafy(specialMemories[Math.floor(Math.random() * specialMemories.length)]);
      setMessages((prev: Message[]) => [...prev, { text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const newMessage: Message = {
        text: userInput,
        sender: 'user'
      };
      setMessages((prev: Message[]) => [...prev, newMessage]);
      setUserInput('');
      setIsTyping(true);

      setTimeout(() => {
        const response = generateResponse('chat', userInput);
        setMessages((prev: Message[]) => [...prev, { text: response, sender: 'bot' }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } mb-4`}
          >
            <div
              className={`rounded-lg p-3 max-w-[70%] ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 rounded-lg p-3">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleSpecialMessage}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Special Message
          </button>
          <button
            onClick={() => handleOptionClick('wish')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Birthday Wish
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 