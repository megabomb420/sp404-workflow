# Generates PWA icons for SP Workflow using System.Drawing (no native npm deps).
# Icon: graphite chassis + 4x4 pad grid, one amber "active" pad, green status LEDs.
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$outDir = Join-Path $root "public\icons"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-RoundedRectPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-Icon([int]$size, [string]$file, [bool]$maskable) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # chassis background
    $g.Clear([System.Drawing.Color]::FromArgb(255, 18, 19, 21))

    $padBg    = [System.Drawing.Color]::FromArgb(255, 38, 40, 46)
    $padBorder = [System.Drawing.Color]::FromArgb(255, 66, 70, 80)
    $amber    = [System.Drawing.Color]::FromArgb(255, 232, 150, 44)
    $amberDim = [System.Drawing.Color]::FromArgb(255, 170, 108, 32)
    $led      = [System.Drawing.Color]::FromArgb(255, 88, 192, 90)
    $ledDim   = [System.Drawing.Color]::FromArgb(255, 40, 90, 44)

    $margin = if ($maskable) { $size * 0.22 } else { $size * 0.10 }
    $gX = $margin; $gY = $margin
    $gW = $size - (2 * $margin)
    $gap = $gW * 0.055
    $pad = ($gW - (3 * $gap)) / 4.0

    for ($i = 0; $i -lt 16; $i++) {
        $col = $i % 4
        $row = [math]::Floor($i / 4)
        $x = $gX + $col * ($pad + $gap)
        $y = $gY + $row * ($pad + $gap)

        $active = ($i -eq 9)   # pad 10 (SIDECHAIN) = amber accent
        if ($active) {
            $brush = New-Object System.Drawing.SolidBrush($amber)
            $pen = New-Object System.Drawing.Pen($amberDim, [math]::Max(1.0, $size * 0.008))
        } else {
            $brush = New-Object System.Drawing.SolidBrush($padBg)
            $pen = New-Object System.Drawing.Pen($padBorder, [math]::Max(1.0, $size * 0.006))
        }
        $r = $pad * 0.13
        $g.FillPath($brush, (New-RoundedRectPath $x $y $pad $pad $r))
        $g.DrawPath($pen, (New-RoundedRectPath $x $y $pad $pad $r))

        # status LED
        $ledSize = $pad * 0.13
        $ledBrush = if ($active) { New-Object System.Drawing.SolidBrush($led) } else { New-Object System.Drawing.SolidBrush($ledDim) }
        $g.FillEllipse($ledBrush, ($x + $pad - $ledSize - $pad * 0.14), ($y + $pad * 0.14), $ledSize, $ledSize)
        $ledBrush.Dispose()
        $brush.Dispose(); $pen.Dispose()
    }

    $out = Join-Path $outDir $file
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Host "saved $out ($size px)"
}

New-Icon 192 "icon-192.png"  $false
New-Icon 512 "icon-512.png"  $false
New-Icon 512 "icon-maskable-512.png" $true
New-Icon 180 "apple-touch-icon.png" $false
Write-Host "icons OK"
