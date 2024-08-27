import React, { useEffect, useRef, useState } from 'react';

const AudioVisualizer: React.FC = () => {
  const [audioData, setAudioData] = useState(new Uint8Array(11).fill(25));
  const [targetData, setTargetData] = useState(new Uint8Array(11).fill(25));
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 275, 0);
    gradient.addColorStop(0, '#800080');  // Purple
    gradient.addColorStop(1, '#FFC0CB');  // Pink

    const generateTargetData = () => {
      return new Uint8Array(11).map((_, index) => {
        const distanceFromCenter = Math.abs(5 - index);
        const maxHeight = 50 - distanceFromCenter * 5;
        return Math.random() * maxHeight + maxHeight / 2;
      });
    };

    const updateTargetData = () => {
      setTargetData(generateTargetData());
    };

    const animate = () => {
      setAudioData(prevData =>
        prevData.map((value, index) => {
          const target = targetData[index];
          return value + (target - value) * 1;  // Smooth transition
        })
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      audioData.forEach((value, index) => {
        const x = index * 25;
        const height = value;
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 2, 50 - height / 2, 21, height);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    const intervalId = setInterval(updateTargetData, 20);  // Update target every 2 seconds

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animationRef.current);
    };
  }, [targetData]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <canvas ref={canvasRef} width={275} height={100} className="border border-gray-300 rounded-lg shadow-lg" />
    </div>
  );
};

export default AudioVisualizer;