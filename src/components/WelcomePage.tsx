import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play } from "lucide-react";

interface WelcomePageProps {
  onStart: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  const [showMorada, setShowMorada] = useState(false);
  const [showMari, setShowMari] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); // Data atual para o story do Instagram (12 de junho)
  const storyDate = "12/06";
  const storyTitle = `Nosso dia ${storyDate} 💕`;

  // Data de início do relacionamento: 13 de março de 2025
  const startDate = new Date("2025-03-13");

  // Atualiza o tempo a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cálculos de tempo
  const diffTime = Math.abs(currentTime.getTime() - startDate.getTime());
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  useEffect(() => {
    const timer1 = setTimeout(() => setShowMorada(true), 1500);
    const timer2 = setTimeout(() => setShowMari(true), 3000);
    const timer3 = setTimeout(() => setShowContent(true), 5000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="welcome-page">
      <div className="floating-hearts">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0, 1, 0],
              y: -100,
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <Heart size={20} fill="rgba(231, 84, 128, 0.6)" />
          </motion.div>
        ))}
      </div>{" "}
      <div className="welcome-content">
        {/* Story Header com data atual */}
        <motion.div
          className="story-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="story-date">{storyTitle}</span>
        </motion.div>

        <motion.h1
          className="welcome-title"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {" "}
          Para a minha{" "}
          <AnimatePresence mode="wait">
            {!showMorada ? (
              <motion.span
                key="namorada"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="title-highlight"
              >
                namorada
              </motion.span>
            ) : !showMari ? (
              <motion.span
                key="morada"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="title-highlight"
              >
                morada
              </motion.span>
            ) : (
              <motion.span
                key="mari"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="title-highlight mari"
              >
                Mari ✨
              </motion.span>
            )}
          </AnimatePresence>
        </motion.h1>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="welcome-details"
            >
              <div className="relationship-counter">
                <motion.div
                  className="counter-box"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {" "}
                  <h3>Nosso Tempo Juntos</h3>
                  <div className="counter-numbers">
                    <span className="counter-main">{days}</span>
                    <span className="counter-label">dias de amor</span>
                  </div>
                  <div className="counter-details">
                    <div className="counter-item">
                      <span className="counter-value">{hours}</span>
                      <span className="counter-label">horas</span>
                    </div>
                    <div className="counter-item">
                      <span className="counter-value">{minutes}</span>
                      <span className="counter-label">minutos</span>
                    </div>
                    <div className="counter-item">
                      <span className="counter-value">{seconds}</span>
                      <span className="counter-label">segundos</span>
                    </div>
                  </div>
                  <div className="counter-breakdown">
                    {months > 0 && (
                      <span>
                        {months} meses e {remainingDays} dias
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>

              <motion.button
                className="start-button"
                onClick={onStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <Play size={24} />
                Começar nossa jornada
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WelcomePage;
