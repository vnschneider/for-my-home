import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OverviewPageProps {
  onComplete: () => void;
  photos: string[];
  videos: string[];
}

const OverviewPage: React.FC<OverviewPageProps> = ({
  onComplete,
  photos,
  videos,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1200); // Mais rápido no início (era 1800)
  const [isExploding, setIsExploding] = useState(false);
  const [isAccelerating, setIsAccelerating] = useState(false);

  // Refs para efeitos sonoros
  const tickSoundRef = useRef<HTMLAudioElement>(null);
  const explosionSoundRef = useRef<HTMLAudioElement>(null);

  // Combina e embaralha as mídias para um preview dinâmico
  const allMedia = [
    ...photos.map((p) => ({ type: "photo" as const, src: p })),
    ...videos.map((v) => ({ type: "video" as const, src: v })),
  ].sort(() => Math.random() - 0.5);

  // Função para reproduzir efeito sonoro de tick
  const playTickSound = () => {
    if (tickSoundRef.current) {
      tickSoundRef.current.currentTime = 0;
      tickSoundRef.current.play().catch(() => {});
    }
  };

  // Função para reproduzir efeito sonoro de explosão
  const playExplosionSound = () => {
    if (explosionSoundRef.current) {
      explosionSoundRef.current.currentTime = 0;
      explosionSoundRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= allMedia.length - 1) {
          setIsExploding(true);
          playExplosionSound();
          setTimeout(onComplete, 3500); // aumenta tempo para ver a explosão
          return prev;
        }

        // Acelera mais rápido
        const newSpeed = Math.max(120, speed * 0.92); // aceleração mais forte (era 0.96)
        setSpeed(newSpeed);

        // Marca quando começa a acelerar rapidamente
        if (newSpeed < 500 && !isAccelerating) {
          setIsAccelerating(true);
        }

        // Reproduz som de tick
        playTickSound();

        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [speed, allMedia.length, onComplete, isAccelerating]);
  const currentMedia = allMedia[currentIndex];
  return (
    <div className="overview-page">
      {/* Efeitos sonoros */}
      <audio ref={tickSoundRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvWEcBjiS1/LPdiUEJnvG8dyIOwcZY7Tt4J9NEAxPqOPwtWIcBDiS1vLPdiYEJHfI8N6QQAoTXrPq67NbEgdEleDyyWIcBDuO2+/NWRMKR5vb5WMbBjqSxexgGwY8k9nu2YQZAy2h6VILBSGWxu/daBCRGW+zJYOwD25EREAAAA==" />
      </audio>
      <audio ref={explosionSoundRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvWEcBjiS1/LPdiUEJnvG8dyIOwcZY7Tt4J9NEAxPqOPwtWIcBDiS1vLPdiYEJHfI8N6QQAoTXrPq67NbEgdEleDyyWIcBDuO2+/NWRMKR5vb5WMbBjqSxexgGwY8k9nu2YQZAy2h6VILBSGWxu/daBCRGW+zJYOwD25EREAAAA==" />
      </audio>
      {/* Efeito de explosão de partículas aprimorado */}
      {isExploding && (
        <div className="explosion-effect">
          {[...Array(80)].map((_, i) => (
            <motion.div
              key={i}
              className="explosion-particle"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1.5, 0],
                opacity: [1, 0.8, 0],
                rotate: [0, 360, 720],
              }}
              transition={{
                duration: 2.5,
                delay: Math.random() * 0.8,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Ondas de choque */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="shock-wave"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
                opacity: 0.8,
              }}
              animate={{
                scale: [0, 3, 5],
                opacity: [0.8, 0.3, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
      <motion.div
        className="overview-counter"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2
          animate={{
            scale: isExploding ? [1, 1.5, 0] : 1,
            opacity: isExploding ? [1, 0.5, 0] : 1,
          }}
          transition={{ duration: 1.5 }}
        >
          Nossas Memórias
        </motion.h2>
        <motion.p
          animate={{
            opacity: isExploding ? 0 : 1,
          }}
        >
          {photos.length} fotos • {videos.length} vídeos
        </motion.p>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / allMedia.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>{" "}
      <div className="overview-media-container">
        <AnimatePresence mode="wait">
          {currentMedia && (
            <motion.div
              key={currentIndex}
              className={`overview-media ${
                isAccelerating ? "accelerating" : ""
              }`}
              initial={{
                opacity: 0,
                scale: 0.4,
                rotateY: 90,
                filter: "blur(8px)",
                y: 50,
              }}
              animate={{
                opacity: 1,
                scale: isExploding
                  ? [1, 2, 4]
                  : isAccelerating
                  ? [1, 1.1, 1]
                  : 1,
                rotateY: 0,
                filter: "blur(0px)",
                y: 0,
                boxShadow: isExploding
                  ? [
                      "0 20px 60px rgba(0, 0, 0, 0.3)",
                      "0 0 100px rgba(255, 255, 255, 0.8)",
                      "0 0 200px rgba(255, 255, 255, 1)",
                    ]
                  : isAccelerating
                  ? "0 30px 80px rgba(255, 107, 107, 0.4)"
                  : "0 20px 60px rgba(0, 0, 0, 0.3)",
              }}
              exit={{
                opacity: 0,
                scale: 0.4,
                rotateY: -90,
                filter: "blur(8px)",
                y: -50,
              }}
              transition={{
                duration: isAccelerating ? 0.15 : 0.6,
                ease: isAccelerating ? "easeInOut" : "easeOut",
                scale: {
                  duration: isAccelerating ? 0.1 : 0.4,
                  repeat: isAccelerating ? Infinity : 0,
                },
              }}
            >
              {currentMedia.type === "photo" ? (
                <img
                  src={`/photos/${currentMedia.src}`}
                  alt="Nossa memória"
                  className="overview-image"
                />
              ) : (
                <video
                  src={`/videos/${currentMedia.src}`}
                  className="overview-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
              <div className="media-overlay">
                <motion.span
                  className="media-type"
                  animate={{
                    scale: speed < 300 ? [1, 1.5, 1] : 1,
                    rotate: speed < 300 ? [0, 360] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {currentMedia.type === "photo" ? "📸" : "🎬"}
                </motion.span>
              </div>

              {/* Efeito de brilho */}
              <motion.div
                className="media-shine"
                animate={{
                  x: speed < 300 ? [-200, 200] : [-100, 100],
                  opacity: speed < 300 ? [0, 1, 0] : [0, 0.5, 0],
                }}
                transition={{
                  duration: speed < 300 ? 0.3 : 1,
                  repeat: speed < 300 ? Infinity : 1,
                  ease: "linear",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="overview-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExploding ? 0 : 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.p
          animate={{
            scale: speed < 300 ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.5, repeat: speed < 300 ? Infinity : 0 }}
        >
          {speed > 500
            ? "Preparando nossa história especial..."
            : speed > 200
            ? "Quase lá, meu amor..."
            : "✨ Explodindo de amor! ✨"}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OverviewPage;
