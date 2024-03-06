$targets = @(
    "$env:APPDATA\Sublime Text\Packages\User"
)
foreach ($target in $targets) {
    Write-Host "Copy Sublime Text settings to $target"
    mkdir $target -Force
    xcopy /Y "${PATH}" $target
}
