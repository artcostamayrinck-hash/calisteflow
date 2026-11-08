Add-Type -AssemblyName System.Drawing
$publicDir = "C:\Users\mayri\OneDrive\Documentos\calisteflow-main\calisteflow-main\public"

function Create-AppIcon {
    param(
        [string]$outputPath,
        [int]$size,
        [bool]$isMaskable = $false
    )

    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background color #020617 (slate-950)
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#020617"))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    # Ambient radial-like glow with emerald (#10b981)
    $glowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(45, 16, 185, 129))
    $g.FillEllipse($glowBrush, [int]($size * 0.15), [int]($size * 0.15), [int]($size * 0.7), [int]($size * 0.7))

    $contentPadding = if ($isMaskable) { [int]($size * 0.22) } else { [int]($size * 0.14) }
    $contentSize = $size - ($contentPadding * 2)

    $emeraldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#10b981"))
    $cyanBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#06b6d4"))

    $centerX = [float]($size / 2)
    $centerY = [float]($size / 2)
    $w = [float]$contentSize

    # Draw CalisteFlow stylized geometric "C" and "F" icon
    $pts = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new([float]($centerX), [float]($centerY - $w * 0.35)),
        [System.Drawing.PointF]::new([float]($centerX + $w * 0.38), [float]($centerY - $w * 0.05)),
        [System.Drawing.PointF]::new([float]($centerX + $w * 0.15), [float]($centerY - $w * 0.05)),
        [System.Drawing.PointF]::new([float]($centerX + $w * 0.28), [float]($centerY + $w * 0.35)),
        [System.Drawing.PointF]::new([float]($centerX - $w * 0.15), [float]($centerY + $w * 0.05)),
        [System.Drawing.PointF]::new([float]($centerX), [float]($centerY + $w * 0.05)),
        [System.Drawing.PointF]::new([float]($centerX - $w * 0.35), [float]($centerY - $w * 0.05)),
        [System.Drawing.PointF]::new([float]($centerX - $w * 0.1), [float]($centerY - $w * 0.05))
    )
    $g.FillPolygon($emeraldBrush, $pts)

    $pen = New-Object System.Drawing.Pen ($cyanBrush, [float]($size * 0.06))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($pen, [float]($centerX - $w * 0.36), [float]($centerY + $w * 0.36), [float]($centerX + $w * 0.36), [float]($centerY + $w * 0.36))

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $pen.Dispose()
    $cyanBrush.Dispose()
    $emeraldBrush.Dispose()
    $glowBrush.Dispose()
    $bgBrush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

Create-AppIcon -outputPath "$publicDir\pwa-192x192.png" -size 192 -isMaskable $false
Create-AppIcon -outputPath "$publicDir\pwa-512x512.png" -size 512 -isMaskable $false
Create-AppIcon -outputPath "$publicDir\maskable-icon-512x512.png" -size 512 -isMaskable $true
Create-AppIcon -outputPath "$publicDir\apple-touch-icon.png" -size 180 -isMaskable $false

Write-Output "PWA and Apple Touch icons generated successfully."
