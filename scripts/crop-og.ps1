Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\mayri\.gemini\antigravity\brain\3d202cc5-97e4-40ef-8556-2faa2c1173f0\calisteflow_og_image_1794100566392.jpg"
$destPng = "C:\Users\mayri\OneDrive\Documentos\calisteflow-main\calisteflow-main\public\og-image.png"
$destJpg = "C:\Users\mayri\OneDrive\Documentos\calisteflow-main\calisteflow-main\public\og-image.jpg"

$src = [System.Drawing.Image]::FromFile($srcPath)
$targetW = 1200
$targetH = 630

$srcAspect = $src.Width / $src.Height
$targetAspect = $targetW / $targetH

if ($srcAspect -gt $targetAspect) {
    $cropW = [int]($src.Height * $targetAspect)
    $cropH = $src.Height
    $cropX = [int](($src.Width - $cropW) / 2)
    $cropY = 0
} else {
    $cropW = $src.Width
    $cropH = [int]($src.Width / $targetAspect)
    $cropX = 0
    $cropY = [int](($src.Height - $cropH) / 2)
}

$bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($destJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$bmp.Dispose()
$src.Dispose()
Write-Output "OG images generated successfully: 1200x630"

