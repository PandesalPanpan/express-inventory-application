import express from 'express';
import path from 'node:path';
import { exit } from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, "public");

const PORT = 3000;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended:true }));

app.use('/', (req, res) => {
    res.send("Hello World");
})


app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        exit(1);
    }

    console.log(`Express running on port ${PORT}.`);
})


