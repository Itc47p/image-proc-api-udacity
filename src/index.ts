import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;
app.get("/api/placeholder", (req, res) => {
    const width = parseInt(req.query.width as string) || 300;
    const height = parseInt(req.query.height as string) || 300;
    const color = req.query.color as string || 'grey';
    res.send('Server Online');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
const Greeting = "Hello User";
const imgPLacholder = await sharp({
    create: {
        width: 300,
        height: 300,
        channels: 4,
        background: this.color
    }
    })

console.log(Greeting);