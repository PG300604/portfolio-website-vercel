# restore-config.ps1
# Restores your backed-up environment (.env) and local configuration files from your local secure backup directory.

$backupDir = "$HOME\.portfolio-backup"

if (!(Test-Path $backupDir)) {
    Write-Host "[ERROR] No local backup directory found at: $backupDir" -ForegroundColor Red
    Write-Host "Please run backup-config.ps1 on your original setup first." -ForegroundColor Yellow
    exit
}

# Restore .env
if (Test-Path "$backupDir\.env") {
    Copy-Item "$backupDir\.env" -Destination ".env" -Force
    Write-Host "[SUCCESS] Restored .env to current directory." -ForegroundColor Green
} else {
    Write-Host "[WARNING] No backed up .env file found in $backupDir." -ForegroundColor Yellow
}

# Restore data folder
if (Test-Path "$backupDir\data") {
    if (!(Test-Path "data")) {
        New-Item -ItemType Directory -Force -Path "data" | Out-Null
    }
    Copy-Item "$backupDir\data\*" -Destination "data" -Recurse -Force
    Write-Host "[SUCCESS] Restored data folder to project directory." -ForegroundColor Green
}

Write-Host "Restore process complete! Your local environment is set up." -ForegroundColor Green
