'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBirthdayCake, FaHeart, FaStar, FaGift, FaMusic, FaCamera, FaComment } from 'react-icons/fa';

const messages = [
  { text: "HAPPY BIRTHDAY DUMBASS! 🎂", icon: <FaBirthdayCake />, color: "from-pink-500 to-red-500" },
  { text: "Another year of being amazing! ✨", icon: <FaStar />, color: "from-yellow-500 to-orange-500" },
  { text: "You're officially one year closer to being a grumpy old man! 😏", icon: <FaHeart />, color: "from-red-500 to-pink-500" },
  { text: "Birthday wishes coming in hot! 🔥", icon: <FaGift />, color: "from-purple-500 to-indigo-500" },
  { text: "Did you know? You're aging like fine wine! 🍷", icon: <FaHeart />, color: "from-blue-500 to-purple-500" },
  { text: "Warning: Birthday person detected! 🚨", icon: <FaStar />, color: "from-green-500 to-teal-500" },
  { text: "Time to celebrate the best person ever! 🎉", icon: <FaBirthdayCake />, color: "from-indigo-500 to-blue-500" },
  { text: "Age is just a number, but you're still old! 😂", icon: <FaHeart />, color: "from-orange-500 to-yellow-500" },
  { text: "You're not getting older, you're getting better! 🌟", icon: <FaBirthdayCake />, color: "from-red-500 to-pink-500" },
  { text: "Birthday mode: Activated! 🎮", icon: <FaGift />, color: "from-yellow-500 to-orange-500" },
  { text: "Warning: Extreme cuteness detected! 🐱", icon: <FaHeart />, color: "from-purple-500 to-indigo-500" },
  { text: "Time to party like it's your birthday! 🎵", icon: <FaMusic />, color: "from-blue-500 to-purple-500" },
  { text: "You're basically a birthday cake now! 🍰", icon: <FaBirthdayCake />, color: "from-green-500 to-teal-500" },
  { text: "Age is just a number, but you're still ancient! 🦕", icon: <FaHeart />, color: "from-orange-500 to-yellow-500" },
  { text: "Birthday wishes incoming! 🎯", icon: <FaBirthdayCake />, color: "from-pink-500 to-red-500" },
  { text: "You're officially a year wiser! 🧠", icon: <FaStar />, color: "from-red-500 to-pink-500" },
  { text: "Happy birthday to my favorite tsundere! 😏", icon: <FaGift />, color: "from-yellow-500 to-orange-500" },
  { text: "Time to celebrate the best thing that ever happened to me! 💝", icon: <FaHeart />, color: "from-purple-500 to-indigo-500" },
  { text: "Warning: Birthday overload! ⚡", icon: <FaBirthdayCake />, color: "from-blue-500 to-purple-500" },
  { text: "You're basically a birthday present to the world! 🎁", icon: <FaGift />, color: "from-green-500 to-teal-500" },
  { text: "Happy birthday to my emotional support penguin! 🐧", icon: <FaHeart />, color: "from-indigo-500 to-blue-500" }
];

const DivijaChatbot = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentMessage((prev) => (prev + 1) % messages.length);
          setIsVisible(true);
        }, 500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`bg-gradient-to-r ${messages[currentMessage].color} text-white p-4 rounded-lg shadow-lg max-w-xs cursor-pointer hover:scale-105 transition-transform`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              >
                <span className="text-2xl text-purple-500">
                  {messages[currentMessage].icon}
                </span>
              </motion.div>
              <div>
                <p className="font-medium">{messages[currentMessage].text}</p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="h-1 bg-white/30 rounded-full mt-2"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DivijaChatbot; 