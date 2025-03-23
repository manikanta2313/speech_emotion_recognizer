import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AudioRecorder } from './components/AudioRecorder';
import { FileUploader } from './components/FileUploader';
import { EmotionDisplay } from './components/EmotionDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EmotionAnimation } from './components/EmotionAnimation';

// Simulating the API call for analyzing emotion from audio
const analyzeEmotion = async (audio: Blob | File): Promise<{ emotion: string; confidence: number }> => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  const emotions = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful'];
  return {
    emotion: emotions[Math.floor(Math.random() * emotions.length)],
    confidence: Math.random(),
  };
};

const App: React.FC = () => {
  const [emotion, setEmotion] = useState<{ type: string; confidence: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleAudioSubmit = async (audio: Blob | File) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeEmotion(audio);
      setEmotion({ type: result.emotion, confidence: result.confidence });
    } catch (error) {
      console.error('Error analyzing audio:', error);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Speech Emotion Recognition
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload or record audio to analyze the emotional content
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* File Uploader Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Upload Audio File
              </h2>
              <FileUploader onFileSelect={handleAudioSubmit} />
            </motion.div>

            {/* Audio Recorder Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Record Audio
              </h2>
              <AudioRecorder onAudioSubmit={handleAudioSubmit} />
            </motion.div>
          </div>

          {/* Emotion Result Section */}
          <div className="mt-12 flex flex-col items-center justify-center">
            {isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Analyzing audio...</p>
              </motion.div>
            ) : emotion ? (
              <div className="space-y-8">
                <EmotionAnimation emotion={emotion.type} />
                <EmotionDisplay emotion={emotion.type} confidence={emotion.confidence} />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">Please upload or record an audio to analyze the emotion.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
