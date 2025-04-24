'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaLock, FaUnlock, FaMapMarkedAlt, FaHeart } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import confetti from 'canvas-confetti';

// Memory questions about the friendship
const memoryQuestions = [
  {
    id: 1,
    question: "What was the first dish we cooked together?",
    options: ["Pasta", "Pizza", "Pancakes", "Biryani"],
    answer: 1, // Index of correct answer (Pizza)
    memoryHint: "Remember how we almost burned the cheese?",
    rewardText: "Our first culinary adventure! 🍕",
    unlockMessage: "You've unlocked our cooking memories!",
    icon: "🍳"
  },
  {
    id: 2,
    question: "Which movie did we watch on our first movie night?",
    options: ["Inception", "Interstellar", "The Dark Knight", "Avengers"],
    answer: 0, // Inception
    memoryHint: "Dreams within dreams...",
    rewardText: "Our movie night tradition began! 🎬",
    unlockMessage: "You've unlocked our movie night memories!",
    icon: "🎬"
  },
  {
    id: 3,
    question: "What song do we always sing terribly together?",
    options: ["Bohemian Rhapsody", "Summer of 69", "Sweet Caroline", "Don't Stop Believin'"],
    answer: 3, // Don't Stop Believin'
    memoryHint: "Just a small town girl...",
    rewardText: "Our karaoke anthems! 🎤",
    unlockMessage: "You've unlocked our music memories!",
    icon: "🎵"
  },
  {
    id: 4,
    question: "Where did we go on our first road trip together?",
    options: ["The beach", "The mountains", "A national park", "A neighboring city"],
    answer: 1, // The mountains
    memoryHint: "The altitude made us dizzy!",
    rewardText: "Our adventurous spirits! 🏔️",
    unlockMessage: "You've unlocked our travel memories!",
    icon: "🚗"
  },
  {
    id: 5,
    question: "What's our inside joke whenever something goes wrong?",
    options: ["This is fine", "Not again!", "Classic us", "We'll laugh about this later"],
    answer: 2, // Classic us
    memoryHint: "We say this at least once every time we hang out...",
    rewardText: "Our shared humor! 😂",
    unlockMessage: "You've unlocked our inside jokes!",
    icon: "🤣"
  }
];

export default function MemoryTreasureHunt() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [unlockedMemories, setUnlockedMemories] = useState<number[]>([]);
  const [showingHint, setShowingHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showMap, setShowMap] = useState(true);
  
  const currentQuestion = memoryQuestions[currentQuestionIndex];

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === currentQuestion.answer) {
      // Correct answer
      setScore(prevScore => prevScore + 1);
      setUnlockedMemories(prev => [...prev, currentQuestion.id]);
      
      // Trigger confetti for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < memoryQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowingHint(false);
    } else {
      setGameComplete(true);
      
      // Final celebration if score is good
      if (score >= 3) {
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.6 }
          });
        }, 300);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUnlockedMemories([]);
    setShowingHint(false);
    setGameComplete(false);
  };

  // Toggle hint visibility
  const toggleHint = () => {
    setShowingHint(!showingHint);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const optionVariants = {
    normal: { scale: 1 },
    selected: { scale: 1.02 },
    correct: { 
      scale: 1.05,
      backgroundColor: "rgb(134, 239, 172)", // green-200
      color: "rgb(6, 95, 70)" // green-800
    },
    incorrect: { 
      scale: 0.98,
      backgroundColor: "rgb(254, 202, 202)", // red-200
      color: "rgb(153, 27, 27)" // red-800
    }
  };

  // Get option variant based on selection state
  const getOptionVariant = (optionIndex: number) => {
    if (!isAnswered) {
      return selectedOption === optionIndex ? "selected" : "normal";
    } else {
      if (optionIndex === currentQuestion.answer) {
        return "correct";
      } else if (selectedOption === optionIndex) {
        return "incorrect";
      } else {
        return "normal";
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-purple-700">Memory Treasure Hunt</h2>
        <p className="text-gray-600">Test your knowledge of our friendship, Aviu!</p>
      </div>

      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          <span className="font-bold">Score: {score}/{memoryQuestions.length}</span>
        </div>
        <button 
          onClick={() => setShowMap(!showMap)} 
          className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition"
        >
          <FaMapMarkedAlt className="mr-2" />
          {showMap ? "Hide Memory Map" : "Show Memory Map"}
        </button>
      </div>

      {showMap && !gameComplete && (
        <div className="mb-6">
          <div className="bg-purple-50 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-purple-700 mb-3">Memory Map</h3>
            <div className="flex justify-between">
              {memoryQuestions.map((question, index) => (
                <div 
                  key={question.id} 
                  className={`flex flex-col items-center ${index === currentQuestionIndex ? 'scale-110' : ''} transition-transform`}
                >
                  <div 
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center text-xl
                      ${unlockedMemories.includes(question.id) 
                        ? 'bg-purple-200 text-purple-700' 
                        : index === currentQuestionIndex
                          ? 'bg-purple-100 text-purple-500 border-2 border-purple-300'
                          : 'bg-gray-200 text-gray-400'
                      } transition-colors`}
                  >
                    <span>{question.icon}</span>
                    {unlockedMemories.includes(question.id) ? (
                      <FaUnlock className="absolute -bottom-1 -right-1 text-green-500 bg-white rounded-full p-0.5 text-lg" />
                    ) : (
                      <FaLock className="absolute -bottom-1 -right-1 text-gray-400 bg-white rounded-full p-0.5 text-lg" />
                    )}
                  </div>
                  <div className="text-xs mt-1 text-center">
                    Memory {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full mt-4">
              <div 
                className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
                style={{ width: `${(unlockedMemories.length / memoryQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {!gameComplete ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  Question {currentQuestionIndex + 1}/{memoryQuestions.length}
                </span>
                <button
                  onClick={toggleHint}
                  className="text-purple-600 hover:text-purple-800 transition text-sm flex items-center"
                  disabled={isAnswered}
                >
                  <MdQuiz className="mr-1" />
                  {showingHint ? "Hide Hint" : "Need a Hint?"}
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {currentQuestion.question}
              </h3>

              {showingHint && (
                <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm italic text-yellow-800">
                  Hint: {currentQuestion.memoryHint}
                </div>
              )}

              <div className="space-y-3 mt-6">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    variants={optionVariants}
                    initial="normal"
                    animate={getOptionVariant(index)}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    className={`w-full p-4 rounded-lg text-left transition duration-200 
                      ${!isAnswered ? 'hover:bg-purple-50 bg-white border border-gray-200' : 'border'}
                    `}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswered}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </motion.button>
                ))}
              </div>

              {isAnswered && (
                <div className={`mt-6 p-4 rounded-lg ${selectedOption === currentQuestion.answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h4 className={`font-bold ${selectedOption === currentQuestion.answer ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedOption === currentQuestion.answer ? 'Correct!' : 'Not quite...'}
                  </h4>
                  <p className="mt-1 text-sm">
                    {selectedOption === currentQuestion.answer ? currentQuestion.unlockMessage : `The correct answer was: ${currentQuestion.options[currentQuestion.answer]}`}
                  </p>
                </div>
              )}

              {isAnswered && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleNextQuestion}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
                  >
                    {currentQuestionIndex < memoryQuestions.length - 1 ? 'Next Question' : 'See Results'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-200 p-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">
              Memory Hunt Complete!
            </h3>
            <p className="text-lg mb-6">
              You unlocked {unlockedMemories.length} out of {memoryQuestions.length} memories!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 mb-8">
              {memoryQuestions.map((question, index) => (
                <div 
                  key={question.id}
                  className={`rounded-lg p-4 ${
                    unlockedMemories.includes(question.id) 
                      ? 'bg-purple-50 border border-purple-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                      ${unlockedMemories.includes(question.id) 
                        ? 'bg-purple-200 text-purple-700' 
                        : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <span>{question.icon}</span>
                    </div>
                    <div className="ml-3">
                      <h4 className={`font-bold ${unlockedMemories.includes(question.id) ? 'text-purple-700' : 'text-gray-500'}`}>
                        Memory {index + 1}
                      </h4>
                    </div>
                  </div>
                  
                  {unlockedMemories.includes(question.id) ? (
                    <p className="text-purple-600 mt-2">{question.rewardText}</p>
                  ) : (
                    <p className="text-gray-500 mt-2 italic">This memory remains locked...</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              {score >= 4 ? (
                <div className="bg-purple-100 p-4 rounded-lg mb-6">
                  <h4 className="font-bold text-purple-700 text-lg flex items-center justify-center">
                    <FaHeart className="mr-2 text-pink-500" /> Amazing Friendship Memory!
                  </h4>
                  <p className="mt-2">
                    You know our friendship so well! I'm lucky to have you as my best friend, Aviu!
                  </p>
                </div>
              ) : score >= 2 ? (
                <div className="bg-purple-100 p-4 rounded-lg mb-6">
                  <h4 className="font-bold text-purple-700 text-lg">Good Memory!</h4>
                  <p className="mt-2">
                    You remembered quite a bit about our friendship! Let's make even more memories together!
                  </p>
                </div>
              ) : (
                <div className="bg-purple-100 p-4 rounded-lg mb-6">
                  <h4 className="font-bold text-purple-700 text-lg">More Memories Await!</h4>
                  <p className="mt-2">
                    Time to make more memorable moments together! Our best adventures are still ahead of us!
                  </p>
                </div>
              )}

              <button
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition mt-4"
              >
                Play Again
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 