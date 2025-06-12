# Script de Otimização de Mídia para Projeto Romântico
# Requer: FFmpeg instalado no sistema

Write-Host "🎨 Iniciando otimização de mídia..." -ForegroundColor Cyan

$projectRoot = "c:\Users\Schneider\GitHub\for-my-home\public"
$photosPath = "$projectRoot\photos"
$videosPath = "$projectRoot\videos"
$musicPath = "$projectRoot\music"

# Verificar se FFmpeg está instalado
try {
    ffmpeg -version | Out-Null
    Write-Host "✅ FFmpeg encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ FFmpeg não encontrado. Instale com: winget install Gyan.FFmpeg" -ForegroundColor Red
    exit 1
}

# Função para converter HEIC para WebP + JPEG
function Convert-Images {
    Write-Host "`n📸 Convertendo imagens..." -ForegroundColor Yellow
    
    Get-ChildItem -Path $photosPath -Filter "*.heic" | ForEach-Object {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $webpPath = Join-Path $photosPath "$baseName.webp"
        $jpegPath = Join-Path $photosPath "$baseName.jpg"
        
        # Converter para WebP (qualidade 85) - silencioso
        ffmpeg -i $_.FullName -q:v 85 -f webp $webpPath -y -loglevel error
        
        # Converter para JPEG (qualidade 90, progressive) - corrigido
        ffmpeg -i $_.FullName -q:v 2 -pix_fmt yuv420p -update 1 $jpegPath -y -loglevel error
        
        Write-Host "✅ Convertido: $($_.Name)" -ForegroundColor Green
    }
}

# Função para otimizar vídeos MOV para MP4
function Convert-Videos {
    Write-Host "`n🎬 Otimizando vídeos..." -ForegroundColor Yellow
    
    Get-ChildItem -Path $videosPath -Filter "*.mov" | ForEach-Object {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $mp4Path = Join-Path $videosPath "$baseName.mp4"
        
        # Converter MOV para MP4 otimizado para web
        ffmpeg -i $_.FullName -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart $mp4Path -y
        
        Write-Host "✅ Convertido: $($_.Name)" -ForegroundColor Green
    }
}

# Função para otimizar áudios
function Optimize-Audio {
    Write-Host "`n🎵 Otimizando áudios..." -ForegroundColor Yellow
    
    Get-ChildItem -Path $musicPath -Filter "*.mp3" | ForEach-Object {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $optimizedPath = Join-Path $musicPath "$baseName-optimized.mp3"
        
        # Otimizar MP3 (192kbps, stereo)
        ffmpeg -i $_.FullName -b:a 192k -ac 2 -ar 44100 $optimizedPath -y
        
        Write-Host "✅ Otimizado: $($_.Name)" -ForegroundColor Green
    }
}

# Executar conversões
Convert-Images
Convert-Videos
Optimize-Audio

Write-Host "`n🎉 Otimização concluída!" -ForegroundColor Green
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Testar os novos arquivos na aplicação" -ForegroundColor White
Write-Host "2. Remover arquivos originais após validação" -ForegroundColor White
Write-Host "3. Atualizar componentes para usar picture/source tags" -ForegroundColor White
