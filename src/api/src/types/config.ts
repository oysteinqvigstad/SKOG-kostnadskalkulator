import {IDatabase} from "../models/IDatabase";

export interface Configuration {
    database: IDatabase
    httpPort: string | number
    staticFilesPath: string
}

export interface FirestoreConfiguration {
    projectId: string | undefined;
}
