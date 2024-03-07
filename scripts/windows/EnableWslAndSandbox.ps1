# Check if Microsoft-Windows-Subsystem-Linux is already enabled
$WSLFeature = dism.exe /online /get-featureinfo /featurename:Microsoft-Windows-Subsystem-Linux
if ($WSLFeature -match "State : Disabled") {
    Write-Output "Enabling Microsoft-Windows-Subsystem-Linux feature..."
    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
}
else {
    Write-Output "Microsoft-Windows-Subsystem-Linux feature is already enabled."
}

# Check if VirtualMachinePlatform is already enabled
$VMPFeature = dism.exe /online /get-featureinfo /featurename:VirtualMachinePlatform
if ($VMPFeature -match "State : Disabled") {
    Write-Output "Enabling VirtualMachinePlatform feature..."
    dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
}
else {
    Write-Output "VirtualMachinePlatform feature is already enabled."
}

# Check Windows version for enabling Containers-DisposableClientVM feature
if ((Get-WmiObject -Class Win32_OperatingSystem).Caption -notlike "*Home*") {
    Write-Output "Checking Containers-DisposableClientVM feature..."
    $ContainersFeature = Get-WindowsOptionalFeature -FeatureName "Containers-DisposableClientVM" -Online
    if ($ContainersFeature.State -eq "Disabled") {
        Write-Output "Enabling Containers-DisposableClientVM feature (i.e., Windows Sandbox)..."
        Enable-WindowsOptionalFeature -FeatureName "Containers-DisposableClientVM" -All -Online
    }
    else {
        Write-Output "Containers-DisposableClientVM feature is already enabled."
    }
}

PowerShell.exe -Command "& { wsl --update --web-download; wsl --set-default-version 2; wsl --install -d Ubuntu-20.04 --web-download }"
