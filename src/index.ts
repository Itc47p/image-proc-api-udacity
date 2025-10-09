import express from 'express';
import type { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ensureDirectoryExists, resizeImage } from './utils.js';

const app = express();
export default app;
const port = 3000;
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
app.use(express.static('images'));

app.get('/api/placeholder', async (req: Request, res: Response) => {
    const width: number = parseInt(req.query.width as string) || 300;
    const height: number = parseInt(req.query.height as string) || 300;
    const color: string = req.query.color as string || 'grey';
    const isUpperCasedColor = /^[A-Z]{1,7}$/.test(color);

    if (color && isUpperCasedColor) {
        color.toLowerCase();
    }
    const imgPLacholder = await sharp({
        create: {
            width: width,
            height: height,
            channels: 4,
            background: color
        }
    })
        .png()
        .toBuffer();

    res.set('Content-Type', 'image/png');
    res.send(imgPLacholder);
});

app.get('/api/action/resize', async (req: Request, res: Response) => {
    const fileName: string = req.query.fileName as string;
    const widthParam: number = parseInt(req.query.width as string);
    const heightParam: number = parseInt(req.query.height as string);

    if (!fileName || !widthParam || !heightParam) {
        return res.status(400).send('Missing required query parameters: fileName, width, height');
    }

    const projectRoot: string = path.resolve(__dirname, '..');
    const inputPath: string = path.join(projectRoot, 'images', fileName);
    const outputDir: string = path.join(projectRoot, 'images', 'resized');
    const outputPath: string = path.join(outputDir, `${path.parse(fileName).name}_${widthParam}x${heightParam}${path.parse(fileName).ext}`);

    if (!fs.existsSync(inputPath)) {
        console.error('File not found:', inputPath);
        return res.status(404).send('File not found');
    }

    ensureDirectoryExists(outputDir);

    if (fs.existsSync(outputPath)) {
        return res.sendFile(outputPath);
    }

    try {
        await resizeImage(inputPath, outputPath, widthParam, heightParam);
        if (res.statusCode === 200) {
            console.info('Image resized successfully. Can be found here:', outputPath);
        }
        return res.sendFile(outputPath);
    } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).send('Error processing image');
    }
});

app.listen(port, () => {
    console.info(`Application is running at http://localhost:${port}`);

});
