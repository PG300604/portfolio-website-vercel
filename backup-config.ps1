# backup-config.ps1
# Securely backups your local portfolio environment and configuration files to a private folder in your local user directory.

$backupDir = "$HOME\.portfolio-backup"

if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    Write-Host "Created local secure backup directory at: $backupDir" -ForegroundColor Cyan
}

# Backup .env file
if (Test-Path ".env") {
    Copy-Item ".env" -Destination "$backupDir\.env" -Force
    Write-Host "[SUCCESS] Backed up local .env to: $backupDir\.env" -ForegroundColor Green
} else {
    Write-Host "[WARNING] No local .env file found in this directory to backup." -ForegroundColor Yellow
}

# Backup local data folder if it exists
if (Test-Path "data") {
    if (!(Test-Path "$backupDir\data")) {
        New-Item -ItemType Directory -Force -Path "$backupDir\data" | Out-Null
    }
    Copy-Item "data\*" -Destination "$backupDir\data" -Recurse -Force
    Write-Host "[SUCCESS] Backed up local data folder to: $backupDir\data" -ForegroundColor Green
}

Write-Host "Backup process complete!" -ForegroundColor Green
