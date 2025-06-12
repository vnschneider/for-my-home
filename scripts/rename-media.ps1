param(
    [string]$Dir = $(throw 'Informe o diretório com -Dir'),
    [string]$Prefix = $(throw 'Informe o prefixo com -Prefix'),
    [string]$Ext = $(throw 'Informe a extensão com -Ext')
)

Write-Host "🔄 Renomeando arquivos em $Dir para padrão $Prefix#.${Ext}..." -ForegroundColor Cyan

$files = Get-ChildItem -Path $Dir -Filter "*.$Ext" | Sort-Object Name

$idx = 1
foreach ($file in $files) {
    $newName = "${Prefix}$idx.$Ext"
    $newPath = Join-Path $Dir $newName
    if ($file.FullName -ne $newPath) {
        Rename-Item -Path $file.FullName -NewName $newName
        Write-Host "Renomeado: $($file.Name) → $newName" -ForegroundColor Green
    }
    $idx++
}

Write-Host "✅ Renomeação concluída!" -ForegroundColor Green
