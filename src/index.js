// index.js

import os from "os";
import cmd from "./cmdProcess.js";
import { selectPackages } from "./packageSelector.js";
import PowerShell from "./powershell.js";

selectPackages()
    .then((selectedPackages) => {
        if (selectedPackages.some((p) => p && p.packageName === "Visual Studio 2022 Community")) {
            selectedPackages.push({
                packageName: "vs2022-codemaid",
                installCommand: "choco install vs2022-codemaid -y",
            });
        }

        let command = "";
        let args = [];
        if (os.platform() === "win32") {
            const ps = new PowerShell();
            ps.addEnvironment("$HOME\\AppData\\Roaming\\Python\\Scripts"); // for python
            ps.addEnvironment("$HOME\\leoli\\.cargo\\bin"); // for rust
            if (selectedPackages.some((p) => p && p.packageName === "Prince")) {
                ps.addEnvironment("'C:\\Program Files (x86)\\Prince\\Engine\\bin'");
            }

            for (const p of selectedPackages) {
                if (p) {
                    ps.addCommand(p.installCommand);
                }
            }

            ps.addCommand("python.exe -m pip install --upgrade pip"); // for pip
            ps.addCommand("(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -"); // for poetry
            ps.addCommand("poetry config virtualenvs.in-project true"); // for poetry

            ps.addCommand("npm install -g npm"); // for npm
            ps.addCommand("npm install -g pnpm"); // for pnpm
            ps.addCommand("npm install -g npm-check-updates"); // for npm-check-updates

            if (selectedPackages.some((p) => p && p.packageName.startsWith("Sublime Text"))) {
                const sublimeSettings = `
$targets = @(
    "$env:APPDATA\\Sublime Text\\Packages\\User\\Preferences.sublime-settings"
)

$configContent = @"
{
    \\"hot_exit\\": false,
    \\"remember_open_files\\": false,
    \\"font_face\\": \\"fira code\\",
    \\"font_options\\": [\\"ss01\\", \\"ss02\\", \\"ss03\\", \\"ss04\\", \\"ss05\\", \\"ss06\\", \\"ss07\\"]
}
"@

foreach ($target in $targets) {
    Write-Host "Writing Sublime Text settings to $target"
    $dir = Split-Path $target
    mkdir $dir -Force
    $configContent | Out-File -FilePath $target -Encoding utf8 -Force
}
`.trim();
                ps.addCommand(sublimeSettings);
            }

            ps.addCommand("refreshenv"); // for powershell to refresh environment variables

            const psScript = ps.getScripts();
            const encodedPsScript = Buffer.from(psScript).toString("base64");
            command = "powershell.exe";
            args = ["-NoProfile", "-EncodedCommand", encodedPsScript];
        } else if (os.platform() === "darwin") {
        } else if (os.platform() === "linux") {
            const distro = os
                .release()
                .split(".")
                .map((v) => parseInt(v));
            console.log("Linux distribution version:", distro);
            if (distro[0] === 20 && distro[1] === 4) {
                console.log("Ubuntu 20.04 detected");
            } else {
                console.log("Ubuntu 20.04 not detected");
            }
        }

        if (selectedPackages.some((p) => p && p.packageName === "Git")) {
            scripts += `npm install -g @leoli0605/git-setup\n`;
            scripts += `npx @leoli0605/git-setup\n`;
            scripts += `git --no-pager config --global -l\n`;
        }

        console.log(`command: ${command}`);
        console.log(`args: ${args}`);
        // cmd(command, args)
        //     .then(() => {
        //         console.log("Success executing scripts");
        //     })
        //     .catch((error) => {
        //         console.error("Error executing scripts:", error);
        //     });
    })
    .catch((error) => {
        console.error("Error selecting packages:", error);
    });
