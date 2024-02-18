import dotenv from "dotenv";
import {Configuration} from "./types/Configuration";
import {FirestoreDatabase} from "./database/FirestoreDatabase";
import WebServer from "./server/WebServer";
import path from "path";

dotenv.config();

const reactDir = path.join(__dirname, '..', '..', 'client', 'build');

const config: Configuration = {
    database: new FirestoreDatabase({projectId: process.env.GCLOUD_PROJECT}),
    httpPort: process.env.PORT || 80,
    staticFilesPath: reactDir
}

new WebServer(config).run()