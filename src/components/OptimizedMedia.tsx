import { useState, useRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Gerar paths para diferentes formatos
  const baseName = src.replace(/\.[^/.]+$/, "");
  const webpSrc = `${baseName}.webp`;
  const jpegSrc = `${baseName}.jpg`;
  const fallbackSrc = src;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={`image-error ${className}`}>
        <span>❌ Erro ao carregar imagem</span>
      </div>
    );
  }

  return (
    <picture className={className}>
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={jpegSrc} type="image/jpeg" />
      <img
        src={fallbackSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        className={`${!isLoaded ? "loading" : ""}`}
      />
    </picture>
  );
};

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  className = "",
  autoPlay = false,
  loop = true,
  muted = true,
  controls = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Gerar paths para diferentes formatos
  const baseName = src.replace(/\.[^/.]+$/, "");
  const webmSrc = `${baseName}.webm`;
  const mp4Src = `${baseName}.mp4`;

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <video
      ref={videoRef}
      className={`optimized-video ${className} ${!isLoaded ? "loading" : ""}`}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline
      preload="metadata"
      onLoadedData={handleLoadedData}
    >
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
      <p>Seu navegador não suporta vídeos HTML5.</p>
    </video>
  );
};

export default { OptimizedImage, OptimizedVideo };
