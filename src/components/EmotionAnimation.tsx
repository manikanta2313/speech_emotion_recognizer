import React from 'react';
import { motion } from 'framer-motion';

const emotionVariants = {
  happy: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity
    }
  },
  sad: {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  },
  angry: {
    scale: [1, 1.1, 1],
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity
    }
  },
  neutral: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  },
  surprised: {
    scale: [1, 1.3, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity
    }
  },
  fearful: {
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity
    }
  }
};

const emotionEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  surprised: '😮',
  fearful: '😨'
};

interface EmotionAnimationProps {
  emotion: string;
}

export const EmotionAnimation: React.FC<EmotionAnimationProps> = ({ emotion }) => {
  const lowerEmotion = emotion.toLowerCase();
  
  return (
    <motion.div
      className="text-6xl"
      variants={emotionVariants}
      animate={lowerEmotion}
    >
      {emotionEmojis[lowerEmotion]}
    </motion.div>
  );
}