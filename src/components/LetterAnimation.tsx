import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LetterAnimationProps {
  onComplete: () => void;
  children: React.ReactNode;
}

const LetterAnimation: React.FC<LetterAnimationProps> = ({
  onComplete,
  children,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Inicia a animação de abertura após um breve delay
    const timer1 = setTimeout(() => setIsOpening(true), 500);

    // Mostra o conteúdo após a carta "abrir"
    const timer2 = setTimeout(() => {
      setShowContent(true);
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="letter-animation-container">
      {/* Envelope */}
      <motion.div
        className="envelope"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Envelope Base */}
        <motion.div
          className="envelope-base"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpening ? -180 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Envelope Flap */}
        <motion.div
          className="envelope-flap"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpening ? -180 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        >
          {/* Selo romântico */}
          <div className="envelope-stamp">💕</div>
        </motion.div>

        {/* Carta saindo do envelope */}
        <motion.div
          className="letter-paper"
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: isOpening ? -100 : 0,
            opacity: isOpening ? 1 : 0,
            scale: isOpening ? 1.2 : 1,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            delay: 0.8,
          }}
        >
          <div className="letter-paper-content">
            <div className="letter-heart">💖</div>
            <div className="letter-lines">
              <div className="letter-line"></div>
              <div className="letter-line"></div>
              <div className="letter-line"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Partículas de magia */}
      <AnimatePresence>
        {isOpening && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="magic-particle"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  scale: 1,
                  opacity: 0,
                }}
                transition={{
                  duration: 2,
                  delay: 1 + i * 0.1,
                  ease: "easeOut",
                }}
              >
                {["✨", "💕", "💖", "🌟", "💫"][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Conteúdo da carta */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="letter-content-overlay"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LetterAnimation;
