import React from 'react';
import { Waves, Home, Info, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Waves className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">EmotionSense</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <Home className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <Info className="w-5 h-5" />
            </a>
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}