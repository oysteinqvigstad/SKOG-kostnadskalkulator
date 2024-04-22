import {FirestoreDatabase} from "./database/FirestoreDatabase";
import WebServer from "./server/WebServer";
import {Configuration} from "./types/config";
import {FirebaseAuth} from "./auth/FirebaseAuth";



const config: Configuration = {
    database: new FirestoreDatabase({projectId: process.env.GCLOUD_PROJECT}),
    auth: new FirebaseAuth(),
    httpPort: process.env.PORT || 80,
}

new WebServer(config).run()