import {IDatabase} from "../models/IDatabase";
import express from "express";
import path from "path";

export function getCalculator(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const {name, version} = req.query as {name?: string, version?: string}
        console.log(name, version)
        const response = await db.getCalculator(name, version)
        res.status(200).json(response);
    }
}

export function addCalculator(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const {name, version, formula} = req.body
        if (!name || !version || !formula) {
            res.status(400).json("Invalid request")
        } else {
            await db.addCalculator({name: name as string, version: version as string, formula: formula as string})
            res.status(201).send()
        }
    }
}



export function reactApp(staticFilesPath: string) {
    return async function(_req: express.Request, res: express.Response) {
        res.sendFile(path.join(staticFilesPath, 'index.html'));
    }
}

export function cors() {
    return function(_req: express.Request, res: express.Response, next: express.NextFunction) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    }
}