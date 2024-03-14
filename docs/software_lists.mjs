import fs from 'fs';
import { CliPrettify } from 'markdown-table-prettify';

function generateMarkdownForOS({ osType, beforeMarker = '<!-- WINDOWS_LISTS_START -->', afterMarker = '<!-- WINDOWS_LISTS_END -->' }) {
    const data = fs.readFileSync('packageData.json', 'utf8');
    const packagesData = JSON.parse(data);
    let markdownTable = ['| Package | Description | Default |', '| ------- | ----------- | ------- |'];

    Object.entries(packagesData).forEach(([category, packages]) => {
        Object.entries(packages)
            .filter(([_, packageDetails]) => packageDetails.install[osType] !== '')
            .forEach(([packageName, packageDetails]) => {
                const description = packageDetails.description.trim() !== '' ? packageDetails.description : '-';
                let type = packageDetails.type.trim();
                if (type === 'force') {
                    type = '`force`';
                } else if (type === 'enable') {
                    type = '**enable**';
                } else {
                    type = packageDetails.type;
                }
                markdownTable.push(`| ${packageName} | ${description} | ${type} |`);
            });
    });

    let markdown = markdownTable.join('\n');
    markdown = CliPrettify.prettify(markdown);

    let readme = fs.readFileSync('README.md', 'utf8');
    let before = readme.substring(0, readme.indexOf(beforeMarker) + beforeMarker.length);
    let after = readme.substring(readme.indexOf(afterMarker));

    fs.writeFileSync('README.md', `${before}\n\n${markdown}\n${after}`);
}

generateMarkdownForOS({
    osType: 'windows',
    beforeMarker: '<!-- WINDOWS_LISTS_START -->',
    afterMarker: '<!-- WINDOWS_LISTS_END -->',
});

generateMarkdownForOS({
    osType: 'mac',
    beforeMarker: '<!-- MACOS_LISTS_START -->',
    afterMarker: '<!-- MACOS_LISTS_END -->',
});

generateMarkdownForOS({
    osType: 'linux',
    beforeMarker: '<!-- LINUX_LISTS_START -->',
    afterMarker: '<!-- LINUX_LISTS_END -->',
});
