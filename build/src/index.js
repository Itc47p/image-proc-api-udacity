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
console.log("DIRNAME:", __dirname);
app.use(express.static('images'));
app.get("/api/placeholder", async (req, res) => {
    const width = parseInt(req.query.width) || 300;
    const height = parseInt(req.query.height) || 300;
    const color = req.query.color || 'grey';
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
app.get("/api/action/resize", async (req, res) => {
    const fileName = req.query.fileName;
    const widthParam = parseInt(req.query.width);
    const heightParam = parseInt(req.query.height);
    // console.log("CALLING RESIZE API W THESE PARAMS:", fileName, widthParam, heightParam);
    if (!fileName || !widthParam || !heightParam) {
        return res.status(400).send('Missing required query parameters: fileName, width, height');
    }
    const inputPath = path.join(__dirname, 'images', fileName);
    const outputDir = path.join(__dirname, 'images', 'resized');
    const outputPath = path.join(outputDir, `${path.parse(fileName).name}_${widthParam}x${heightParam}${path.parse(fileName).ext}`);
    console.log("INPUT PATH:", inputPath);
    console.log("OUTPUT PATH:", outputPath);
    if (!fs.existsSync(inputPath)) {
        return res.status(404).send('File not found');
    }
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    if (fs.existsSync(outputPath)) {
        return res.sendFile(outputPath);
    }
    try {
        await sharp(inputPath)
            .resize(widthParam, heightParam)
            .toFile(outputPath);
        res.sendFile(outputPath);
    }
    catch (error) {
        console.error("Error processing image:", error);
        res.status(500).send('Error processing image');
    }
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map