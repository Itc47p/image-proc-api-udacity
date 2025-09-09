import express from "express";

const app = express();
const port = 3000;
app.get("/api", (req, res) => {
    res.send('Server Online');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
const Greeting = "Hello User";

console.log(Greeting);