import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomePageNew from "./components/WelcomePageNew";
import OverviewPage from "./components/OverviewPage";
import MainExperience from "./components/MainExperience";
import StoryGenerator from "./components/StoryGenerator";
import WaveAudioPlayer from "./components/WaveAudioPlayer";
import "./NewApp.css";
import WaveSurfer from "wavesurfer.js";

type AppState = "welcome" | "overview" | "experience";

function App() {
  const [currentState, setCurrentState] = useState<AppState>("welcome");
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const carouselPlayerRef = useRef<WaveSurfer | null>(null);

  // Lista real dos arquivos presentes nas pastas
  const photos = [
    "photo1.webp",
    "photo2.webp",
    "photo3.webp",
    "photo4.webp",
    "photo5.webp",
    "photo6.webp",
    "photo7.webp",
    "photo8.webp",
    "photo9.webp",
    "photo10.webp",
    "photo11.webp",
    "photo12.webp",
    "photo13.webp",
    "photo14.webp",
    "photo15.webp",
    "photo16.webp",
    "photo17.webp",
    "photo18.webp",
    "photo19.webp",
    "photo20.webp",
    "photo21.webp",
    "photo22.webp",
    "photo23.webp",
    "photo24.webp",
  ];
  const videos = [
    "video1.webm",
    "video2.webm",
    "video3.webm",
    "video4.webm",
    "video5.webm",
    "video6.webm",
    "video7.webm",
    "video8.webm",
    "video9.webm",
    "video10.webm",
    "video11.webm",
  ];

  function preloadMedia(
    photos: string[],
    videos: string[],
    musics: string[]
  ): Promise<void> {
    // Helper para carregar uma imagem
    const loadImage = (src: string) =>
      new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
        img.src = `/photos/${src}`;
      });
    // Helper para carregar um vídeo
    const loadVideo = (src: string) =>
      new Promise((resolve) => {
        const video = document.createElement("video");
        video.onloadeddata = () => resolve(true);
        video.onerror = () => resolve(true);
        video.preload = "auto";
        video.src = `/videos/${src}`;
      });
    // Helper para carregar um áudio
    const loadAudio = (src: string) =>
      new Promise((resolve) => {
        const audio = document.createElement("audio");
        audio.onloadeddata = () => resolve(true);
        audio.onerror = () => resolve(true);
        audio.preload = "auto";
        audio.src = `/music/${src}`;
      });
    // Lista de músicas
    const allMusics = musics;
    // Preload tudo em paralelo
    return Promise.all([
      ...photos.map(loadImage),
      ...videos.map(loadVideo),
      ...allMusics.map(loadAudio),
    ]).then(() => undefined);
  }

  const handleOverviewComplete = () => setCurrentState("experience");
  const handleRestart = () => setCurrentState("welcome");
  // Corrige bug: ao abrir o StoryGenerator, pausa o player do carrossel
  const handleShare = () => {
    if (carouselPlayerRef.current && carouselPlayerRef.current.isPlaying()) {
      carouselPlayerRef.current.pause();
    }
    setShowStoryGenerator(true);
  };
  const handleCloseStory = () => setShowStoryGenerator(false);

  const handlePreloadAndStart = async () => {
    setIsPreloading(true);
    await preloadMedia(photos, videos, []); // Não faz preload de músicas
    setIsPreloading(false);
    setCurrentState("overview");
  };

  // Função para pausar o player do carrossel (usada pela carta)
  const pauseCarouselMusic = () => {
    if (carouselPlayerRef.current && carouselPlayerRef.current.isPlaying()) {
      carouselPlayerRef.current.pause();
    }
  };

  return (
    <div className="app">
      {/* Player global do carrossel, só é montado durante a experiência */}
      {currentState === "experience" && (
        <div
          className="carousel-player-global-wrapper"
          style={{
            position: "fixed",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: "92vw",
            maxWidth: 320,
            zIndex: 120,
            pointerEvents: "auto",
            borderRadius: 18,
            boxShadow: "none",
            padding: 0,
          }}
        >
          <WaveAudioPlayer
            src="/music/carousel-song.mp3"
            title="Música do Carrossel 🎵"
            autoPlay={true}
            volume={0.3}
            className="carousel-player-global"
            onPlayerReady={(player) => (carouselPlayerRef.current = player)}
          />
        </div>
      )}
      <AnimatePresence mode="wait">
        {currentState === "welcome" && (
          <WelcomePageNew
            key="welcome"
            onPreloadAndStart={handlePreloadAndStart}
            isPreloading={isPreloading}
          />
        )}
        {currentState === "overview" && (
          <OverviewPage
            key="overview"
            onComplete={handleOverviewComplete}
            photos={photos}
            videos={videos}
          />
        )}
        {currentState === "experience" && (
          <MainExperience
            key="experience"
            photos={photos}
            videos={videos}
            onRestart={handleRestart}
            onShare={handleShare}
            pauseCarouselMusic={pauseCarouselMusic}
          />
        )}
      </AnimatePresence>
      {showStoryGenerator && (
        <StoryGenerator
          photos={photos}
          videos={videos}
          onClose={handleCloseStory}
        />
      )}
    </div>
  );
}

export default App;
