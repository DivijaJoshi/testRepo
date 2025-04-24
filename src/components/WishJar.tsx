'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Pre-filled wishes for Aviu
const prefilledWishes = [
  "May this year bring you all the happiness you deserve! 🌈",
  "Wishing you success in all your endeavors! 🚀",
  "May your life be filled with laughter and joy! 😄",
  "Sending you love and best wishes on your special day! 💖",
  "May all your dreams come true this year! ✨",
];

type Wish = {
  id: number;
  text: string;
  position: { x: number; y: number };
  color: string;
};

const colors = ['bg-pink-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-green-100'];

export default function WishJar() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState('');
  const [jarOpen, setJarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  // Add prefilled wishes on component mount
  useEffect(() => {
    const initialWishes = prefilledWishes.map((wish, index) => ({
      id: index,
      text: wish,
      position: getRandomPosition(),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setWishes(initialWishes);
    nextId.current = initialWishes.length;
  }, []);

  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    
    return {
      x: Math.random() * (width - 150),
      y: Math.random() * (height - 150),
    };
  };

  const handleAddWish = () => {
    if (!newWish.trim()) return;
    
    const wish: Wish = {
      id: nextId.current++,
      text: newWish,
      position: getRandomPosition(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    
    setWishes(prev => [...prev, wish]);
    setNewWish('');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700">Virtual Wish Jar</h2>
        <p className="text-gray-600">Add your wishes for Aviu's special day! ✨</p>
      </div>
      
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          placeholder="Type your wish for Aviu..."
          className="flex-1 p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          onKeyDown={(e) => e.key === 'Enter' && handleAddWish()}
        />
        <button
          onClick={handleAddWish}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Add Wish
        </button>
      </div>
      
      <div className="relative">
        <motion.div
          className="w-40 h-40 mx-auto cursor-pointer"
          onClick={() => setJarOpen(!jarOpen)}
          animate={{ rotate: jarOpen ? [0, -5, 5, -5, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">🏺</span>
            </div>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {jarOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200 h-96 overflow-hidden relative"
              ref={containerRef}
            >
              {wishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  className={`absolute p-3 rounded-lg shadow-md max-w-[150px] ${wish.color}`}
                  style={{ left: wish.position.x, top: wish.position.y }}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    y: [0, -10, 0, -5, 0],
                    rotate: [0, 2, -2, 2, 0],
                  }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 3, repeatType: 'mirror' },
                    rotate: { repeat: Infinity, duration: 5, repeatType: 'mirror' }
                  }}
                  drag
                  dragConstraints={containerRef}
                >
                  {wish.text}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="text-center mt-4">
          <p className="text-purple-600 font-medium">
            {jarOpen ? "Click the jar to close it" : "Click the jar to reveal the wishes"}
          </p>
        </div>
      </div>
    </div>
  );
} 