'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

interface Memory {
  id: number;
  image: string;
  date: string;
  caption: string;
}

const memories: Memory[] = [
  {
    id: 1,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.18.06 PM (1).jpeg',
    date: 'April 23, 2025',
    caption: 'Well Aviu, I think I have the official right to say I created the most storms in your life and you still stuck with me through them all. Patience toh godly hai tera indeed.'
  },
  {
    id: 2,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.18.08 PM (1).jpeg',
    date: 'April 23, 2025',
    caption: 'Tu kuch bole aur mai chup chap sun lu, ye toh ho nhi skta. hihi.'
  },
  {
    id: 4,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.18.09 PM (4).jpeg',
    date: 'April 23, 2025',
    caption: 'Our texts being meme material for my stories always. Also I think even when we turn 50, you will still say stuff like old man that will turn into memes.'
  },
  {
    id: 5,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.18.09 PM (3).jpeg',
    date: 'April 23, 2025',
    caption: 'Lmao gul wala is my favourite. Is cute.'
  },
  {
    id: 6,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.27.13 PM.jpeg',
    date: 'April 23, 2025',
    caption: 'Wow is photo me tu smile kaise kar diya. Rare sight.'
  },
  {
    id: 7,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.27.37 PM.jpeg',
    date: 'April 23, 2025',
    caption: 'Well wow, days when we were both awkward and you tried to talk to me I was shy but happy. And I felt heard and seen. Looking back to 2021 and finally 2025, we have gone through a long journey. I am grateful for the journey that taught me so much. You made me grow as a person. We both grew I guess. The fact that I am who I am today is very much contributed by you being in my life. Thank you Aviu. Happy 21st Birthday.'
  },
  {
    id: 8,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.28.02 PM.jpeg',
    date: 'April 23, 2025',
    caption: 'The movie day at the mall is one of my best memories. It was so fun and wholesome.'
  },
  {
    id: 9,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.28.21 PM.jpeg',
    date: 'April 23, 2025',
    caption: 'Tu and tera disinterested look toh kabhi nahi badlenga. But I hope internally you too enjoy your time with me and bas are tsundere. Well you taught me the word. I do think you turned tsundere since a year or something.'
  },
  {
    id: 10,
    image: '/memories/WhatsApp Image 2025-04-23 at 7.28.42 PM.jpeg',
    date: 'April 23, 2025',
    caption: 'Also this is the pink and white kurta wala day on rakhi with Ved. When we went on long drive uske car se. Was fun.'
  }
];

export default function MemoryTimeline() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % memories.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const handleClose = () => {
    setSelectedMemory(null);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">Our Memory Timeline</h2>
        <p className="text-gray-600">A journey through our special moments together</p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handlePlayPause}
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition flex items-center gap-2"
        >
          {isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200"></div>
        
        <div className="space-y-12">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="w-1/2 p-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleMemoryClick(memory)}
                >
                  <img
                    src={memory.image}
                    alt={memory.caption}
                    className="w-full h-96 object-contain rounded-lg shadow-lg bg-gray-100"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">View Memory</span>
                  </div>
                </motion.div>
              </div>
              
              <div className="w-1/2 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-purple-600 font-semibold mb-2">{memory.date}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{memory.caption}</h3>
                  <div className="flex gap-4 text-gray-500">
                    <button className="flex items-center gap-2 hover:text-purple-600 transition">
                      <FaHeart /> Like
                    </button>
                    <button className="flex items-center gap-2 hover:text-purple-600 transition">
                      <FaComment /> Comment
                    </button>
                    <button className="flex items-center gap-2 hover:text-purple-600 transition">
                      <FaShare /> Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg max-w-4xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedMemory.image}
                alt={selectedMemory.caption}
                className="w-full h-[600px] object-contain bg-gray-100"
              />
              <div className="p-6">
                <div className="text-purple-600 font-semibold mb-2">{selectedMemory.date}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedMemory.caption}</h3>
                <div className="flex gap-4 text-gray-500">
                  <button className="flex items-center gap-2 hover:text-purple-600 transition">
                    <FaHeart /> Like
                  </button>
                  <button className="flex items-center gap-2 hover:text-purple-600 transition">
                    <FaComment /> Comment
                  </button>
                  <button className="flex items-center gap-2 hover:text-purple-600 transition">
                    <FaShare /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 