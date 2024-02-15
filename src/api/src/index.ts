// src/index.js
import express, { Express} from "express";
import dotenv from "dotenv";
import path from "path";
import {Configuration} from "./types/Configuration";
import {FirestoreDatabase} from "./database/FirestoreDatabase";
import {Formula} from "./types/Formula";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;



let config: Configuration = {
        database: new FirestoreDatabase({projectId: process.env.GCLOUD_PROJECT})
}

const formula: Formula = {
    name: "Quadratic Formula",
    version: "1.0.0",
    formula: "x^2 + 2x + 1"
}
config.database.addFormula(formula).catch(console.error);



// WARNING: Google App Engine has been configured to use a frontend/middleware handler for
// the static files for faster processing. No request will actually reach the handler
// that is defined below, on the production PaaS server.
const reactDirectory = path.join(__dirname, '..', '..', '..', 'client', 'build');
app.use(express.static(reactDirectory));
app.get('*', (_, res) => {
    res.sendFile(path.join(reactDirectory, 'index.html'));
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});