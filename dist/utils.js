import sharp from 'sharp';
import fs from 'fs';
export async function resizeImage(inputPath, outputPath, width, height) {
    await sharp(inputPath)
        .resize(width, height)
        .toFile(outputPath);
}
export function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
//# sourceMappingURL=utils.js.map