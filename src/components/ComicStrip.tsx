'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Comic panels data representing friendship milestones
const comicPanels = [
  {
    id: 1,
    title: "First Meeting",
    description: "The day we first met and instantly clicked. Remember how we talked for hours about everything?",
    imageSrc: "/images/comic-placeholder-1.jpg", // Replace with actual images
    backgroundColor: "bg-blue-50"
  },
  {
    id: 2,
    title: "Late Night Study Sessions",
    description: "All those nights we stayed up studying, fueled by coffee and determination.",
    imageSrc: "/images/comic-placeholder-2.jpg",
    backgroundColor: "bg-purple-50"
  },
  {
    id: 3,
    title: "Road Trip Adventures",
    description: "That spontaneous road trip where we got lost but found the best memories.",
    imageSrc: "/images/comic-placeholder-3.jpg",
    backgroundColor: "bg-green-50"
  },
  {
    id: 4,
    title: "Supporting Each Other",
    description: "Through tough times and celebrations, we've always been there for each other.",
    imageSrc: "/images/comic-placeholder-4.jpg",
    backgroundColor: "bg-yellow-50"
  },
  {
    id: 5,
    title: "Inside Jokes",
    description: "All the laughs we've shared and the inside jokes only we understand.",
    imageSrc: "/images/comic-placeholder-5.jpg",
    backgroundColor: "bg-pink-50"
  },
  {
    id: 6,
    title: "Future Adventures",
    description: "Looking forward to all the memories we'll continue to make together!",
    imageSrc: "/images/comic-placeholder-6.jpg",
    backgroundColor: "bg-orange-50"
  }
];

export default function ComicStrip() {
  const [expandedPanel, setExpandedPanel] = useState<number | null>(null);
  const [isFullStripView, setIsFullStripView] = useState(false);

  // Handle panel expansion
  const togglePanelExpansion = (panelId: number) => {
    if (expandedPanel === panelId) {
      setExpandedPanel(null);
    } else {
      setExpandedPanel(panelId);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const panelVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-indigo-700">Our Friendship Comic Strip</h2>
        <p className="text-gray-600">A visual journey through our special moments</p>
      </div>

      <div className="mb-4 text-right">
        <button
          onClick={() => setIsFullStripView(!isFullStripView)}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
        >
          {isFullStripView ? "Grid View" : "Timeline View"}
        </button>
      </div>

      {isFullStripView ? (
        // Timeline view
        <div className="relative py-8">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200"></div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {comicPanels.map((panel, index) => (
              <motion.div 
                key={panel.id}
                variants={panelVariants}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <h3 className="text-xl font-bold text-indigo-700">{panel.title}</h3>
                  <p className="text-gray-600 mt-2">{panel.description}</p>
                </div>
                
                <div className="w-2/12 flex justify-center">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full border-4 border-white shadow z-10"></div>
                </div>
                
                <motion.div 
                  className={`w-5/12 ${panel.backgroundColor} p-4 rounded-lg shadow-md ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}
                  whileHover="hover"
                >
                  <motion.div
                    variants={imageVariants}
                    className="relative h-48 rounded-md overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                    <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📸</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        // Grid view
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {comicPanels.map(panel => (
            <motion.div
              key={panel.id}
              variants={panelVariants}
              whileHover={{ y: -5 }}
              className={`${panel.backgroundColor} rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out cursor-pointer transform`}
              onClick={() => togglePanelExpansion(panel.id)}
              style={{
                height: expandedPanel === panel.id ? 'auto' : '300px'
              }}
            >
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{panel.title}</h3>
                
                <motion.div
                  className="relative h-48 my-3 rounded overflow-hidden"
                  whileHover="hover"
                >
                  <motion.div variants={imageVariants} className="w-full h-full">
                    <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📸</span>
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.p 
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: expandedPanel === panel.id ? 1 : 0,
                    height: expandedPanel === panel.id ? 'auto' : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {panel.description}
                </motion.p>
                
                <div className="mt-2 text-xs text-indigo-600 font-medium">
                  {expandedPanel === panel.id ? "Click to collapse" : "Click to expand"}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-gray-600 italic">
          "True friendship isn't about being inseparable; it's being separated and nothing changes."
        </p>
      </div>
    </div>
  );
} 