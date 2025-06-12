import { useRef } from "react";
import html2canvas from "html2canvas";

interface StoryGeneratorProps {
  photos: string[];
  videos: string[];
  onClose: () => void;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({
  photos,
  videos,
  onClose,
}) => {
  const storyRef = useRef<HTMLDivElement>(null);

  // Função para verificar se uma mídia é válida e acessível
  const getValidMedia = () => {
    const validPhotos = photos.filter((photo) => {
      // Verifica formatos de imagem compatíveis
      const validImageFormats = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      return validImageFormats.some((format) =>
        photo.toLowerCase().endsWith(format)
      );
    });

    const validVideos = videos.filter((video) => {
      // Verifica formatos de vídeo compatíveis
      const validVideoFormats = [".mp4", ".webm", ".mov"];
      return validVideoFormats.some((format) =>
        video.toLowerCase().endsWith(format)
      );
    });

    return { validPhotos, validVideos };
  };

  const { validPhotos, validVideos } = getValidMedia();

  const generateStory = async () => {
    if (!storyRef.current) return;

    try {
      const canvas = await html2canvas(storyRef.current, {
        backgroundColor: "linear-gradient(135deg, #ff6b9d, #ff8a80)",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 1080,
        height: 1920, // Proporção 9:16 do Instagram Stories
      });

      // Converter para blob e baixar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `nossa-historia-story-12-06.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Erro ao gerar story:", error);
    }
  };
  // Seleciona algumas fotos válidas aleatórias para o story
  const selectedPhotos = validPhotos.slice(0, 4);
  const totalMedia = validPhotos.length + validVideos.length;

  return (
    <div className="story-generator-overlay">
      <div className="story-generator-modal">
        <div className="story-header">
          <h2>Criar Story para Instagram</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="story-preview" ref={storyRef}>
          <div className="story-background">
            <div className="story-content">
              <h1 className="story-title">Nossa História ❤️</h1>
              <div className="story-photos-grid">
                {selectedPhotos.map((photo, index) => (
                  <div key={index} className="story-photo">
                    <img
                      src={`/photos/${photo}`}
                      alt={`Memória ${index + 1}`}
                    />
                  </div>
                ))}
              </div>{" "}
              <div className="story-stats">
                <div className="stat-item">
                  <span className="stat-number">{validPhotos.length}</span>
                  <span className="stat-label">Fotos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{validVideos.length}</span>
                  <span className="stat-label">Vídeos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{totalMedia}</span>
                  <span className="stat-label">Memórias</span>
                </div>
              </div>
              <div className="story-date">
                <span>Nosso dia 12/06 💕</span>
              </div>
              <p className="story-message">
                "Você se tornou minha morada 🏠✨"
              </p>
              <div className="story-footer">
                <span>Para: Mari ✨</span>
                <span>De: Vinícius 💖</span>
              </div>
            </div>
          </div>
        </div>

        <div className="story-actions">
          <button className="story-button generate" onClick={generateStory}>
            📸 Gerar Story
          </button>
          <button className="story-button cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;
