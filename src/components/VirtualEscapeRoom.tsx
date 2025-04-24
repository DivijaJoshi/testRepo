'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaUnlock, FaKey, FaLightbulb, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { MdOutlineEmojiObjects } from 'react-icons/md';
import confetti from 'canvas-confetti';

interface Room {
  id: number;
  name: string;
  description: string;
  puzzles: Puzzle[];
  isLocked: boolean;
  background: string;
}

interface Puzzle {
  id: number;
  question: string;
  answer: string | string[];
  hint: string;
  isSolved: boolean;
}

const rooms: Room[] = [
  {
    id: 1,
    name: "The Memory Room",
    description: "Unlock the door by solving puzzles about our friendship!",
    background: "bg-gradient-to-br from-purple-100 to-pink-100",
    isLocked: false,
    puzzles: [
      {
        id: 1,
        question: "What was the first movie we watched together in theatres?",
        answer: "ib71",
        hint: "It contains 2 letters and 2 numbers. Also aeroplane.",
        isSolved: false
      },
      {
        id: 2,
        question: "Name any nickname Divi calls you",
        answer: ["kiddo", "puppy", "dumbass", "aviu", "atlas", "cuto"],
        hint: "One of the nicknames is the main character of a novel. You can type any one nickname it should work. But ya this accepts 6 answers. If you have time you can figure it out.",
        isSolved: false
      },
      {
        id: 3,
        question: "What's the name of the mall where we had our movie day?",
        answer: "vr mall",
        hint: "I don't think you need a hint here.",
        isSolved: false
      }
    ]
  },
  {
    id: 3,
    name: "The Final Challenge",
    description: "The last room! Solve this to escape!",
    background: "bg-gradient-to-br from-green-100 to-teal-100",
    isLocked: true,
    puzzles: [
      {
        id: 1,
        question: "What's the secret word that will unlock the final door?",
        answer: "12",
        hint: "I already gave you the hint dumbass in the last question.",
        isSolved: false
      }
    ]
  }
];

export default function VirtualEscapeRoom() {
  const [currentRoom, setCurrentRoom] = useState<Room>(rooms[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPersonalizedMessage, setShowPersonalizedMessage] = useState(false);
  const [showSecretWordHint, setShowSecretWordHint] = useState(false);

  const currentPuzzle = currentRoom.puzzles[currentPuzzleIndex];

  const handleAnswerSubmit = () => {
    if (Array.isArray(currentPuzzle.answer)) {
      if (currentPuzzle.answer.includes(userAnswer.toLowerCase())) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setUserAnswer('');
        setShowHint(false);
        // Mark puzzle as solved
        const updatedPuzzles = currentRoom.puzzles.map(puzzle => 
          puzzle.id === currentPuzzle.id ? { ...puzzle, isSolved: true } : puzzle
        );
        setCurrentRoom({ ...currentRoom, puzzles: updatedPuzzles });
        // Move to next puzzle
        if (currentPuzzleIndex < currentRoom.puzzles.length - 1) {
          setCurrentPuzzleIndex(prev => prev + 1);
        }
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
      }
    } else if (userAnswer.toLowerCase() === currentPuzzle.answer.toLowerCase()) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setUserAnswer('');
      setShowHint(false);
      // Mark puzzle as solved
      const updatedPuzzles = currentRoom.puzzles.map(puzzle => 
        puzzle.id === currentPuzzle.id ? { ...puzzle, isSolved: true } : puzzle
      );
      setCurrentRoom({ ...currentRoom, puzzles: updatedPuzzles });
      // Show secret word hint if it's the mall question
      if (currentPuzzle.id === 3) {
        setShowSecretWordHint(true);
        setTimeout(() => setShowSecretWordHint(false), 5000);
      }
      // Show personalized message if it's the final question
      if (currentPuzzle.id === 1 && currentRoom.id === 3) {
        setShowPersonalizedMessage(true);
        setTimeout(() => setShowPersonalizedMessage(false), 10000);
      }
      // Move to next puzzle
      if (currentPuzzleIndex < currentRoom.puzzles.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
      }
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleNextRoom = () => {
    const nextRoomIndex = rooms.findIndex(room => room.id === currentRoom.id) + 1;
    if (nextRoomIndex < rooms.length) {
      setCurrentRoom(rooms[nextRoomIndex]);
      setCurrentPuzzleIndex(0);
    }
  };

  const handlePreviousRoom = () => {
    const prevRoomIndex = rooms.findIndex(room => room.id === currentRoom.id) - 1;
    if (prevRoomIndex >= 0) {
      setCurrentRoom(rooms[prevRoomIndex]);
      setCurrentPuzzleIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">Virtual Escape Room</h2>
        <p className="text-gray-600">Solve puzzles to unlock memories and escape!</p>
      </div>

      <div className={`${currentRoom.background} rounded-xl shadow-lg p-6 mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{currentRoom.name}</h3>
          <div className="flex items-center gap-2">
            {currentRoom.isLocked ? (
              <FaLock className="text-red-500" />
            ) : (
              <FaUnlock className="text-green-500" />
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-6">{currentRoom.description}</p>

        {!gameComplete ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-purple-600 font-semibold">
                  Puzzle {currentPuzzleIndex + 1}/{currentRoom.puzzles.length}
                </span>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-purple-600 hover:text-purple-800 transition flex items-center gap-2"
                >
                  <FaLightbulb />
                  {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </button>
              </div>

              <h4 className="text-lg font-medium text-gray-800 mb-4">
                {currentPuzzle.question}
              </h4>

              {showHint && (
                <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm italic text-yellow-800">
                  Hint: {currentPuzzle.hint}
                </div>
              )}

              <div className="flex gap-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAnswerSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePreviousRoom}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition"
                disabled={currentRoom.id === 1}
              >
                <FaArrowLeft />
                Previous Room
              </button>
              <button
                onClick={handleNextRoom}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition"
                disabled={currentRoom.id === rooms.length || currentRoom.isLocked}
              >
                Next Room
                <FaArrowRight />
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
          >
            <h3 className="text-2xl font-bold text-purple-700 mb-4">Congratulations!</h3>
            <p className="text-gray-600 mb-6">
              You've successfully escaped the virtual room! You're amazing at solving puzzles!
            </p>
            <button
              onClick={() => {
                // Reset game
                rooms.forEach(room => {
                  room.isLocked = room.id !== 1;
                  room.puzzles.forEach(puzzle => puzzle.isSolved = false);
                });
                setCurrentRoom(rooms[0]);
                setCurrentPuzzleIndex(0);
                setGameComplete(false);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Correct answer! 🎉
          </motion.div>
        )}
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Wrong answer! Try again.
          </motion.div>
        )}
        {showPersonalizedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md"
          >
            <div className="text-center">
              <p className="mb-2">You have been calm to my hurricane,</p>
              <p className="mb-2">A guide to my lost way, like a steady base.</p>
              <p className="mb-2">You call me annoying with that tired face,</p>
              <p className="mb-2">Yet hold me dear, no matter the case.</p>
              <p className="mb-2">You pretend not to care, keep your walls high,</p>
              <p className="mb-2">But still check on me, with a silent "hi."</p>
              <p className="mb-2">And I see the care in your sarcastic line</p>
              <p className="mb-2">You're not fooling me, dumbass.</p>
              <p className="mb-2">I hope this silly mess makes you smile,</p>
              <p className="mb-2">Even if just for a little while.</p>
              <p className="mb-2">So here's to you Aviu,</p>
              <p className="mb-2">Happiest birthdayyy dumbass. You deserve the world.</p>
            </div>
          </motion.div>
        )}
        {showSecretWordHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Your secret word is the sum of digits in your birthdate. ie. 1+5+2+4
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 