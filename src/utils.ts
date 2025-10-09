import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function resizeImage(inputPath: string, outputPath: string, width: number, height: number): Promise<void> {
    await sharp(inputPath)
        .resize(width, height)
        .toFile(outputPath);
}

export function ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
