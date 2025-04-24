'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import BirthdayBot from '@/components/BirthdayBot';
import DivijasQuirkyReasons from '@/components/DivijasQuirkyReasons';
import MemoryTimeline from '@/components/MemoryTimeline';
import VirtualEscapeRoom from '@/components/VirtualEscapeRoom';
import PlaylistCreator from '@/components/PlaylistCreator';
import PhotoMemories from '@/components/PhotoMemories';
import Image from 'next/image';
import VirtualWishJar from '@/components/VirtualWishJar';
import ComicStrip from '@/components/ComicStrip';
import TreasureHunt from '@/components/TreasureHunt';
import LoveReasons from '@/components/LoveReasons';
import ARFilter from '@/components/ARFilter';
import VideoMontage from '@/components/VideoMontage';
import DivijaChatbot from '@/components/DivijaChatbot';

export default function Home() {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState<number | null>(null);
  const [music, setMusic] = useState<Howl | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Client-side only - fixes hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Initialize background music
    const backgroundMusic = new Howl({
      src: ['/birthday-lofi.mp3'],
      loop: true,
      volume: 0.5,
    });

    setMusic(backgroundMusic);

    return () => {
      backgroundMusic.stop();
    };
  }, []);

  const handleBoxClick = () => {
    setIsBoxOpen(true);
    if (music) {
      music.play();
    }
  };

  const gifts = [
    { title: "Personalized Divija Chatbot", color: "#FF6B6B", content: <BirthdayBot /> },
    { title: "10 Reasons You're Amazing", color: "#9C59B6", content: <DivijasQuirkyReasons /> },
    { title: "Memory Timeline", color: "#4ECDC4", content: <MemoryTimeline /> },
    { title: "Virtual Escape Room", color: "#FFD166", content: <VirtualEscapeRoom /> },
    { title: "Playlist Creator", color: "#06D6A0", content: <PlaylistCreator /> },
    { title: "Photo Memories", color: "#118AB2", content: <PhotoMemories /> },
  ];

  // Generate balloon elements on the client side only
  const generateBalloons = () => {
    return Array(10).fill(0).map((_, i) => {
      const initialX = `${Math.floor(Math.random() * 100)}vw`;
      const duration = 15 + Math.floor(Math.random() * 10);
      
      return (
        <motion.div
          key={i}
          className="absolute"
          initial={{ y: '100vh', x: initialX }}
          animate={{
            y: '-20vh',
            x: initialX,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className={`w-8 h-10 ${i % 2 === 0 ? 'bg-pink-400' : 'bg-purple-400'} rounded-full`} />
        </motion.div>
      );
    });
  };

  // Generate fairy lights elements on the client side only
  const generateFairyLights = () => {
    return Array(20).fill(0).map((_, i) => {
      return (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      );
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 relative overflow-hidden">
      {/* Animations only rendered on client side to avoid hydration mismatch */}
      {isClient && (
        <>
          {/* Floating Balloons */}
          <div className="absolute inset-0 pointer-events-none">
            {generateBalloons()}
          </div>

          {/* Fairy Lights */}
          <div className="absolute inset-0 pointer-events-none">
            {generateFairyLights()}
          </div>

          {/* Puppy with Speech Bubble */}
          {!isBoxOpen && (
            <motion.div
              className="absolute top-1/2 right-64 transform -translate-y-1/2 z-50"
              initial={{ scale: 0, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <motion.div
                  className="text-6xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🐶
                </motion.div>
                <motion.div
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-3 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm font-bold text-purple-800 whitespace-nowrap">
                    Happy Birthday Bro! 🎉<br/>
                    <span className="text-xs text-gray-600">(Puppy relative came to wish)</span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {!isBoxOpen ? (
        <div className="flex items-center justify-center min-h-screen flex-col">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
            Happy Birthday, Aviu! 🎉
          </h1>
          <button
            className="cursor-pointer relative w-64 h-64 hover:scale-110 active:scale-90 transition-transform z-50"
            onClick={handleBoxClick}
          >
            <div className="relative w-64 h-64">
              {/* Gift Box */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-2xl flex items-center justify-center transform-gpu">
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold p-4 text-center">
                  👉 Click to Unwrap Your Birthday Wishes 🎁
                </div>
              </div>
              {/* Ribbon */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-8 h-20 bg-gradient-to-b from-pink-600 to-pink-400 rounded-t-full" />
              <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-20 h-8 bg-gradient-to-r from-pink-600 to-pink-400 rounded-l-full" />
              {/* Bow */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-pink-500 rounded-full" />
              <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-pink-500 rounded-full" />
              {/* Bow Details */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-pink-400 rounded-full" />
              <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-pink-400 rounded-full" />
            </div>
          </button>
          <p className="text-xl text-center mt-8 text-purple-800">
            A special gift from your friend who calls you Aviu 💕
          </p>
        </div>
      ) : (
        // Gift Carousel
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-12 text-purple-800">
              Choose Your Birthday Surprise, Aviu! 🎉
            </h1>

            {/* Gift Selection */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {gifts.map((gift, index) => (
                <button
                  key={index}
                  className={`py-2 px-4 rounded-full text-white font-semibold transition-all hover:scale-105 shadow-md`}
                  style={{ backgroundColor: gift.color }}
                  onClick={() => setCurrentGift(index)}
                >
                  {gift.title}
                </button>
              ))}
            </div>

            <div className="mt-8">
              {currentGift === null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-8 bg-white rounded-lg shadow-lg"
                >
                  <p className="text-xl text-purple-800">
                    Click on any gift above to reveal your birthday surprise! ✨
                  </p>
                </motion.div>
              )}
              
              {currentGift !== null && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 bg-white rounded-lg shadow-lg"
                  style={{ 
                    backgroundColor: gifts[currentGift].color + "20", // Adding transparency
                    border: `2px solid ${gifts[currentGift].color}`
                  }}
                >
                  {gifts[currentGift].content}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confetti Explosion - client-side only to avoid hydration mismatch */}
      {isClient && isBoxOpen && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-pink-500"
              initial={{ x: '50vw', y: '50vh', scale: 0 }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                scale: 1,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}

      <DivijaChatbot />
    </main>
  );
} 