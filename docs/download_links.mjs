import fetch from 'node-fetch';
import fs from 'fs';

function generateMarkdown({ beforeMarker, afterMarker, content }) {
    let readme = fs.readFileSync('README.md', 'utf8');
    let before = readme.substring(0, readme.indexOf(beforeMarker) + beforeMarker.length);
    let after = readme.substring(readme.indexOf(afterMarker));
    fs.writeFileSync('README.md', `${before}\n${content}\n${after}`);
}

function generateShellCommand(asset) {
    if (asset.name.includes('win-x64')) {
        return `powershell.exe -Command "Invoke-WebRequest -Uri ${asset.browser_download_url} -OutFile ${asset.name}; Start-Process ${asset.name} -Wait; Remove-Item ${asset.name} -Force"`;
    } else {
        return `curl -L ${asset.browser_download_url} -o ${asset.name} && chmod +x ${asset.name} && ./${asset.name} && rm -f ${asset.name}`;
    }
}

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

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000;

async function fetchReleaseData(retryCount = 0) {
    const url = `https://api.github.com/repos/leoli0605/npm-env-setup/releases/latest`;
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'node.js',
            },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const release = await response.json();
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
    } catch (error) {
        console.error('Error fetching release data: ', error.message);
        if (retryCount < MAX_RETRIES) {
            console.log(`Retry ${retryCount + 1}/${MAX_RETRIES} after ${RETRY_DELAY}ms...`);
            setTimeout(() => fetchReleaseData(retryCount + 1), RETRY_DELAY);
        } else {
            console.log('Max retries reached. Giving up.');
        }
    }
}

fetchReleaseData();
