// ChatAnalyzer.ts - Utility to analyze WhatsApp chat text files

interface MessageData {
  sender: string;
  timestamp: string;
  content: string;
  isMedia: boolean;
}

interface ChatAnalysis {
  messagePatterns: Record<string, string[]>;
  emojiUsage: Record<string, number>;
  commonPhrases: string[];
  memories: string[];
  responseStyle: {
    averageLength: number;
    usesEmojis: boolean;
    usesAbbreviations: boolean;
    punctuationStyle: string;
  };
}

export class ChatAnalyzer {
  private rawChatData: string = '';
  private messages: MessageData[] = [];
  private userIdentifier: string = '';
  private friendIdentifier: string = '';
  
  constructor(rawChatText: string, userIdentifier: string) {
    this.rawChatData = rawChatText;
    this.userIdentifier = userIdentifier;
    this.parseMessages();
  }
  
  /**
   * Parse the raw chat data into structured messages
   */
  private parseMessages(): void {
    if (!this.rawChatData) return;
    
    // Split by lines
    const lines = this.rawChatData.split('\n');
    let currentMessage: MessageData | null = null;
    
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;
      
      // Match the typical WhatsApp message format: date, time, sender, content
      // Example: 03/11/20, 7:35 pm - Divija Joshi: Oh hii
      const messageRegex = /^(\d+\/\d+\/\d+,\s\d+:\d+\s[ap]m)\s-\s([^:]+):\s(.+)$/;
      const match = line.match(messageRegex);
      
      if (match) {
        // If there's a current message being built, push it
        if (currentMessage) {
          this.messages.push(currentMessage);
        }
        
        // Create a new message
        currentMessage = {
          timestamp: match[1],
          sender: match[2].trim(),
          content: match[3],
          isMedia: match[3].includes('<Media omitted>')
        };
        
        // Try to identify the friend if not already known
        if (!this.friendIdentifier && match[2].trim() !== this.userIdentifier) {
          this.friendIdentifier = match[2].trim();
        }
      } else if (currentMessage) {
        // If no match but we have a current message, this might be a continuation
        currentMessage.content += '\n' + line;
      }
    }
    
    // Add the last message if any
    if (currentMessage) {
      this.messages.push(currentMessage);
    }
  }
  
  /**
   * Analyze the chat to extract patterns, common phrases, etc.
   */
  public analyze(): ChatAnalysis {
    // Filter to get only user messages (not media)
    const userMessages = this.messages
      .filter(msg => msg.sender === this.userIdentifier && !msg.isMedia)
      .map(msg => msg.content);
    
    // Basic statistics
    const messagePatterns: Record<string, string[]> = this.analyzePatterns(userMessages);
    const emojiUsage = this.analyzeEmojiUsage(userMessages);
    const commonPhrases = this.extractCommonPhrases(userMessages);
    const memories = this.extractMemories();
    
    // Analyze response style
    const responseStyle = {
      averageLength: this.calculateAverageMessageLength(userMessages),
      usesEmojis: Object.keys(emojiUsage).length > 0,
      usesAbbreviations: this.usesAbbreviations(userMessages),
      punctuationStyle: this.analyzePunctuation(userMessages)
    };
    
    return {
      messagePatterns,
      emojiUsage,
      commonPhrases,
      memories,
      responseStyle
    };
  }
  
  /**
   * Extract patterns based on message context
   */
  private analyzePatterns(messages: string[]): Record<string, string[]> {
    const patterns: Record<string, string[]> = {
      greetings: [],
      questions: [],
      exclamations: [],
      laughs: [],
      agreements: [],
      disagreements: []
    };
    
    for (const message of messages) {
      const lowerMsg = message.toLowerCase();
      
      // Check for greetings
      if (/^(hi|hey|hello|hii|heyy|oh\s*hi|hola|namaste)/i.test(lowerMsg)) {
        patterns.greetings.push(message);
      }
      
      // Check for questions
      if (message.includes('?')) {
        patterns.questions.push(message);
      }
      
      // Check for exclamations
      if (message.includes('!')) {
        patterns.exclamations.push(message);
      }
      
      // Check for laughter
      if (/haha|lol|lmao|rofl|😂|🤣/i.test(lowerMsg)) {
        patterns.laughs.push(message);
      }
      
      // Check for agreements
      if (/^(yes|yeah|yep|sure|okay|ok|definitely|absolutely|correct|right)/i.test(lowerMsg)) {
        patterns.agreements.push(message);
      }
      
      // Check for disagreements
      if (/^(no|nope|nah|not really|i don't think|i disagree)/i.test(lowerMsg)) {
        patterns.disagreements.push(message);
      }
    }
    
    return patterns;
  }
  
  /**
   * Analyze emoji usage frequency
   */
  private analyzeEmojiUsage(messages: string[]): Record<string, number> {
    const emojiCounts: Record<string, number> = {};
    
    // Common emojis to detect
    const commonEmojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
      '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤔', '🤨', '😐', 
      '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', 
      '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', 
      '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', 
      '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', 
      '🤮', '🤧', '😇', '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', 
      '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', 
      '🙀', '😿', '😾', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '👨‍⚕️', '👩‍⚕️', 
      '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '👨‍⚖️', '👩‍⚖️', '👨‍🌾', '👩‍🌾', '👨‍🍳', 
      '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍🏭', '👩‍🏭', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', 
      '👨‍💻', '👩‍💻', '👨‍🎤', '👩‍🎤', '👨‍🎨', '👩‍🎨', '👨‍✈️', '👩‍✈️', '👨‍🚀', 
      '👩‍🚀', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🕵️‍♂️', '🕵️‍♀️', 
      '💂', '💂‍♂️', '💂‍♀️', '👷', '👷‍♂️', '👷‍♀️', '🤴', '👸', '👳', '👳‍♂️', 
      '👳‍♀️', '👲', '🧕', '🧔', '👱', '👱‍♂️', '👱‍♀️', '🤵', '👰', '🤰', '🤱', 
      '👼', '🎅', '🤶', '🦸', '🦸‍♀️', '🦸‍♂️', '🦹', '🦹‍♀️', '🦹‍♂️', '🧙', '🧙‍♀️', 
      '🧙‍♂️', '🧚', '🧚‍♀️', '🧚‍♂️', '🧛', '🧛‍♀️', '🧛‍♂️', '🧜', '🧜‍♀️', '🧜‍♂️', 
      '🧝', '🧝‍♀️', '🧝‍♂️', '🧞', '🧞‍♀️', '🧞‍♂️', '🧟', '🧟‍♀️', '🧟‍♂️', '🙍', 
      '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', 
      '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', 
      '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️', '💆', '💆‍♂️', '💆‍♀️', '💇', 
      '💇‍♂️', '💇‍♀️', '🚶', '🚶‍♂️', '🚶‍♀️', '🏃', '🏃‍♂️', '🏃‍♀️', '💃', '🕺', 
      '👯', '👯‍♂️', '👯‍♀️', '🧖', '🧖‍♀️', '🧖‍♂️', '🧗', '🧗‍♀️', '🧗‍♂️', '🧘', 
      '🧘‍♀️', '🧘‍♂️', '🛀', '🛌', '🕴️', '🗣️', '👤', '👥', '🧠', '🦴', '🦷', '👅', 
      '👄', '👁️', '👀', '👣', '👂', '👃', '👍', '👎', '💪'];
    
    for (const message of messages) {
      for (const emoji of commonEmojis) {
        if (message.includes(emoji)) {
          emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
        }
      }
    }
    
    return emojiCounts;
  }
  
  /**
   * Extract common phrases and expressions
   */
  private extractCommonPhrases(messages: string[]): string[] {
    const phrases: string[] = [];
    const phraseCounts: Record<string, number> = {};
    
    // Look for short, meaningful phrases
    for (const message of messages) {
      if (message.length < 5 || message.length > 50) continue;
      
      // Clean the message
      const cleaned = message
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .toLowerCase()
        .trim();
      
      if (cleaned) {
        phraseCounts[cleaned] = (phraseCounts[cleaned] || 0) + 1;
      }
    }
    
    // Sort by frequency and take top phrases
    const sortedPhrases = Object.entries(phraseCounts)
      .filter(([_, count]) => count > 1) // Only phrases that appear more than once
      .sort(([_, countA], [__, countB]) => countB - countA)
      .slice(0, 20)
      .map(([phrase]) => phrase);
    
    return [...sortedPhrases, ...phrases];
  }
  
  /**
   * Extract meaningful memories from conversation
   */
  private extractMemories(): string[] {
    const memories: string[] = [];
    const conversationChunks: MessageData[][] = [];
    
    // Group messages into conversation chunks
    let currentChunk: MessageData[] = [];
    let lastTimestamp = '';
    
    for (const message of this.messages) {
      // If more than 30 minutes have passed since last message, start a new chunk
      const currentTime = new Date(message.timestamp).getTime();
      const lastTime = lastTimestamp ? new Date(lastTimestamp).getTime() : 0;
      
      if (lastTimestamp && (currentTime - lastTime > 30 * 60 * 1000)) {
        if (currentChunk.length > 0) {
          conversationChunks.push([...currentChunk]);
          currentChunk = [];
        }
      }
      
      currentChunk.push(message);
      lastTimestamp = message.timestamp;
    }
    
    // Add the last chunk
    if (currentChunk.length > 0) {
      conversationChunks.push(currentChunk);
    }
    
    // Analyze chunks for meaningful conversations
    for (const chunk of conversationChunks) {
      if (chunk.length < 5) continue; // Need at least a few messages to be meaningful
      
      // Look for signals of significant memories
      const text = chunk.map(msg => msg.content).join(' ');
      
      // Check for memory indicators
      if (
        /remember|remember when|that time|it was fun|we should|we could|that was|never forget/i.test(text) ||
        /miss|trip|vacation|visit|party|celebration|birthday|holiday|event/i.test(text)
      ) {
        // Construct a memory by summarizing the conversation
        const userMessages = chunk
          .filter(msg => msg.sender === this.userIdentifier && !msg.isMedia)
          .map(msg => msg.content);
        
        if (userMessages.length > 0) {
          // Take a representative message
          const memory = userMessages[Math.floor(userMessages.length / 2)];
          memories.push(memory);
        }
      }
    }
    
    return memories.slice(0, 10); // Limit to 10 memories
  }
  
  /**
   * Calculate the average message length
   */
  private calculateAverageMessageLength(messages: string[]): number {
    if (messages.length === 0) return 0;
    
    const totalLength = messages.reduce((sum, message) => sum + message.length, 0);
    return Math.round(totalLength / messages.length);
  }
  
  /**
   * Check if abbreviations are commonly used
   */
  private usesAbbreviations(messages: string[]): boolean {
    const abbreviationRegex = /\b(u|r|ur|y|idk|lol|lmao|omg|brb|btw|tbh|imo|rn|af|lmk|hmu|smh|ily|thx|thnx|np|ofc|bc|cuz|w\/|w\/o)\b/i;
    
    let abbreviationCount = 0;
    
    for (const message of messages) {
      if (abbreviationRegex.test(message)) {
        abbreviationCount++;
      }
    }
    
    return abbreviationCount > messages.length * 0.15; // If more than 15% have abbreviations
  }
  
  /**
   * Analyze punctuation style
   */
  private analyzePunctuation(messages: string[]): string {
    let missingPunctuation = 0;
    let multiplePunctuation = 0;
    
    for (const message of messages) {
      if (message.length < 5) continue;
      
      // Check if sentence ends without punctuation
      if (!/[.!?]$/.test(message)) {
        missingPunctuation++;
      }
      
      // Check for multiple punctuation
      if (/[!?]{2,}/.test(message)) {
        multiplePunctuation++;
      }
    }
    
    if (missingPunctuation > messages.length * 0.5) {
      return "often omits punctuation";
    } else if (multiplePunctuation > messages.length * 0.3) {
      return "uses multiple punctuation marks";
    } else {
      return "standard punctuation";
    }
  }
  
  /**
   * Get sample responses based on analyzed patterns
   */
  public generateSampleResponses(): Record<string, string[]> {
    const { messagePatterns, emojiUsage } = this.analyze();
    const commonEmojis = Object.entries(emojiUsage)
      .sort(([_, countA], [__, countB]) => countB - countA)
      .slice(0, 5)
      .map(([emoji]) => emoji);
    
    const addEmojis = (text: string): string => {
      if (commonEmojis.length === 0) return text;
      
      // 50% chance to add an emoji
      if (Math.random() > 0.5) {
        const emoji = commonEmojis[Math.floor(Math.random() * commonEmojis.length)];
        return `${text} ${emoji}`;
      }
      
      return text;
    };
    
    // Generate responses based on the analyzed patterns
    const responses: Record<string, string[]> = {
      greetings: [],
      questions: [],
      happy: [],
      funny: [],
      birthday: []
    };
    
    // Use actual user messages as templates when available
    if (messagePatterns.greetings.length > 0) {
      responses.greetings = messagePatterns.greetings.slice(0, 5).map(addEmojis);
    } else {
      responses.greetings = [
        "Oh hii",
        "Heyyy",
        "Hii Aviu",
        "Hello there",
        "Heyy wassupp"
      ].map(addEmojis);
    }
    
    if (messagePatterns.questions.length > 0) {
      responses.questions = messagePatterns.questions.slice(0, 5).map(addEmojis);
    } else {
      responses.questions = [
        "What are you doing?",
        "How's it going?",
        "What's up?",
        "Did you like it?",
        "Nd what else?"
      ].map(addEmojis);
    }
    
    // Generate happy responses
    if (messagePatterns.exclamations.length > 0) {
      responses.happy = messagePatterns.exclamations.slice(0, 5).map(addEmojis);
    } else {
      responses.happy = [
        "That's so cooool!",
        "Woah",
        "This is amazing",
        "I'm so excited",
        "That's great"
      ].map(addEmojis);
    }
    
    // Generate funny responses
    if (messagePatterns.laughs.length > 0) {
      responses.funny = messagePatterns.laughs.slice(0, 5).map(addEmojis);
    } else {
      responses.funny = [
        "Lolll",
        "Hahaha",
        "Lmao that's funny",
        "I can't even 😂",
        "Lolol stop"
      ].map(addEmojis);
    }
    
    // Birthday responses - customized with a mix of patterns
    responses.birthday = [
      "HAPPY BIRTHDAYYYY AVIU!!",
      "Omg it's your birthdayy!!",
      "Happy birthday!! Hope you're having the best day ever",
      "Another year of being awesome! Happy birthday!",
      "Happy happy birthday to my favorite person!"
    ].map(addEmojis);
    
    return responses;
  }
  
  /**
   * Get personalized memories
   */
  public getMemories(): string[] {
    const memories = this.extractMemories();
    
    // Add generic memories if we couldn't extract enough
    if (memories.length < 5) {
      memories.push(
        "Remember when we stayed up all night talking? That was so fun",
        "That time we were laughing so hard we couldn't breathe 😂",
        "Remember our inside joke about that one thing? Still makes me laugh",
        "That adventure we had when we got completely lost",
        "When we had that deep conversation about life and everything"
      );
    }
    
    return memories;
  }
}

/**
 * Create a default analyzer with sample data when real data isn't available
 */
export function createDefaultAnalyzer(): ChatAnalysis {
  return {
    messagePatterns: {
      greetings: ["Oh hii", "Heyyy", "Hii", "Hello there", "Heyy wassupp"],
      questions: ["What are you doing?", "How's it going?", "What's up?", "Did you like it?", "Achhha"],
      exclamations: ["Woah", "That's so cooool!", "This is amazing", "That's great"],
      laughs: ["Lolll", "Hahaha", "Lmao that's funny", "I can't even 😂", "Lolol stop"],
      agreements: ["Yesss", "Yeah", "Okay", "Sure", "Absolutely"],
      disagreements: ["Nooo", "Nope", "I don't think so", "Not really"]
    },
    emojiUsage: { "😂": 10, "❤️": 5, "👍": 3, "😊": 2, "🙌": 1 },
    commonPhrases: ["Oh hii", "Lolll", "Achhha", "I was just", "That's cool", "Woah", "Wait what"],
    memories: [
      "Remember that time we laughed for hours about that inside joke?",
      "That time we tried cooking something fancy and almost burned down the kitchen!",
      "Our movie marathon with all that junk food... we were so sick after but totally worth it",
      "Remember our spontaneous adventure when we got completely lost? Best detour ever!",
      "That late night when we stayed up talking about life dreams... I knew then our friendship was special"
    ],
    responseStyle: {
      averageLength: 15,
      usesEmojis: true,
      usesAbbreviations: true,
      punctuationStyle: "often omits punctuation"
    }
  };
} 