$envFile = Join-Path $PSScriptRoot "fusion-backend\.env"
if (!(Test-Path $envFile)) {
  Write-Host "Missing fusion-backend\.env. Copy .env.example to .env first." -ForegroundColor Red
  exit 1
}
$content = Get-Content $envFile -Raw
$checks = @(
  @{ Name = "MONGO_URI"; Pattern = "(?m)^MONGO_URI=(.+)$" },
  @{ Name = "JWT_SECRET"; Pattern = "(?m)^JWT_SECRET=(.+)$" }
)
$failed = $false
foreach ($item in $checks) {
  $m = [regex]::Match($content, $item.Pattern)
  if (!$m.Success -or !$m.Groups[1].Value.Trim() -or $m.Groups[1].Value -match "YOUR_|replace_with|<username>|<password>|<cluster") {
    Write-Host "$($item.Name): missing or still a placeholder" -ForegroundColor Red
    $failed = $true
  } else {
    Write-Host "$($item.Name): present (value hidden)" -ForegroundColor Green
  }
}
if ($content -match "YOUR_CLUSTER|YOUR_USERNAME|YOUR_PASSWORD") {
  Write-Host "MongoDB URI still contains sample placeholders." -ForegroundColor Red
  $failed = $true
}
if ($failed) { exit 1 }
Write-Host "Basic environment check passed. This does not verify that MongoDB credentials/network access work." -ForegroundColor Green
