'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaHeart } from 'react-icons/fa';

const DivijasQuirkyReasons = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const reasons = [
    {
      title: "Ohh hi aviuu",
      content: "You are literally the most patient person I know????? Which is godly cuz you had to bear me. You always had my back and stood up for me.",
      emoji: "🫂"
    },
    {
      title: "Achha so",
      content: "Your brains works differently in so many ways. You say that to me but it's the same for you. You are like my encyclopedia. Kuch bhi pucho tu explain krne baith jata hai. Cutu hai.",
      emoji: "🧠✨"
    },
    {
      title: "Listen okayy",
      content: "Well you know chaotic me has hurt you a lot, but it was never intentional. And i really really really am happy to have you in my life. Thankyou for giving me so many chances. I will learn from my mistakes.",
      emoji: "💕"
    },
    {
      title: "Omgg i just realised",
      content: "You are 95 percent more tsundere than you were a few months ago. I wonder what contributed to it. Maybe chaos and me?lmao kidding.",
      emoji: "😏"
    },
    {
      title: "Btw did i tell you",
      content: "You do know my sense of humor is like noone else and unique. Yet you molded yours to understand mine too. That is amazing. You act like you dont care but you are very sweet.",
      emoji: "🤣"
    },
    {
      title: "Wait wait wait",
      content: "You never ever judge me for my obsessions, liking and chaos but take a part in listening to my crazy stories and dreams which is crazy but we both are crazy. So that cancels it out.",
      emoji: "👯‍♀️"
    },
    {
      title: "I was thinking abhi",
      content: "Ki you are such a good listener and you remember so many details too. Your Memory is godly hi. Basically i think 12th std se i lent my brain to you. So your brain is my memory storage place. Thak jata hoga na bichara dono ke memories yad rkhke.",
      emoji: "🧠💾"
    },
    {
      title: "Can we talk about",
      content: "How you always pushed me to be better in the gentlest way possible. That doesn't ever make me feel criticised instead heard and understood. Yar tu best hai.",
      emoji: "🚀"
    },
    {
      title: "Okay but seriously",
      content: "You are such an amazing friend. Kind, caring , supportive and loyal. Aur kya chaiye.",
      emoji: "🤝"
    },
    {
      title: "And finallyyyyy",
      content: "You exist and make things better. Thats it. HAPPYYYY BIRTHDAYYYYY DUMBASS.",
      emoji: "🎂✨"
    }
  ];

  const next = () => {
    setDirection(1);
    setCurrent((current + 1) % reasons.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((current - 1 + reasons.length) % reasons.length);
  };

  // Auto-advance every 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      next();
    }, 15000);
    return () => clearTimeout(timer);
  }, [current]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const rainbowColors = [
    'from-pink-500 to-red-500',
    'from-red-500 to-orange-500',
    'from-orange-500 to-yellow-500',
    'from-yellow-500 to-green-500',
    'from-green-500 to-teal-500',
    'from-teal-500 to-blue-500',
    'from-blue-500 to-indigo-500',
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-pink-500 to-red-300',
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-4 relative">
      <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center gap-2">
        <span className="animate-bounce inline-block">10</span> Reasons Why You're Amazing
        <FaHeart className="text-red-500 animate-pulse ml-2" />
      </h2>
      
      <div className="relative w-full h-96 overflow-hidden rounded-xl shadow-2xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className={`absolute w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br ${rainbowColors[current]} rounded-xl`}
          >
            <div className="absolute top-4 right-4 text-5xl">{reasons[current].emoji}</div>
            <h3 className="text-2xl font-bold mb-4 text-white">{reasons[current].title}</h3>
            <p className="text-xl text-white text-center">
              {reasons[current].content}
            </p>
            <div className="absolute bottom-4 right-4">
              <span className="text-white font-bold">
                {current + 1} / {reasons.length}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <button 
          onClick={prev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full text-white focus:outline-none z-10 backdrop-blur-sm transition"
        >
          <FaChevronLeft />
        </button>
        
        <button 
          onClick={next}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full text-white focus:outline-none z-10 backdrop-blur-sm transition"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default DivijasQuirkyReasons; 