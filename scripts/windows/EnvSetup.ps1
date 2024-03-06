$array = @(
    ${PATHS}
)
foreach ($path in $array) {
    $InstallFolder = $null
    $InstallFolder = $path

    try {
        $registryKey = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey('Environment', $false)
        $originalPath = $registryKey.GetValue(
            'PATH',
            '',
            [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames
        )
        $pathParts = $originalPath -split ';'

        if (!($pathParts -contains $InstallFolder)) {
            Write-Host "Adding $InstallFolder to PATH"

            [Environment]::SetEnvironmentVariable(
                'PATH',
                "$originalPath;$InstallFolder",
                [EnvironmentVariableTarget]::User
            )

            # Also add the path to the current session
            $env:PATH += ";$InstallFolder"
        }
        else {
            Write-Host "An entry for $InstallFolder is already in PATH"
        }
    }
    finally {
        if ($registryKey) {
            $registryKey.Close()
        }
    }
}
