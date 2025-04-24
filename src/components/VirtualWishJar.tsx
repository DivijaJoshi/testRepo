'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPen, FaPlus, FaTimes, FaHeart } from 'react-icons/fa';

// Sample pre-filled wishes
const sampleWishes = [
  {
    id: 1,
    name: "Mom",
    message: "Happy birthday, Aviu! Wishing you happiness and success always.",
    color: "#FFD1DC", // Light pink
    rotation: -5
  },
  {
    id: 2,
    name: "Dad",
    message: "Son, you make us proud every day. Happy birthday!",
    color: "#BFEFFF", // Light blue
    rotation: 3
  },
  {
    id: 3,
    name: "Divij",
    message: "To my best friend - thanks for all the laughs and memories. Many more to come!",
    color: "#D4F0F0", // Light teal
    rotation: -2
  },
  {
    id: 4,
    name: "Akshay",
    message: "Happy birthday bro! Remember that epic road trip? Here's to more adventures!",
    color: "#FFE4B5", // Light orange
    rotation: 5
  },
  {
    id: 5,
    name: "Sania",
    message: "Happy birthday! Your kindness inspires everyone around you.",
    color: "#E6E6FA", // Lavender
    rotation: -4
  },
];

interface Wish {
  id: number;
  name: string;
  message: string;
  color: string;
  rotation: number;
}

export default function VirtualWishJar() {
  const [wishes, setWishes] = useState<Wish[]>(sampleWishes);
  const [showForm, setShowForm] = useState(false);
  const [newWish, setNewWish] = useState({ name: '', message: '' });
  const [error, setError] = useState('');
  const [activeWish, setActiveWish] = useState<number | null>(null);
  const [isJarShaking, setIsJarShaking] = useState(false);

  const jarRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle adding a new wish
  const handleAddWish = () => {
    if (newWish.name.trim() === '' || newWish.message.trim() === '') {
      setError('Please fill in both name and message');
      return;
    }

    const colors = ["#FFD1DC", "#BFEFFF", "#D4F0F0", "#FFE4B5", "#E6E6FA", "#FFCBCB", "#CBF3F0", "#CAFBCE"];
    
    const newWishItem: Wish = {
      id: Date.now(),
      name: newWish.name,
      message: newWish.message,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.floor(Math.random() * 10) - 5
    };

    setWishes([...wishes, newWishItem]);
    setNewWish({ name: '', message: '' });
    setShowForm(false);
    setError('');

    // Trigger jar shake animation
    setIsJarShaking(true);
    setTimeout(() => setIsJarShaking(false), 1000);
  };

  // Handle shaking the jar
  const shakeJar = () => {
    setIsJarShaking(true);
    
    // Create a new array with shuffled positions
    const shuffledWishes = [...wishes].map(wish => ({
      ...wish,
      rotation: Math.floor(Math.random() * 10) - 5
    }));
    
    setWishes(shuffledWishes);
    
    setTimeout(() => setIsJarShaking(false), 1000);
  };

  // Random positioning for wishes in the jar
  const getRandomPosition = (index: number) => {
    const baseDelay = index * 0.1;
    const xPos = 10 + Math.random() * 60; // 10-70% of container width
    const yPos = 10 + Math.random() * 60; // 10-70% of container height
    
    return {
      left: `${xPos}%`,
      top: `${yPos}%`,
      transition: { delay: baseDelay }
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-teal-600">Virtual Wish Jar</h2>
        <p className="text-gray-600">Birthday wishes and messages from your loved ones</p>
      </div>

      {/* Jar Container */}
      <div 
        ref={jarRef}
        className={`relative bg-gradient-to-b from-teal-100/50 to-teal-200/50 rounded-3xl border-4 border-teal-300/70 
          min-h-[500px] p-6 mx-auto max-w-2xl overflow-hidden shadow-lg
          ${isJarShaking ? 'animate-shake' : ''}`}
      >
        {/* Jar Lid */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-teal-400 rounded-t-full border-4 border-teal-500"></div>
        
        {/* Jar Bottom Curve */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-teal-200/30 rounded-b-3xl"></div>
        
        {/* Floating Wishes */}
        <div className="relative h-full w-full z-10">
          <AnimatePresence>
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotate: wish.rotation,
                  ...getRandomPosition(index)
                }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05, zIndex: 20 }}
                className="absolute cursor-pointer"
                onClick={() => setActiveWish(wish.id)}
                style={{ 
                  maxWidth: "200px",
                }}
              >
                <div 
                  className="p-3 rounded-lg shadow-md transform transition-transform"
                  style={{ backgroundColor: wish.color }}
                >
                  <p className="font-medium text-sm">{wish.name}</p>
                  <p className="text-xs mt-1 text-gray-700">{wish.message.length > 50 ? wish.message.substring(0, 50) + '...' : wish.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Wish Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-6 right-6 bg-teal-500 text-white p-3 rounded-full shadow-lg z-20"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="text-xl" />
        </motion.button>

        {/* Shake Jar Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-6 left-6 bg-teal-500 text-white p-3 rounded-full shadow-lg z-20"
          onClick={shakeJar}
          disabled={isJarShaking}
        >
          <FaPen className="text-xl" />
        </motion.button>
      </div>

      {/* "Add a Wish" Form Popup */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              ref={formRef}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-teal-600">Add Your Birthday Wish</h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newWish.name}
                  onChange={(e) => setNewWish({...newWish, name: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Your Message
                </label>
                <textarea
                  value={newWish.message}
                  onChange={(e) => setNewWish({...newWish, message: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
                  placeholder="Write your birthday wish..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAddWish}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition flex items-center"
                >
                  <FaHeart className="mr-2" />
                  Add Wish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Wish Popup */}
      <AnimatePresence>
        {activeWish !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setActiveWish(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {wishes.filter(w => w.id === activeWish).map(wish => (
                <div key={wish.id}>
                  <div 
                    className="h-2 w-20 mx-auto rounded-full mb-4"
                    style={{ backgroundColor: wish.color }}
                  ></div>
                  
                  <h3 className="text-xl font-bold mb-2 text-teal-600 flex items-center">
                    <FaHeart className="mr-2 text-pink-500" />
                    From {wish.name}
                  </h3>
                  
                  <p className="text-gray-700 italic p-4 bg-gray-50 rounded-lg border border-gray-100">
                    "{wish.message}"
                  </p>
                  
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setActiveWish(null)}
                      className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for jar shake animation */}
      <style jsx>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-1deg); }
          50% { transform: translateX(5px) rotate(1deg); }
          75% { transform: translateX(-5px) rotate(-1deg); }
          100% { transform: translateX(0); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 