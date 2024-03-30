import {IDatabase} from "../models/IDatabase";
import {IAuth} from "../models/IAuth";

export interface Configuration {
    database: IDatabase
    auth: IAuth
    httpPort: string | number
    staticFilesPath: string
}

export interface FirestoreConfiguration {
    projectId: string | undefined;
}
