import fs from 'fs';
import https from 'node:https';

// 生成 Markdown 內容並更新 README.md 檔案
function generateMarkdown({ beforeMarker, afterMarker, content }) {
    let readme = fs.readFileSync('README.md', 'utf8');
    let before = readme.substring(0, readme.indexOf(beforeMarker) + beforeMarker.length);
    let after = readme.substring(readme.indexOf(afterMarker));

    fs.writeFileSync('README.md', `${before}\n${content}\n${after}`);
}

// 根據資產名稱和下載 URL 生成對應的 shell 命令
function generateShellCommand(asset) {
    if (asset.name.includes('win-x64')) {
        return `powershell.exe -Command "Invoke-WebRequest -Uri "${asset.browser_download_url}" -OutFile "${asset.name}"; Start-Process "${asset.name}" -Wait; Remove-Item "${asset.name}" -Force"`;
    } else {
        return `curl -L "${asset.browser_download_url}" -o ${asset.name} && chmod +x ${asset.name} && ./${asset.name} && rm -f ${asset.name}`;
    }
}

// 根據資產名稱選擇對應的標記
function selectMarkers(asset) {
    if (asset.name.includes('env-setup-win-x64')) {
        return { beforeMarker: '<!-- WINDOWS_LINK_X64_START -->', afterMarker: '<!-- WINDOWS_LINK_X64_END -->' };
    } else if (asset.name.includes('env-setup-macos-x64')) {
        return { beforeMarker: '<!-- MACOS_LINK_X64_START -->', afterMarker: '<!-- MACOS_LINK_X64_END -->' };
    } else if (asset.name.includes('env-setup-macos-arm64')) {
        return { beforeMarker: '<!-- MACOS_LINK_ARM64_START -->', afterMarker: '<!-- MACOS_LINK_ARM64_END -->' };
    } else if (asset.name.includes('env-setup-linux-x64')) {
        return { beforeMarker: '<!-- LINUX_LINK_X64_START -->', afterMarker: '<!-- LINUX_LINK_X64_END -->' };
    }
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
                const shellCommand = generateShellCommand(asset);
                const { beforeMarker, afterMarker } = selectMarkers(asset);
                if (beforeMarker && afterMarker) {
                    generateMarkdown({
                        beforeMarker,
                        afterMarker,
                        content: '```shell\n' + shellCommand + '\n```',
                    });
                }
            });
        });
    })
    .on('error', (err) => {
        console.error('Error: ', err.message);
    });
