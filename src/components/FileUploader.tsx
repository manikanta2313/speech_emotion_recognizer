import React, { useCallback, useState } from 'react';
import { EmotionDisplay } from './EmotionDisplay';

interface FileUploaderProps {
  onFileSelect?: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (onFileSelect) {
          onFileSelect(file);
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Prediction Result:', result);

            // Update emotion and confidence
            if (result.emotion) {
              setEmotion(result.emotion);
              setConfidence(result.confidence);
            }
          } else {
            console.error('File upload failed:', await response.json());
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    },
    [onFileSelect]
  );

  return (
    <div>
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Audio files only</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="audio/*"
          onChange={handleFileInput}
        />
      </label>

      {/* Display extracted emotion and confidence */}
      {emotion && <EmotionDisplay emotion={emotion} confidence={confidence} />}
      {/* Display extracted emotion and confidence */}
      {emotion && emotion !== 'unknown' && <EmotionDisplay emotion={emotion} confidence={confidence} />}

    </div>
  );
};
