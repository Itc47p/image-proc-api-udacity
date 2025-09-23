import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

app.get("/api/placeholder", async (req, res) => {
    const width = parseInt(req.query.width as string) || 300;
    const height = parseInt(req.query.height as string) || 300;
    const color = req.query.color as string || 'grey';
    res.send('Server Online');

    const imgPLacholder = await sharp({
        create: {
            width: 300,
            height: 300,
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
    };
    const inputPath = path.join(__dirname, 'images', fileName);
    const outputPath = path.join(__dirname, 'images', 'resized', `${path.parse(fileName).name}_${widthParam}x${heightParam}${path.parse(fileName).ext}`);

    if (!fs.existsSync(inputPath)) {
        return res.status(404).send('File not found');
    }

    if (fs.existsSync(outputPath)) {
        return res.sendFile(outputPath);
    }

    try {
        await sharp(inputPath)
            .resize(widthParam, heightParam)
            .toFile(outputPath);
        res.sendFile(outputPath);
    } catch (error) {
        res.status(500).send('Error processing image');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);

});
const Greeting = "Hello User";


console.log(Greeting);