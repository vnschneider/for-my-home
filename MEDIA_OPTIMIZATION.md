# 🎨 Guia de Otimização de Mídia

## 📋 Resumo das Recomendações

### 🎵 **ÁUDIO** ✅

- **Formato atual**: MP3 (perfeito!)
- **Configuração ideal**: 128-192 kbps, 44.1 kHz, Stereo
- **Seus arquivos**: `carousel-song.mp3` (5MB), `letter-song.mp3` (9MB)

### 📸 **IMAGENS** ❌ PRECISA OTIMIZAR

- **Problema**: 5 arquivos `.heic` não funcionam em navegadores
- **Solução**: Converter para WebP + JPEG como fallback
- **Benefício**: 25-30% menor tamanho, melhor qualidade

### 🎬 **VÍDEOS** ⚠️ PODE MELHORAR

- **Problema**: 3 arquivos `.mov` não otimizados para web
- **Solução**: Converter para MP4 com H.264
- **Benefício**: Melhor streaming, menor tamanho

---

## 🚀 Instalação do FFmpeg (Necessário para conversão)

### Método 1: Via Winget (Recomendado)

```powershell
winget install Gyan.FFmpeg
```

### Método 2: Via Chocolatey

```powershell
choco install ffmpeg
```

### Método 3: Download Manual

1. Baixe em: https://ffmpeg.org/download.html#build-windows
2. Extraia para `C:\ffmpeg`
3. Adicione `C:\ffmpeg\bin` ao PATH

---

## 🎯 Scripts de Conversão

### Executar conversão automática:

```powershell
cd "c:\Users\Schneider\GitHub\for-my-home"
.\scripts\optimize-media.ps1
```

### Conversões manuais específicas:

#### HEIC → WebP + JPEG:

```bash
# Para WebP (menor tamanho)
ffmpeg -i photo.heic -q:v 85 -f webp photo.webp

# Para JPEG (compatibilidade)
ffmpeg -i photo.heic -q:v 2 -pix_fmt yuvj420p photo.jpg
```

#### MOV → MP4 otimizado:

```bash
ffmpeg -i video.mov -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart video.mp4
```

#### MP3 otimização:

```bash
ffmpeg -i music.mp3 -b:a 192k -ac 2 -ar 44100 music-optimized.mp3
```

---

## 📊 Comparação de Tamanhos Esperados

| Formato Atual        | Tamanho Atual | Formato Otimizado | Tamanho Esperado | Economia |
| -------------------- | ------------- | ----------------- | ---------------- | -------- |
| `.heic` (5 arquivos) | ~6MB          | `.webp` + `.jpg`  | ~4MB             | ~33%     |
| `.mov` (3 arquivos)  | ~33MB         | `.mp4` optimized  | ~20MB            | ~40%     |
| `.mp3` (2 arquivos)  | ~14MB         | `.mp3` optimized  | ~10MB            | ~30%     |

**Total**: De ~53MB para ~34MB = **36% de economia**

---

## 🔄 Implementação no Código

Após conversão, usar componentes otimizados:

```tsx
import { OptimizedImage, OptimizedVideo } from './components/OptimizedMedia';

// Para imagens
<OptimizedImage
  src="/photos/photo1"
  alt="Foto romântica"
  className="carousel-image"
/>

// Para vídeos
<OptimizedVideo
  src="/videos/video1"
  className="carousel-video"
  autoPlay
  muted
  loop
/>
```

---

## ✅ Checklist de Otimização

- [ ] Instalar FFmpeg
- [ ] Executar script de conversão
- [ ] Testar novos arquivos na aplicação
- [ ] Atualizar componentes para usar `OptimizedMedia`
- [ ] Remover arquivos originais após validação
- [ ] Verificar performance no mobile

---

## 🎯 Próximos Passos

1. **Instale o FFmpeg** usando um dos métodos acima
2. **Execute o script**: `.\scripts\optimize-media.ps1`
3. **Teste os arquivos convertidos** na aplicação
4. **Atualize os componentes** para usar os novos formatos
5. **Monitore a performance** - especialmente no mobile

**Resultado esperado**: Aplicação 36% mais rápida para carregar mídia! 🚀
