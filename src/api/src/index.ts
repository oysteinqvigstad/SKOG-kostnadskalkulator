import dotenv from "dotenv";
import {FirestoreDatabase} from "./database/FirestoreDatabase";
import WebServer from "./server/WebServer";
import path from "path";
import {Configuration} from "./types/config";
import {FirebaseAuth} from "./auth/FirebaseAuth";

dotenv.config();

const reactDir = path.join(__dirname, '..', '..', 'client', 'build');

const config: Configuration = {
    database: new FirestoreDatabase({projectId: process.env.GCLOUD_PROJECT}),
    auth: new FirebaseAuth(),
    httpPort: process.env.PORT || 80,
    staticFilesPath: reactDir
}

new WebServer(config).run()