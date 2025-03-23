import React, { useState, useRef } from 'react';
import { Mic, Square, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterval } from 'react-use';

interface AudioRecorderProps {
  onAudioSubmit: (audio: Blob) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioSubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useInterval(
    () => {
      setRecordingTime((time) => time + 1);
    },
    isRecording ? 1000 : null
  );

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        onAudioSubmit(audioBlob);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className="relative w-24 h-24"
        animate={{
          scale: isRecording ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: isRecording ? Infinity : 0,
        }}
      >
        <motion.div
          className={`absolute inset-0 bg-red-500 rounded-full opacity-20 ${
            isRecording ? 'animate-ping' : ''
          }`}
        />
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="relative w-full h-full flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          {isRecording ? (
            <Square className="w-8 h-8 text-red-500" />
          ) : (
            <Mic className="w-8 h-8 text-gray-700" />
          )}
        </button>
      </motion.div>
      {isRecording && (
        <div className="text-lg font-semibold text-gray-700">
          {Math.floor(recordingTime / 60)}:
          {(recordingTime % 60).toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
};