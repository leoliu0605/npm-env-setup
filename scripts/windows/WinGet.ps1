# Check if winget exists
if (!(Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "winget is not installed, attempting to install..."
    try {
        # Execute Add-AppxPackage to install winget
        Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
        Write-Host "winget installation completed"
    } catch {
        Write-Host "Failed to install winget: $($_.Exception.Message)"
    }
} else {
    $wingetVersion = winget --version
    Write-Host "winget is already installed. Version: $wingetVersion"
}
