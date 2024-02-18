import {IDatabase} from "../models/IDatabase";

export interface Configuration {
    database: IDatabase
    httpPort: string | number
    staticFilesPath: string
}