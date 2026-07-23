param (
    [string]$AdminSecret,
    [string]$GhToken,
    [string]$GhOwner,
    [string]$GhRepo,
    [string]$GhBranch,
    [string]$EmailService,
    [string]$EmailTemplate,
    [string]$EmailKey
)

Write-Host "--- Portfolio Environment Setup ---" -ForegroundColor Cyan

if ([string]::IsNullOrEmpty($AdminSecret)) {
    $AdminSecret = Read-Host -Prompt "Enter Admin Secret (Default: Priyanshu@Admin2026)"
    if ([string]::IsNullOrEmpty($AdminSecret)) { $AdminSecret = "Priyanshu@Admin2026" }
}

if ([string]::IsNullOrEmpty($GhToken)) {
    $GhToken = Read-Host -Prompt "Enter GitHub Access Token"
}

if ([string]::IsNullOrEmpty($GhOwner)) {
    $GhOwner = Read-Host -Prompt "Enter GitHub Repository Owner (e.g. PG300604)"
}

if ([string]::IsNullOrEmpty($GhRepo)) {
    $GhRepo = Read-Host -Prompt "Enter GitHub Repository Name (e.g. portfolio-data)"
}

if ([string]::IsNullOrEmpty($GhBranch)) {
    $GhBranch = Read-Host -Prompt "Enter GitHub Branch Name (Default: main)"
    if ([string]::IsNullOrEmpty($GhBranch)) { $GhBranch = "main" }
}

if ([string]::IsNullOrEmpty($EmailService)) {
    $EmailService = Read-Host -Prompt "Enter EmailJS Service ID (e.g. service_fex03bg)"
}

if ([string]::IsNullOrEmpty($EmailTemplate)) {
    $EmailTemplate = Read-Host -Prompt "Enter EmailJS Template ID (e.g. template_athu7cj)"
}

if ([string]::IsNullOrEmpty($EmailKey)) {
    $EmailKey = Read-Host -Prompt "Enter EmailJS Public Key (e.g. oBJXBkHnlkoI3i_tg)"
}

$envContent = @"
VITE_ADMIN_SECRET=$AdminSecret
VITE_GH_TOKEN=$GhToken
VITE_GH_OWNER=$GhOwner
VITE_GH_REPO=$GhRepo
VITE_GH_BRANCH=$GhBranch

VITE_EMAILJS_SERVICE_ID=$EmailService
VITE_EMAILJS_TEMPLATE_ID=$EmailTemplate
VITE_EMAILJS_PUBLIC_KEY=$EmailKey
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
Write-Host "[SUCCESS] Created local .env file successfully!" -ForegroundColor Green
