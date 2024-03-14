import fs from 'fs';

export function dedupeFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const uniqueData = [...new Set(data.split('\n'))].join('\n');
        // console.log(uniqueData);
        fs.writeFileSync(filePath, uniqueData, 'utf8');
    } catch (err) {
        console.error(`Error deduping file: ${filePath}`, err);
    }
}
