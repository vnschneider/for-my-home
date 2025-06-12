import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FloatingParticlesProps {
  count?: number;
  symbols?: string[];
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 20,
  symbols = ["💕", "✨", "🌸", "💖", "🦋", "🌟", "💫", "🌺"],
}) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      symbol: string;
      x: number;
      y: number;
      delay: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [count, symbols]);

  return (
    <div className="floating-particles-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="floating-particle"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [
              `${particle.x}vw`,
              `${particle.x + 10}vw`,
              `${particle.x - 5}vw`,
              `${particle.x}vw`,
            ],
            y: [
              `${particle.y}vh`,
              `${particle.y - 20}vh`,
              `${particle.y - 10}vh`,
              `${particle.y}vh`,
            ],
            opacity: [0, 0.7, 0.4, 0],
            scale: [0, 1.2, 0.8, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {particle.symbol}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingParticles;
