# Builds Chrome Web Store screenshots (1280x800) from the raw images in images/.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'store\screenshots'
if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$width = 1280
$height = 800
$bg = [System.Drawing.Color]::FromArgb(255, 255, 255)
$titleColor = [System.Drawing.Color]::FromArgb(27, 31, 36)
$subtitleColor = [System.Drawing.Color]::FromArgb(100, 110, 120)
$borderColor = [System.Drawing.Color]::FromArgb(222, 226, 231)

function New-StoreScreenshot {
  param(
    [string]$Source,
    [string]$Title,
    [string]$Subtitle,
    [string]$Output
  )

  $image = [System.Drawing.Image]::FromFile($Source)
  $canvas = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $titleFont = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold)
  $subtitleFont = New-Object System.Drawing.Font('Segoe UI', 18)
  $titleBrush = New-Object System.Drawing.SolidBrush($titleColor)
  $subtitleBrush = New-Object System.Drawing.SolidBrush($subtitleColor)
  $pen = New-Object System.Drawing.Pen($borderColor, 1)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = 'Center'

  try {
    $graphics.SmoothingMode = 'AntiAlias'
    $graphics.InterpolationMode = 'HighQualityBicubic'
    $graphics.TextRenderingHint = 'ClearTypeGridFit'
    $graphics.Clear($bg)

    $graphics.DrawString(
      $Title, $titleFont, $titleBrush,
      (New-Object System.Drawing.RectangleF(0, 72, $width, 60)), $format
    )
    if ($Subtitle) {
      $graphics.DrawString(
        $Subtitle, $subtitleFont, $subtitleBrush,
        (New-Object System.Drawing.RectangleF(0, 132, $width, 40)), $format
      )
    }

    $boxWidth = 1140
    $boxHeight = 540
    $top = 230
    $scale = [Math]::Min($boxWidth / $image.Width, $boxHeight / $image.Height)
    $drawWidth = [int]($image.Width * $scale)
    $drawHeight = [int]($image.Height * $scale)
    $x = [int](($width - $drawWidth) / 2)
    $y = [int]($top + ($boxHeight - $drawHeight) / 2)

    $rect = New-Object System.Drawing.Rectangle($x, $y, $drawWidth, $drawHeight)
    $graphics.DrawImage($image, $rect)
    $graphics.DrawRectangle($pen, $rect)

    $canvas.Save($Output, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $pen.Dispose(); $format.Dispose(); $titleBrush.Dispose(); $subtitleBrush.Dispose()
    $titleFont.Dispose(); $subtitleFont.Dispose()
    $graphics.Dispose(); $canvas.Dispose(); $image.Dispose()
  }

  Write-Host "Wrote $Output"
}

New-StoreScreenshot `
  -Source (Join-Path $root 'images\score_vs_peers.png') `
  -Title 'Peer-average score marker' `
  -Subtitle 'See exactly where you land versus everyone else on the Points Scored bar.' `
  -Output (Join-Path $outDir 'score-vs-peers-1280x800.png')

New-StoreScreenshot `
  -Source (Join-Path $root 'images\review_nav.png') `
  -Title 'Color-coded review navigation' `
  -Subtitle 'Correct, incorrect and unanswered questions at a glance.' `
  -Output (Join-Path $outDir 'review-nav-1280x800.png')
