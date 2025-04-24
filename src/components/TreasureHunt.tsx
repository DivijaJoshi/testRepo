'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Treasure hunt clues and answers
const treasureHuntStages = [
  {
    id: 1,
    clue: "What was the name of the café where we had our first long conversation?",
    hint: "It starts with the letter 'S' and has something to do with stars...",
    correctAnswer: "starbucks", // This is just a placeholder - update with the actual answer
    incorrectFeedback: "Not quite! Think about where we first really talked for hours.",
    correctFeedback: "Yes! That's where our friendship really began to take shape."
  },
  {
    id: 2,
    clue: "What's the name of the song we always sing together at the top of our lungs?",
    hint: "Remember that road trip? We played this song at least 10 times in a row!",
    correctAnswer: "wonderwall", // This is just a placeholder - update with the actual answer
    incorrectFeedback: "Try again! It's the one we can never get enough of.",
    correctFeedback: "Exactly! 'And after allllll, you're my wonderwallllll!'"
  },
  {
    id: 3,
    clue: "What's our inside joke about that we always reference?",
    hint: "It happened that time at the restaurant and involves something getting spilled...",
    correctAnswer: "spaghetti", // This is just a placeholder - update with the actual answer
    incorrectFeedback: "Not the one I'm thinking of! Remember that embarrassing moment?",
    correctFeedback: "Haha! I still laugh every time I think about the 'spaghetti incident'!"
  },
  {
    id: 4,
    clue: "What color was the shirt I was wearing when we first met?",
    hint: "It's a primary color, and I wear it a lot...",
    correctAnswer: "blue", // This is just a placeholder - update with the actual answer
    incorrectFeedback: "Not that one. I was actually wearing my favorite color!",
    correctFeedback: "You remember! I'm impressed you noticed that detail."
  },
  {
    id: 5,
    clue: "What's the nickname I gave you after our adventure at the amusement park?",
    hint: "It has something to do with how you reacted on the roller coaster...",
    correctAnswer: "screamer", // This is just a placeholder - update with the actual answer
    incorrectFeedback: "Not that one! Think about your reaction on the big ride.",
    correctFeedback: "Haha yes! You'll never live down being the 'Screamer' that day!"
  }
];

export default function TreasureHunt() {
  const [currentStage, setCurrentStage] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Timer states
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Start timer when component mounts
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isComplete, seconds]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const startGame = () => {
    setIsActive(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isActive) {
      startGame();
    }
    
    const currentClue = treasureHuntStages[currentStage];
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = currentClue.correctAnswer.toLowerCase();
    
    if (normalizedAnswer === normalizedCorrectAnswer) {
      setFeedback(currentClue.correctFeedback);
      setIsCorrect(true);
      setScore(score + (showHint ? 5 : 10)); // Score less if hint was used
      
      // Delay moving to next question
      setTimeout(() => {
        if (currentStage < treasureHuntStages.length - 1) {
          setCurrentStage(currentStage + 1);
          setUserAnswer('');
          setFeedback(null);
          setIsCorrect(null);
          setShowHint(false);
        } else {
          setIsComplete(true);
          setIsActive(false); // Stop the timer
        }
      }, 2000);
    } else {
      setFeedback(currentClue.incorrectFeedback);
      setIsCorrect(false);
    }
  };

  const getHint = () => {
    if (!showHint) {
      setHintsUsed(hintsUsed + 1);
      setShowHint(true);
    }
  };

  const resetGame = () => {
    setCurrentStage(0);
    setUserAnswer('');
    setFeedback(null);
    setIsCorrect(null);
    setShowHint(false);
    setIsComplete(false);
    setScore(0);
    setHintsUsed(0);
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-purple-600">Memory Treasure Hunt</h2>
        <p className="text-gray-600">Test how well you remember our friendship moments, Aviu!</p>
        
        {!isActive && !isComplete && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-full shadow-md"
          >
            Start the Hunt!
          </motion.button>
        )}
      </div>
      
      {isActive && !isComplete && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-purple-100 text-purple-800 font-semibold py-1 px-3 rounded-full">
              Clue {currentStage + 1}/{treasureHuntStages.length}
            </span>
            <span className="bg-yellow-100 text-yellow-800 font-semibold py-1 px-3 rounded-full">
              Time: {formatTime(seconds)}
            </span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={currentStage}
            className="mb-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {treasureHuntStages[currentStage].clue}
            </h3>
            
            {showHint && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-700">
                  <span className="font-bold">Hint:</span> {treasureHuntStages[currentStage].hint}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
                >
                  Submit
                </button>
              </div>
            </form>
            
            {!showHint && (
              <button
                onClick={getHint}
                className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Need a hint? (reduces points)
              </button>
            )}
            
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg ${
                  isCorrect 
                    ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
                    : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                }`}
              >
                {feedback}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
      
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-100 rounded-xl shadow-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-purple-800 mb-2">Treasure Hunt Complete!</h3>
          <p className="text-lg text-gray-700 mb-4">
            You've unlocked all the memories, Aviu!
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Final Score</p>
              <p className="text-3xl font-bold text-purple-700">{score}/{treasureHuntStages.length * 10}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Time</p>
              <p className="text-3xl font-bold text-purple-700">{formatTime(seconds)}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-6">
            <p className="text-gray-600 mb-1">Hints Used</p>
            <p className="text-xl font-semibold text-purple-600">{hintsUsed} out of {treasureHuntStages.length}</p>
          </div>
          
          <p className="text-gray-700 mb-6">
            Our friendship is full of amazing memories. I'm so glad we've made them together!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-full shadow-md"
          >
            Play Again
          </motion.button>
        </motion.div>
      )}
      
      {isActive && !isComplete && (
        <div className="text-center mt-4">
          <div className="bg-purple-50 rounded-lg p-3 inline-block">
            <p className="text-sm text-purple-800">
              <span className="font-semibold">Score: {score}</span> • 
              <span className="ml-2">Hints used: {hintsUsed}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 