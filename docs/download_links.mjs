import fs from 'fs';
import https from 'node:https';

function generateMarkdown({ beforeMarker, afterMarker, content }) {
    let readme = fs.readFileSync('README.md', 'utf8');
    let before = readme.substring(0, readme.indexOf(beforeMarker) + beforeMarker.length);
    let after = readme.substring(readme.indexOf(afterMarker));

    fs.writeFileSync('README.md', `${before}\n\n${content}\n${after}`);
}

const url = `https://api.github.com/repos/DinosauriaLab/npm-env-setup/releases/latest`;
const options = {
    headers: {
        'User-Agent': 'node.js',
    },
};

https
    .get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const release = JSON.parse(data);
            console.log(release);
            console.log(`Latest release: ${release.name}`);
            release.assets.forEach((asset) => {
                console.log(`Download URL: ${asset.browser_download_url}`);
                console.log(`Asset name: ${asset.name}`);
                if (asset.name.includes('env-setup-win-x64')) {
                    generateMarkdown({
                        beforeMarker: '<!-- WINDOWS_LINK_X64_START -->',
                        afterMarker: '<!-- WINDOWS_LINK_X64_END -->',
                        content: '```shell\n' + `powershell.exe -Command "Invoke-WebRequest -Uri "${asset.browser_download_url}" -OutFile "${asset.name}"; Start-Process "${asset.name}" -Wait; Remove-Item "${asset.name}" -Force"` + '\n```',
                    });
                }
                if (asset.name.includes('env-setup-macos-x64')) {
                    generateMarkdown({
                        beforeMarker: '<!-- MACOS_LINK_X64_START -->',
                        afterMarker: '<!-- MACOS_LINK_X64_END -->',
                        content:
                            '```shell\n' +
                            `curl -L "${asset.browser_download_url}" -o "${asset.name}" && chmod +x "${asset.name}" && ./"${asset.name}" && rm -f "${asset.name}"
                        ` +
                            '\n```',
                    });
                }
                if (asset.name.includes('env-setup-macos-arm64')) {
                    generateMarkdown({
                        beforeMarker: '<!-- MACOS_LINK_ARM64_START -->',
                        afterMarker: '<!-- MACOS_LINK_ARM64_END -->',
                        content:
                            '```shell\n' +
                            `curl -L "${asset.browser_download_url}" -o "${asset.name}" && chmod +x "${asset.name}" && ./"${asset.name}" && rm -f "${asset.name}"
                        ` +
                            '\n```',
                    });
                }
                if (asset.name.includes('env-setup-linux-x64')) {
                    generateMarkdown({
                        beforeMarker: '<!-- LINUX_LINK_X64_START -->',
                        afterMarker: '<!-- LINUX_LINK_X64_END -->',
                        content:
                            '```shell\n' +
                            `curl -L "${asset.browser_download_url}" -o "${asset.name}" && chmod +x "${asset.name}" && ./"${asset.name}" && rm -f "${asset.name}"
                        ` +
                            '\n```',
                    });
                }
            });
        });
    })
    .on('error', (err) => {
        console.error('Error: ', err.message);
    });
