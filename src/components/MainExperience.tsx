import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";
import FloatingParticles from "./FloatingParticles";
import WaveAudioPlayer from "./WaveAudioPlayer";
import LetterAnimation from "./LetterAnimation";
import WaveSurfer from "wavesurfer.js";

interface MainExperienceProps {
  photos: string[];
  videos: string[];
  onRestart: () => void;
  onShare: () => void;
  pauseCarouselMusic?: () => void;
}

const MainExperience: React.FC<MainExperienceProps> = ({
  photos,
  videos,
  onRestart,
  onShare,
  pauseCarouselMusic,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLetter, setShowLetter] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showVinicius, setShowVinicius] = useState(false);

  // Referência para controlar o player de áudio
  const letterPlayerRef = useRef<WaveSurfer | null>(null);

  // Combina todas as mídias
  const allMedia = [
    ...photos.map((p) => ({ type: "photo" as const, src: p })),
    ...videos.map((v) => ({ type: "video" as const, src: v })),
  ];
  // Frases únicas e personalizadas explicando "morada"
  const personalizedPhrases = [
    "Você se tornou minha morada 🏠✨ - meu lugar de paz",
    "Em seus braços encontrei meu lar verdadeiro 💕",
    "Cada dia ao seu lado é uma nova descoberta 🌟",
    "Nossa história começou e meu mundo mudou 📖💫",
    "Você é meu refúgio em meio ao caos da vida 🌸",
    "Juntos construímos nosso próprio universo 🌍💝",
    "Seu sorriso é a chave da minha felicidade 😊🔑",
    "Morada não é um lugar, é uma pessoa - você 💖",
    "Cada memória nossa é um tesouro guardado 💎",
    "Nossa conexão transcende o tempo e espaço ⚡💕",
    "Você fez de mim uma pessoa melhor 🌱✨",
    "Juntos somos mais fortes que qualquer tempestade 💪⛈️",
    "Seu amor é minha inspiração diária 🎨💝",
    "Nossa história de amor continua sendo escrita... 📝💕",
    "Você é minha definição perfeita de amor 💖✨",
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      if (currentIndex < allMedia.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setShowLetter(true);
        setAutoPlay(false);
      }
    }, 5000); // Aumentado para 5 segundos para melhor experiência

    return () => clearTimeout(timer);
  }, [currentIndex, autoPlay, allMedia.length]);
  // Efeito para animação Schneider -> Vinícius na carta
  useEffect(() => {
    if (showLetter) {
      // Pausa a música do carrossel quando a carta aparece
      if (pauseCarouselMusic) pauseCarouselMusic();
      const timer = setTimeout(() => setShowVinicius(true), 14000); // 14 segundos
      return () => clearTimeout(timer);
    }
  }, [showLetter, pauseCarouselMusic]);

  // Funções de callback para controlar os players
  const handleLetterPlayerReady = (player: WaveSurfer) => {
    letterPlayerRef.current = player;
  };

  const handleNext = () => {
    setAutoPlay(false);
    if (currentIndex < allMedia.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowLetter(true);
    }
  };

  const handlePrev = () => {
    setAutoPlay(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };
  const currentMedia = allMedia[currentIndex];
  const currentPhrase =
    personalizedPhrases[currentIndex % personalizedPhrases.length];
  if (showLetter) {
    return (
      <LetterAnimation onComplete={() => {}}>
        <div className="letter-final">
          <FloatingParticles
            count={25}
            symbols={["💕", "💖", "✨", "🌹", "💍", "👑"]}
          />
          {/* Player para a carta: só monta enquanto showVinicius é false */}
          {showLetter && !showVinicius && (
            <div className="letter-audio-player">
              <WaveAudioPlayer
                key="letter-player"
                src="/music/letter-song.mp3"
                title="Nossa música especial - Carta 💌"
                autoPlay={true}
                volume={0.4}
                className="letter-player"
                onPlayerReady={handleLetterPlayerReady}
              />
            </div>
          )}
          <motion.div
            className="letter-container"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              className="letter-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ❤️
              </motion.div>
              <h2>Para você, meu amor</h2>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💌
              </motion.div>
            </motion.div>

            <div className="letter-content">
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 2 }}
              >
                Obrigado por me fazer tão feliz, por ser abrigo, por ser minha
                paz e minha alegria. É uma honra poder te chamar de minha
                namorada.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3, duration: 2 }}
              >
                Que esse contador nunca pare, que a gente siga juntos até o
                infinito — e que cada dia ao seu lado seja sempre leve, doce e
                cheio de amor.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5, duration: 2 }}
                className="letter-signature"
              >
                Com todo meu amor,
                <br />
                Seu{" "}
                <AnimatePresence mode="wait">
                  {!showVinicius ? (
                    <motion.span
                      key="schneider"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      transition={{ duration: 1.8 }} // mais lento
                    >
                      Schneider
                    </motion.span>
                  ) : (
                    <motion.span
                      key="vinicius"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 2.5, ease: "easeOut" }} // mais lento
                      style={{
                        background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "bold",
                      }}
                    >
                      Vinícius
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.p>
            </div>

            <motion.div
              className="letter-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 7 }}
            >
              <motion.button
                className="action-button restart"
                onClick={onRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={20} />
                Recomeçar 🔄
              </motion.button>
              <motion.button
                className="action-button share"
                onClick={onShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} />
                Compartilhar Story 📸
              </motion.button>{" "}
            </motion.div>
          </motion.div>
        </div>
      </LetterAnimation>
    );
  }
  return (
    <div className="main-experience-mobile">
      <FloatingParticles count={12} symbols={["💕", "✨", "🌸", "💖"]} />

      {/* Header com Player de Áudio - FIX: player fora do bloco que depende do currentIndex */}
      <div className="mobile-header">
        <div className="header-content">
          <motion.div
            className="header-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="title-emoji">💝</span>
            <h2>Nossas Memórias</h2>
            <span className="title-emoji">💝</span>
          </motion.div>{" "}
        </div>
      </div>

      {/* Contador de Progresso Mobile */}
      <div className="mobile-progress">
        <div className="progress-info">
          <span className="current-count">{currentIndex + 1}</span>
          <span className="separator">/</span>
          <span className="total-count">{allMedia.length}</span>
        </div>
        <div className="progress-bar-container">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / allMedia.length) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <div className="progress-dots-mobile">
          {allMedia
            .slice(Math.max(0, currentIndex - 2), currentIndex + 3)
            .map((_, index) => {
              const actualIndex = Math.max(0, currentIndex - 2) + index;
              return (
                <motion.div
                  key={actualIndex}
                  className={`dot-mobile ${
                    actualIndex === currentIndex ? "active" : ""
                  }`}
                  animate={{
                    scale: actualIndex === currentIndex ? 1.5 : 1,
                    opacity: actualIndex === currentIndex ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
        </div>
      </div>

      {/* Container Principal da Mídia */}
      <div className="mobile-media-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="mobile-media-wrapper"
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              scale: { duration: 0.3 },
            }}
          >
            <div className="media-card">
              {currentMedia?.type === "photo" ? (
                <img
                  src={`/photos/${currentMedia.src}`}
                  alt="Nossa memória"
                  className="mobile-media-image"
                />
              ) : (
                <video
                  src={`/videos/${currentMedia.src}`}
                  className="mobile-media-video"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              )}

              {/* Overlay com informações */}
              <div className="media-overlay-mobile">
                <div className="media-type-badge">
                  {currentMedia?.type === "photo" ? "📸" : "🎬"}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de Navegação Mobile */}
      <div className="mobile-navigation">
        <motion.button
          className="nav-btn-mobile prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: currentIndex === 0 ? 1 : 1.1 }}
        >
          <ChevronLeft size={28} />
        </motion.button>

        <motion.button
          className="nav-btn-mobile next"
          onClick={handleNext}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          {currentIndex === allMedia.length - 1 ? (
            <>
              <Heart size={28} fill="currentColor" />
              <span className="next-label">Carta</span>
            </>
          ) : (
            <>
              <ChevronRight size={28} />
              <span className="next-label">Próxima</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Frase Romântica Mobile */}
      <motion.div
        className="mobile-romantic-phrase"
        key={currentIndex}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p>{currentPhrase}</p>
      </motion.div>

      {/* Auto-play toggle */}
      <div className="mobile-controls">
        <motion.button
          className={`autoplay-toggle ${autoPlay ? "active" : ""}`}
          onClick={() => setAutoPlay(!autoPlay)}
          whileTap={{ scale: 0.95 }}
        >
          {autoPlay ? <Pause size={16} /> : <Play size={16} />}
          <span>{autoPlay ? "Pausar" : "Auto-play"}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default MainExperience;
