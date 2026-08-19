# Downscales reference/shots/*.png to width 360 for inline viewing.
Add-Type -AssemblyName System.Drawing
$dir = Join-Path (Split-Path -Parent (Split-Path -Parent $PSCommandPath)) "reference\shots"
Get-ChildItem -Path $dir -Filter *.png | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $w = 360
  $h = [int]([math]::Round($img.Height * ($w / $img.Width)))
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $w, $h)
  $out = Join-Path $dir ($_.BaseName + "-360.png")
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  Write-Host "saved $out"
}
