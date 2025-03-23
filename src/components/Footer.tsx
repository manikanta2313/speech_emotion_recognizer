import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Real-time Analysis",
    description: "Instant emotion detection from voice recordings"
  },
  {
    title: "Multiple Emotions",
    description: "Detects 6 different emotional states"
  },
  {
    title: "High Accuracy",
    description: "Advanced AI-powered recognition"
  },
  {
    title: "Easy to Use",
    description: "Simple upload or record interface"
  }
];

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-12 mt-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Features
        </h2>
        
        <div className="flex overflow-x-auto pb-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
}