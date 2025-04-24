'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the special wishes from Divija to Aviu
const wishes = [
  {
    id: 1,
    category: "Birthday Message",
    wish: "Happy Birthday to my most amazing friend! You make every day brighter just by being you.",
    icon: "🎂",
    color: "bg-pink-100",
    textColor: "text-pink-700"
  },
  {
    id: 2,
    category: "Friendship",
    wish: "Our friendship is one of the greatest gifts I've ever received. Thank you for being you!",
    icon: "🫂",
    color: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    id: 3,
    category: "Memories", 
    wish: "Here's to all the incredible memories we've made and the many more adventures waiting for us!",
    icon: "🎭",
    color: "bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    id: 4,
    category: "Joy",
    wish: "You bring so much joy and laughter into my life. May your special day be filled with the same!",
    icon: "😄",
    color: "bg-yellow-100",
    textColor: "text-yellow-700"
  },
  {
    id: 5,
    category: "Dream",
    wish: "May all your dreams and wishes come true this year. You deserve every happiness!",
    icon: "✨",
    color: "bg-indigo-100",
    textColor: "text-indigo-700"
  },
  {
    id: 6,
    category: "Growth",
    wish: "I'm so proud of the person you are and the amazing person you continue to become!",
    icon: "🌱",
    color: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    id: 7,
    category: "Support",
    wish: "Just like you've always been there for me, I'll always be here for you. Count on it!",
    icon: "🤝",
    color: "bg-orange-100",
    textColor: "text-orange-700"
  },
  {
    id: 8,
    category: "Celebration",
    wish: "Today we celebrate you and all the wonderfulness you bring to the world!",
    icon: "🎉",
    color: "bg-red-100",
    textColor: "text-red-700"
  },
  {
    id: 9,
    category: "Future",
    wish: "Looking forward to creating more amazing memories in this new chapter of your life!",
    icon: "🚀",
    color: "bg-cyan-100",
    textColor: "text-cyan-700"
  },
  {
    id: 10,
    category: "Special",
    wish: "You're special to me in ways I can't even express. Happy birthday to my favorite person!",
    icon: "💖",
    color: "bg-rose-100",
    textColor: "text-rose-700"
  },
  {
    id: 11,
    category: "Surprise",
    wish: "I hope this year brings you beautiful surprises and unexpected adventures!",
    icon: "🎁",
    color: "bg-amber-100",
    textColor: "text-amber-700"
  },
  {
    id: 12,
    category: "Promise",
    wish: "Promise me you'll make this birthday as amazing as you are! Let's celebrate in style!",
    icon: "🌟",
    color: "bg-lime-100",
    textColor: "text-lime-700"
  }
];

export default function DivijaWishes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % wishes.length);
    }, 4500);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);
  
  // Handle manual navigation
  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wishes.length) % wishes.length);
  };
  
  const handleNext = () => {
    setIsAutoPlaying(false);
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wishes.length);
  };
  
  // Variants for the animations
  const variants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-pink-600 mb-2">Birthday Wishes from Divija!</h2>
        <p className="text-gray-600">Swipe through to see all my birthday wishes for you, Aviu!</p>
      </div>
      
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className={`${wishes[currentIndex].color} rounded-2xl shadow-lg p-6 md:p-8 min-h-[320px] flex flex-col`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-white/50 ${wishes[currentIndex].textColor}`}>
                {wishes[currentIndex].category}
              </span>
              <span className="text-3xl">{wishes[currentIndex].icon}</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <motion.p 
                className={`text-xl md:text-2xl font-medium ${wishes[currentIndex].textColor} text-center`}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isExpanded ? [1, 1.05, 1] : 1,
                  transition: { duration: 0.5 }
                }}
              >
                "{wishes[currentIndex].wish}"
              </motion.p>
            </div>
            
            <div className="mt-4 text-right">
              <p className="italic text-gray-700">Wish #{currentIndex + 1}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <button 
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10"
          aria-label="Previous wish"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-800">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10"
          aria-label="Next wish"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-800">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Indicator dots */}
      <div className="flex justify-center mt-6 space-x-2 flex-wrap gap-y-2">
        {wishes.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? `${wishes[currentIndex].color} scale-125` 
                : 'bg-gray-300'
            }`}
            aria-label={`Go to wish ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Auto-play toggle */}
      <div className="text-center mt-6">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`text-sm font-medium px-4 py-2 rounded-full transition ${
            isAutoPlaying 
              ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isAutoPlaying ? 'Auto-play: On' : 'Auto-play: Off'}
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          I hope these wishes make your birthday extra special! Have the most amazing day, Aviu! 🎂✨
        </p>
      </div>
    </div>
  );
} 