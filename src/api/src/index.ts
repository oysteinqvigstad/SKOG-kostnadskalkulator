// src/index.js
import express, { Express} from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, '..', '..', '..', 'client', 'build')));
// console.log(__dirname)


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});