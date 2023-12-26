const runAsAdministrator = `
Set-StrictMode -Version Latest
function Invoke-Administrator([String] $FilePath, [String[]] $ArgumentList = '') {
    $Current = [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
    $Administrator = [Security.Principal.WindowsBuiltInRole]::Administrator

    if (-not $Current.IsInRole($Administrator)) {
        $PowerShellPath = (Get-Process -Id $PID).Path
        $Command = "" + $FilePath + "$ArgumentList" + ""
        Start-Process $PowerShellPath "-NoProfile -ExecutionPolicy Bypass -File $Command" -Verb RunAs
        exit
    }
    else {
        Set-ExecutionPolicy -Scope Process -ExecutionPolicy ByPass
    }

    $ParentFolder = [System.IO.Path]::GetDirectoryName($FilePath)
    Set-Location $ParentFolder
    Write-Host "Current working directory: $($PWD.Path)"
}
Invoke-Administrator $PSCommandPath
`;

const installChocolatey = `Set-ExecutionPolicy Bypass -Scope LocalMachine -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')); Import-Module $env:ChocolateyInstall\helpers\chocolateyProfile.psm1
`;

class PowerShell {
    constructor() {
        this.commands = [];
        this.environment = [];
        this.scripts = [];

        this.scripts.push(runAsAdministrator);
        this.scripts.push(installChocolatey);
    }

    addCommand(command) {
        this.commands.push(command);
        console.log(`Command added: ${command}`);
    }

    addEnvironment(value) {
        this.environment.push(value);
        console.log(`Environment added: ${value}`);
    }

    getScripts() {
        const paths = this.environment.map((e) => `"${e}"`).join(",\n    ");
        const env = `
$array = @(
    ${paths}
)
foreach ($path in $array) {
    \$InstallFolder = \$null
    \$InstallFolder = \$path

    try {
        \$registryKey = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey('Environment', \$false)
        \$originalPath = \$registryKey.GetValue(
            'PATH',
            '',
            [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames
        )
        \$pathParts = \$originalPath -split ';'

        if (!(\$pathParts -contains \$InstallFolder)) {
            Write-Host "Adding \$InstallFolder to PATH"

            [Environment]::SetEnvironmentVariable(
                'PATH',
                "\$originalPath;\$InstallFolder",
                [EnvironmentVariableTarget]::User
            )

            # Also add the path to the current session
            \$env:PATH += ";\$InstallFolder"
        }
        else {
            Write-Host "An entry for \$InstallFolder is already in PATH"
        }
    }
    finally {
        if (\$registryKey) {
            \$registryKey.Close()
        }
    }
}`.trim();
        this.scripts.push(env + "\n");
        this.scripts.push(this.commands.join("\n"));
        return this.scripts.toString().replace(/(^,)/gm, "") + "\n";
    }
}

export default PowerShell;
