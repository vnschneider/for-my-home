import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, Sparkles, Calendar, Clock, Star } from "lucide-react";

interface WelcomePageProps {
  onPreloadAndStart: () => void;
  isPreloading: boolean;
}

const WelcomePage: React.FC<WelcomePageProps> = ({
  onPreloadAndStart,
  isPreloading,
}) => {
  const [showMorada, setShowMorada] = useState(false);
  const [showMari, setShowMari] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isGlowing, setIsGlowing] = useState(false);

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

  // Efeito de glow no contador
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing((prev) => !prev);
    }, 3000);
    return () => clearInterval(glowInterval);
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
    // Transições mais lentas e suaves
    const timer1 = setTimeout(() => setShowMorada(true), 2500);
    const timer2 = setTimeout(() => setShowMari(true), 5000);
    const timer3 = setTimeout(() => setShowContent(true), 8000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="welcome-page-modern">
      {/* Background com partículas flutuantes */}
      <div className="particles-background">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: -50,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
            }}
          >
            {
              ["💕", "✨", "🌟", "💖", "🌸", "💝"][
                Math.floor(Math.random() * 6)
              ]
            }
          </motion.div>
        ))}
      </div>

      {/* Glass morphism container */}
      <div className="welcome-container">
        {/* Header com data story */}
        <motion.div
          className="story-header-modern"
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
        >
          <div className="story-badge">
            <Calendar size={16} />
            <span>{storyTitle}</span>
            <Sparkles size={14} />
          </div>
        </motion.div>

        {/* Título principal */}
        <motion.div
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            Para a minha{" "}
            <AnimatePresence mode="wait">
              {!showMorada ? (
                <motion.span
                  key="namorada"
                  className="title-word gradient-text"
                  initial={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    y: -50,
                    rotateX: 90,
                    scale: 0.8,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  namorada
                </motion.span>
              ) : !showMari ? (
                <motion.span
                  key="morada"
                  className="title-word gradient-text"
                  initial={{
                    opacity: 0,
                    y: 50,
                    rotateX: -90,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -50,
                    rotateX: 90,
                    scale: 0.8,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  morada
                </motion.span>
              ) : (
                <motion.span
                  key="mari"
                  className="title-word gradient-text-special"
                  initial={{
                    opacity: 0,
                    y: 50,
                    rotateX: -90,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    color: "#fff", // força cor sólida
                    textShadow: "0 0 30px rgba(255, 234, 167, 0.5)",
                    WebkitTextFillColor: "unset", // força o preenchimento do gradiente
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 60,
                  }}
                >
                  <span
                    className="mari-text"
                    style={{ color: "#fff", textShadow: "0 0 30px #ffeaa7" }}
                  >
                    Mari
                  </span>
                  <motion.span
                    className="sparkle-icon"
                    animate={{
                      rotate: [0, 180, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    ✨
                  </motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.h1>
        </motion.div>

        {/* Counter refinado */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="stats-container"
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                type: "spring",
                stiffness: 80,
              }}
            >
              <div className="stats-card">
                <motion.div
                  className="stats-header"
                  animate={{
                    boxShadow: isGlowing
                      ? "0 0 30px rgba(255, 234, 167, 0.6)"
                      : "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ duration: 1.5 }}
                >
                  <Clock size={24} />
                  <h3>Nosso Tempo Juntos</h3>
                  <Heart size={24} fill="currentColor" />
                </motion.div>

                <div className="stats-grid">
                  <motion.div
                    className="stat-item primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.span
                      className="stat-number"
                      animate={{
                        textShadow: isGlowing
                          ? "0 0 20px rgba(255, 234, 167, 0.8)"
                          : "0 4px 20px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {days}
                    </motion.span>
                    <span className="stat-label">dias de amor</span>
                  </motion.div>

                  <div className="stats-mini-grid">
                    <div className="stat-item mini">
                      <span className="stat-number mini">{hours}</span>
                      <span className="stat-label mini">horas</span>
                    </div>
                    <div className="stat-item mini">
                      <span className="stat-number mini">{minutes}</span>
                      <span className="stat-label mini">min</span>
                    </div>
                    <div className="stat-item mini">
                      <span className="stat-number mini">{seconds}</span>
                      <span className="stat-label mini">seg</span>
                    </div>
                  </div>
                </div>

                {months > 0 && (
                  <motion.div
                    className="relationship-summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Star size={16} />
                    <span>
                      {months} meses e {remainingDays} dias juntos
                    </span>
                    <Star size={16} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button moderno */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="cta-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <motion.button
                className="cta-button-modern"
                onClick={onPreloadAndStart}
                disabled={isPreloading}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(255, 107, 107, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <motion.div
                  className="button-content"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                      "linear-gradient(45deg, #ee5a24, #ff6b6b)",
                      "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {isPreloading ? (
                    <span
                      className="loading-spinner"
                      style={{ marginRight: 8 }}
                    />
                  ) : (
                    <Play size={24} fill="white" />
                  )}
                  <span>
                    {isPreloading
                      ? "Carregando memórias..."
                      : "Começar nossa jornada"}
                  </span>
                  <motion.div
                    className="button-sparkle"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WelcomePage;
