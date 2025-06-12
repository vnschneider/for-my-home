import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  SkipBack,
  SkipForward,
} from "lucide-react";
import WaveSurfer from "wavesurfer.js";

interface WaveAudioPlayerProps {
  src: string;
  title: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
  className?: string;
  onPlayerReady?: (player: WaveSurfer) => void; // Callback para controle externo
}

const WaveAudioPlayer: React.FC<WaveAudioPlayerProps> = ({
  src,
  title,
  autoPlay = false,
  loop = true,
  volume = 0.5,
  className = "",
  onPlayerReady,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Inicializa o WaveSurfer com design moderno
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgba(255, 182, 193, 0.4)",
      progressColor: "#ff6b9d",
      cursorColor: "#ffffff",
      barWidth: 2,
      barRadius: 2,
      barGap: 1,
      height: 80,
      normalize: true,
      interact: true,
      hideScrollbar: true,
      backend: "WebAudio",
    });

    // Carrega o áudio
    wavesurfer.current.load(src);
    let autoPlayed = false;
    wavesurfer.current.on("ready", () => {
      setDuration(wavesurfer.current?.getDuration() || 0);
      setIsLoading(false);
      if (autoPlay && !autoPlayed && !wavesurfer.current?.isPlaying()) {
        wavesurfer.current?.play();
        setIsPlaying(true);
        autoPlayed = true;
      }
      // Callback para controle externo
      if (onPlayerReady && wavesurfer.current) {
        onPlayerReady(wavesurfer.current);
      }
    });

    wavesurfer.current.on("play", () => setIsPlaying(true));
    wavesurfer.current.on("pause", () => setIsPlaying(false));

    wavesurfer.current.on("audioprocess", () => {
      if (wavesurfer.current) {
        const current = wavesurfer.current.getCurrentTime();
        setCurrentTime(current);
      }
    });

    wavesurfer.current.on("finish", () => {
      if (loop) {
        wavesurfer.current?.seekTo(0);
        wavesurfer.current?.play();
      } else {
        setIsPlaying(false);
      }
    });
    return () => {
      wavesurfer.current?.destroy();
    };
  }, [src, autoPlay, loop, onPlayerReady]);

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(isMuted ? 0 : currentVolume);
    }
  }, [currentVolume, isMuted]);

  const togglePlay = () => {
    if (wavesurfer.current) {
      if (wavesurfer.current.isPlaying()) {
        wavesurfer.current.pause();
      } else {
        wavesurfer.current.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
    setIsMuted(false);
  };

  const skipBackward = () => {
    if (wavesurfer.current) {
      const current = wavesurfer.current.getCurrentTime();
      wavesurfer.current.seekTo(Math.max(0, current - 10) / duration);
    }
  };

  const skipForward = () => {
    if (wavesurfer.current) {
      const current = wavesurfer.current.getCurrentTime();
      wavesurfer.current.seekTo(Math.min(duration, current + 10) / duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`wave-audio-player ${className}`}>
      {/* Header com informações da música */}
      <div className="player-header">
        <motion.div
          className="music-icon-container"
          animate={{
            rotate: isPlaying ? 360 : 0,
            scale: isPlaying ? 1.1 : 1,
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.3 },
          }}
        >
          <Music className="music-icon" />
        </motion.div>
        <div className="song-info">
          <h3 className="song-title">{title}</h3>
          <div className="time-info">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Waveform visual */}
      <div className="waveform-container">
        {isLoading && (
          <div className="loading-wave">
            <motion.div
              className="loading-bar"
              animate={{ scaleY: [1, 2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.div
              className="loading-bar"
              animate={{ scaleY: [1, 2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
            />
            <motion.div
              className="loading-bar"
              animate={{ scaleY: [1, 2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        )}
        <div ref={waveformRef} className="waveform" />
      </div>

      {/* Controles */}
      <div className="player-controls">
        <motion.button
          className="control-btn"
          onClick={skipBackward}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipBack size={20} />
        </motion.button>

        <motion.button
          className="play-btn"
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            backgroundColor: isPlaying ? "#ff6b9d" : "#ffffff20",
          }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </motion.button>

        <motion.button
          className="control-btn"
          onClick={skipForward}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipForward size={20} />
        </motion.button>
      </div>

      {/* Controle de volume */}
      <div className="volume-control">
        <motion.button
          className="volume-btn"
          onClick={toggleMute}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : currentVolume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default WaveAudioPlayer;
