import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ isListening }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (isListening && !audioContextRef.current) {
      startVisualization();
    } else if (!isListening && audioContextRef.current) {
      stopVisualization();
    }

    return () => stopVisualization();
  }, [isListening]);

  const streamRef = useRef(null);

  const startVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      draw();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopVisualization = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    animationIdRef.current = requestAnimationFrame(draw);
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const barWidth = (width / dataArrayRef.current.length) * 2.5;
    let x = 0;
    
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const barHeight = (dataArrayRef.current[i] / 255) * height;
      
      // Gradient color based on intensity
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#6366f1'); // indigo-500
      gradient.addColorStop(1, '#a855f7'); // purple-500
      
      ctx.fillStyle = gradient;
      // Draw centered bars
      const yPos = (height - barHeight) / 2;
      ctx.fillRect(x, yPos, barWidth - 1, barHeight);
      
      x += barWidth;
    }
  };

  return (
    <div className="w-full h-32 flex items-center justify-center bg-slate-900/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-slate-700/50">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={100} 
        className="w-full h-full opacity-80"
      />
      {!isListening && (
        <div className="absolute text-slate-400 font-medium animate-pulse">
          Click the mic to speak...
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
