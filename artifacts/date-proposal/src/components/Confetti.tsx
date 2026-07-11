import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const colors = ['#D95B43', '#FADCD9', '#E8A598', '#3A2A28', '#F9C2B6'];

export function Confetti() {
  const [pieces, setPieces] = useState<{
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
  }[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
      size: Math.random() * 8 + 6,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
          animate={{
            y: '100vh',
            x: `${p.x + (Math.random() * 20 - 10)}vw`,
            rotate: 360 * (Math.random() * 5 + 1),
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{
            position: 'absolute',
            top: -50,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
