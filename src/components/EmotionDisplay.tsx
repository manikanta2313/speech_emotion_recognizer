import React from 'react';
import { motion } from 'framer-motion';

interface EmotionDisplayProps {
  emotion: string | null;
  confidence?: number;
}

const emotionLabelToString: Record<string, string> = {
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Angry',
  neutral: 'Neutral',
  surprised: 'Surprised',
  fearful: 'Fearful',
};

const emotionStringToEmoji: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  surprised: '😲',
  fearful: '😨',
};

const emotionColors: Record<string, string> = {
  happy: 'bg-yellow-500',
  sad: 'bg-blue-500',
  angry: 'bg-red-500',
  neutral: 'bg-gray-500',
  surprised: 'bg-purple-500',
  fearful: 'bg-orange-500',
};

export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion, confidence = 0 }) => {
  if (!emotion) return null;

  const emotionLabel = emotion.trim().toLowerCase();
  const emotionString = emotionLabelToString[emotionLabel] || 'Unknown';
  const emoji = emotionStringToEmoji[emotionLabel] || '🤔';
  const bgColor = emotionColors[emotionLabel] || 'bg-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Detected Emotion</h3>
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center`}>
            <span className="text-white text-2xl">{emoji}</span>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700 capitalize">{emotionString}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className={`h-2.5 rounded-full ${bgColor}`}
                initial={{ width: '0%' }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Confidence: {Math.round(confidence * 100)}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
