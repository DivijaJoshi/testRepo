'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Define the reasons with appropriate categories
const reasons = [
  {
    id: 1,
    category: "Kindness",
    reason: "You always make time for me even when you're busy",
    icon: "❤️",
    color: "bg-red-100",
    textColor: "text-red-700"
  },
  {
    id: 2,
    category: "Support",
    reason: "You believed in me when I didn't believe in myself",
    icon: "🤝",
    color: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    id: 3,
    category: "Humor", 
    reason: "Your jokes always brighten my day, even the terrible ones",
    icon: "😂",
    color: "bg-yellow-100",
    textColor: "text-yellow-700"
  },
  {
    id: 4,
    category: "Wisdom",
    reason: "Your advice has helped me through so many tough decisions",
    icon: "🧠",
    color: "bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    id: 5,
    category: "Loyalty",
    reason: "You've always had my back, no matter what",
    icon: "🛡️",
    color: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    id: 6,
    category: "Authenticity",
    reason: "You're always your true self around me",
    icon: "✨",
    color: "bg-indigo-100",
    textColor: "text-indigo-700"
  },
  {
    id: 7,
    category: "Patience",
    reason: "You listen to me rant without judgment",
    icon: "🧘",
    color: "bg-teal-100",
    textColor: "text-teal-700"
  },
  {
    id: 8,
    category: "Fun",
    reason: "Our adventures together are always epic",
    icon: "🎮",
    color: "bg-pink-100",
    textColor: "text-pink-700"
  },
  {
    id: 9,
    category: "Growth",
    reason: "You push me to be a better person",
    icon: "🌱",
    color: "bg-lime-100",
    textColor: "text-lime-700"
  },
  {
    id: 10,
    category: "Thoughtfulness",
    reason: "You remember the little details about me",
    icon: "🎁",
    color: "bg-orange-100",
    textColor: "text-orange-700"
  }
];

export default function ReasonsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reasons.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);
  
  // Handle manual navigation
  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reasons.length) % reasons.length);
  };
  
  const handleNext = () => {
    setIsAutoPlaying(false);
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reasons.length);
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
        <h2 className="text-2xl font-bold text-pink-600">Reasons I Value Your Friendship</h2>
        <p className="text-gray-600">Swipe through to see why you're amazing, Aviu!</p>
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
            className={`${reasons[currentIndex].color} rounded-2xl shadow-lg p-6 md:p-8 min-h-[300px] flex flex-col`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-white/50 ${reasons[currentIndex].textColor}`}>
                {reasons[currentIndex].category}
              </span>
              <span className="text-2xl">{reasons[currentIndex].icon}</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <motion.p 
                className={`text-xl md:text-2xl font-medium ${reasons[currentIndex].textColor} text-center`}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isExpanded ? [1, 1.05, 1] : 1,
                  transition: { duration: 0.5 }
                }}
              >
                "{reasons[currentIndex].reason}"
              </motion.p>
            </div>
            
            <div className="mt-4 text-right">
              <p className="italic text-gray-700">Reason #{currentIndex + 1}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <button 
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-800">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-800">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Indicator dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {reasons.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? `${reasons[currentIndex].color} scale-125` 
                : 'bg-gray-300'
            }`}
            aria-label={`Go to reason ${index + 1}`}
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
          There are countless more reasons, but these are just a few highlights of why you're so special to me!
        </p>
      </div>
    </div>
  );
} 