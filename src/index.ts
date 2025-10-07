import express from "express";
import sharp from "sharp";
import path from "path";
import { dirname } from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static('images'));

app.get("/api/placeholder", async (req, res) => {
    const width = parseInt(req.query.width as string) || 300;
    const height = parseInt(req.query.height as string) || 300;
    const color = req.query.color as string || 'grey';
    const isUpperCasedColor = /^[A-Z]{1,7}$/.test(color)

    if (color && isUpperCasedColor) {
        color.toLowerCase()
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

app.get("/api/action/resize", async (req, res) => {
    const fileName = req.query.fileName as string;
    const widthParam = parseInt(req.query.width as string);
    const heightParam = parseInt(req.query.height as string);

    if (!fileName || !widthParam || !heightParam) {
        return res.status(400).send('Missing required query parameters: fileName, width, height');
    }

    const projectRoot = path.resolve(__dirname, '..', '..');
    const inputPath = path.join(projectRoot, 'images', fileName);
    const outputDir = path.join(projectRoot, 'images', 'resized');
    const outputPath = path.join(outputDir, `${path.parse(fileName).name}_${widthParam}x${heightParam}${path.parse(fileName).ext}`);

    if (!fs.existsSync(inputPath)) {
        console.error("File not found:", inputPath);
        return res.status(404).send('File not found');
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // If resized image already exists, send it
    if (fs.existsSync(outputPath)) {
        return res.sendFile(outputPath);
    }

    try {
        await sharp(inputPath)
            .resize(widthParam, heightParam)
            .toFile(outputPath);
        if(res.statusCode === 200){
            console.info("Image resized successfully. Can be found here:", outputPath);
        }
        return res.sendFile(outputPath);
    } catch (error) {
        console.error("Error processing image:", error);
        return res.status(500).send('Error processing image');
    }
});

app.listen(port, () => {
    console.info(`Application is running at http://localhost:${port}`);

});
