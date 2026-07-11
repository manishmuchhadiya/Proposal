import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, PartyPopper } from 'lucide-react';

const heartColors = ['#D95B43', '#E8A598', '#F9C2B6', '#3A2A28'];

/**
 * A sustained, full-page celebration overlay: rising hearts, twinkling
 * sparkles, and a couple of party-popper bursts in the corners. Meant to
 * loop for as long as the final reveal screen is on-screen (not a single
 * burst like <Confetti />).
 */
export function Celebration() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 6,
        duration: Math.random() * 5 + 6,
        size: Math.random() * 18 + 14,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: Math.random() * 1.5 + 1.5,
        size: Math.random() * 10 + 8,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={`heart-${h.id}`}
          initial={{ y: '110vh', x: `${h.x}vw`, opacity: 0, rotate: -15 }}
          animate={{
            y: '-15vh',
            opacity: [0, 1, 1, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ position: 'absolute' }}
        >
          <Heart
            width={h.size}
            height={h.size}
            style={{ color: h.color, fill: h.color, opacity: 0.7 }}
          />
        </motion.div>
      ))}

      {sparkles.map((s) => (
        <motion.div
          key={`sparkle-${s.id}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 90] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          style={{ position: 'absolute', left: `${s.x}vw`, top: `${s.y}vh` }}
        >
          <Sparkles width={s.size} height={s.size} className="text-primary/60" />
        </motion.div>
      ))}

      <motion.div
        className="absolute top-6 left-6 text-primary/70"
        animate={{ rotate: [-15, 15, -15], scale: [1, 1.15, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PartyPopper width={40} height={40} />
      </motion.div>
      <motion.div
        className="absolute top-6 right-6 text-primary/70 -scale-x-100"
        animate={{ rotate: [15, -15, 15], scale: [1, 1.15, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        <PartyPopper width={40} height={40} />
      </motion.div>
    </div>
  );
}
