import { motion } from "framer-motion";
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
  className?: string;
  onPlayerReady?: (player: AudioPlayerHandle) => void;
}

export interface AudioPlayerHandle {
  play: () => void;
  pause: () => void;
  stop: () => void;
  isPlaying: () => boolean;
}

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  (
    {
      src,
      title,
      autoPlay = false,
      loop = true,
      volume = 0.5,
      className = "",
      onPlayerReady,
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentVolume, setCurrentVolume] = useState(volume);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Expõe métodos para componentes pais
    useImperativeHandle(ref, () => ({
      play: () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      },
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      },
      stop: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      },
      isPlaying: () => isPlaying,
    }));

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const updateProgress = () => {
        if (audio.duration) {
          const current = audio.currentTime;
          const total = audio.duration;
          setCurrentTime(current);
          setProgress((current / total) * 100);
        }
      };

      const handleLoadedData = () => {
        setDuration(audio.duration || 0);
        setIsLoading(false);
        if (autoPlay) {
          audio.play().catch(console.error);
        }
        // Notifica que o player está pronto
        if (onPlayerReady) {
          onPlayerReady({
            play: () => audio.play(),
            pause: () => audio.pause(),
            stop: () => {
              audio.pause();
              audio.currentTime = 0;
            },
            isPlaying: () => !audio.paused,
          });
        }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        if (!loop) {
          setProgress(0);
        }
      };

      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadeddata", handleLoadedData);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("loadeddata", handleLoadedData);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }, [autoPlay, loop, onPlayerReady]);

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : currentVolume;
      }
    }, [currentVolume, isMuted]);

    const togglePlay = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        if (isPlaying) {
          audio.pause();
        } else {
          await audio.play();
        }
      } catch (error) {
        console.error("Erro ao reproduzir áudio:", error);
      }
    };

    const toggleMute = () => {
      setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setCurrentVolume(newVolume);
      setIsMuted(newVolume === 0);
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (isLoading) {
      return (
        <div className={`audio-player loading ${className}`}>
          <div className="loading-animation">
            <div className="loading-bars">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="loading-bar"
                  animate={{
                    scaleY: [0.4, 1, 0.4],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <span className="loading-text">Carregando música...</span>
          </div>
        </div>
      );
    }

    return (
      <div className={`audio-player ${className}`}>
        <audio ref={audioRef} src={src} loop={loop} preload="auto" />

        <div className="player-header">
          <motion.div
            className="music-icon"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{
              duration: 4,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
            }}
          >
            🎵
          </motion.div>
          <div className="song-info">
            <span className="song-title">{title}</span>
            <div className="time-info">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        <div className="player-controls">
          <motion.button
            className="play-pause-btn"
            onClick={togglePlay}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            disabled={isLoading}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>

          <div className="volume-control">
            <motion.button
              className="mute-btn"
              onClick={toggleMute}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
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

        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
