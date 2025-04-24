'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';

interface Photo {
  id: number;
  src: string;
  alt: string;
  date: string;
  description: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  scale: number;
}

interface FloatingText {
  id: number;
  text: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  scale: number;
}

const initialPhotos: Photo[] = [
  {
    id: 1,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.31.39 PM.jpeg",
    alt: "Memory 1",
    date: "2025-04-23",
    description: "Special moment together",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 2,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.31.40 PM.jpeg",
    alt: "Memory 2",
    date: "2025-04-23",
    description: "Another beautiful memory",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 3,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.31.41 PM.jpeg",
    alt: "Memory 3",
    date: "2025-04-23",
    description: "Cherished time",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 4,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.31.42 PM.jpeg",
    alt: "Memory 4",
    date: "2025-04-23",
    description: "Unforgettable moment",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 5,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.31.43 PM.jpeg",
    alt: "Memory 5",
    date: "2025-04-23",
    description: "Special day",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 6,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.31.44 PM.jpeg",
    alt: "Memory 6",
    date: "2025-04-23",
    description: "Wonderful memory",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 7,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.33.10 PM.jpeg",
    alt: "Memory 7",
    date: "2025-04-23",
    description: "Beautiful moment",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 8,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.33.40 PM.jpeg",
    alt: "Memory 8",
    date: "2025-04-23",
    description: "Precious time",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 9,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.34.06 PM.jpeg",
    alt: "Memory 9",
    date: "2025-04-23",
    description: "Memorable day",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 10,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.36.48 PM.jpeg",
    alt: "Memory 10",
    date: "2025-04-23",
    description: "Special memory",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 11,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.36.49 PM.jpeg",
    alt: "Memory 11",
    date: "2025-04-23",
    description: "Beautiful day",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  },
  {
    id: 12,
    src: "/photos/WhatsApp Image 2025-04-23 at 5.36.50 PM.jpeg",
    alt: "Memory 12",
    date: "2025-04-23",
    description: "Cherished memory",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    scale: 1
  }
];

const floatingTexts: FloatingText[] = [
  { id: 1, text: "Happy Birthday Aviu! 🎉", position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, scale: 1 },
  { id: 2, text: "Wishing you joy! ✨", position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, scale: 1 },
  { id: 3, text: "Many happy returns! 🎁", position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, scale: 1 },
  { id: 4, text: "Best wishes! 💝", position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, scale: 1 },
  { id: 5, text: "Have a wonderful day! 🌟", position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, scale: 1 },
  { id: 6, text: "Happy Birthday! 🎂", position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, scale: 1 },
  { id: 7, text: "Celebrate you! 🎈", position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, scale: 1 },
  { id: 8, text: "Special day! 💖", position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, scale: 1 }
];

const PHOTO_SIZE = 192;
const TEXT_SIZE = 150;
const MAX_SPEED = 0.3;
const TURN_SPEED = 0.02;
const AVOIDANCE_RADIUS = PHOTO_SIZE * 1.5;

export default function PhotoMemories() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [texts, setTexts] = useState<FloatingText[]>(floatingTexts);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const updatePositions = (items: any[], size: number, containerWidth: number, containerHeight: number) => {
    return items.map(item => {
      // Update position
      let newX = item.position.x + item.velocity.x;
      let newY = item.position.y + item.velocity.y;

      // Bounce off walls
      if (newX < 0 || newX > containerWidth - size) {
        item.velocity.x *= -1;
        newX = Math.max(0, Math.min(newX, containerWidth - size));
      }
      if (newY < 0 || newY > containerHeight - size) {
        item.velocity.y *= -1;
        newY = Math.max(0, Math.min(newY, containerHeight - size));
      }

      // Avoid other items
      let avoidX = 0;
      let avoidY = 0;
      let avoidCount = 0;

      items.forEach(otherItem => {
        if (item.id === otherItem.id) return;

        const dx = otherItem.position.x - item.position.x;
        const dy = otherItem.position.y - item.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < AVOIDANCE_RADIUS) {
          avoidX -= dx / distance;
          avoidY -= dy / distance;
          avoidCount++;
        }
      });

      if (avoidCount > 0) {
        avoidX /= avoidCount;
        avoidY /= avoidCount;

        item.velocity.x += avoidX * TURN_SPEED;
        item.velocity.y += avoidY * TURN_SPEED;

        const speed = Math.sqrt(item.velocity.x * item.velocity.x + item.velocity.y * item.velocity.y);
        if (speed > MAX_SPEED) {
          item.velocity.x = (item.velocity.x / speed) * MAX_SPEED;
          item.velocity.y = (item.velocity.y / speed) * MAX_SPEED;
        }
      }

      return {
        ...item,
        position: { x: newX, y: newY }
      };
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Initialize photos
    const updatedPhotos = photos.map(photo => ({
      ...photo,
      position: {
        x: Math.random() * (containerWidth - PHOTO_SIZE),
        y: Math.random() * (containerHeight - PHOTO_SIZE)
      },
      velocity: {
        x: (Math.random() - 0.5) * MAX_SPEED,
        y: (Math.random() - 0.5) * MAX_SPEED
      },
      scale: 0.8 + Math.random() * 0.4
    }));

    // Initialize texts
    const updatedTexts = texts.map(text => ({
      ...text,
      position: {
        x: Math.random() * (containerWidth - TEXT_SIZE),
        y: Math.random() * (containerHeight - TEXT_SIZE)
      },
      velocity: {
        x: (Math.random() - 0.5) * MAX_SPEED,
        y: (Math.random() - 0.5) * MAX_SPEED
      },
      scale: 0.8 + Math.random() * 0.4
    }));

    setPhotos(updatedPhotos);
    setTexts(updatedTexts);

    const animate = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      setPhotos(prevPhotos => updatePositions(prevPhotos, PHOTO_SIZE, containerWidth, containerHeight));
      setTexts(prevTexts => updatePositions(prevTexts, TEXT_SIZE, containerWidth, containerHeight));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;

    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % photos.length;
    } else {
      newIndex = (currentIndex - 1 + photos.length) % photos.length;
    }

    setSelectedPhoto(photos[newIndex]);
  };

  const toggleFavorite = (photoId: number) => {
    setFavorites(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  return (
    <div className="min-h-screen bg-[#E6E6FA] py-12 px-4 overflow-hidden relative">
      {/* Floating stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaStar size={Math.random() * 10 + 5} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-purple-800 mb-4">
            Our Floating Memories
          </h2>
          <p className="text-xl text-purple-700">Some floating chaos for you..</p>
        </motion.div>

        <div ref={containerRef} className="relative h-[80vh] w-full">
          {/* Floating Texts */}
          {texts.map((text) => (
            <motion.div
              key={text.id}
              className="absolute text-purple-800 font-bold text-lg cursor-default select-none"
              style={{
                left: text.position.x,
                top: text.position.y,
                scale: text.scale
              }}
            >
              {text.text}
            </motion.div>
          ))}

          {/* Photos */}
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="absolute w-48 h-48 cursor-pointer"
              style={{
                left: photo.position.x,
                top: photo.position.y,
                scale: photo.scale
              }}
              onClick={() => openLightbox(photo)}
            >
              <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-medium">{photo.date}</p>
                  <p className="text-white text-xs">{photo.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(photo.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors duration-300"
                >
                  {favorites.includes(photo.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-white" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isLightboxOpen && selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 text-white hover:text-purple-400 transition-colors z-10"
                >
                  <FaTimes size={24} />
                </button>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto('prev');
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-purple-400 transition-colors bg-black/30 p-2 rounded-full"
                  >
                    <FaChevronLeft size={32} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto('next');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-purple-400 transition-colors bg-black/30 p-2 rounded-full"
                  >
                    <FaChevronRight size={32} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white text-lg font-medium">{selectedPhoto.date}</p>
                        <p className="text-white/80 text-sm">{selectedPhoto.description}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(selectedPhoto.id);
                        }}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors duration-300"
                      >
                        {favorites.includes(selectedPhoto.id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 