import {IDatabase} from "../models/IDatabase";
import express from "express";
import path from "path";

export function getCalculators(db: IDatabase) {
    return async function(_req: express.Request, res: express.Response) {
        const response = await db.getFormulas();
        res.status(200).json(response);
    }
}

export function addCalculator(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const {name, version, formula} = req.body
        console.log(name)
        if (!name || !version || !formula) {
            res.status(400).json("Invalid request")
        } else {
            await db.addFormula({name: name as string, version: version as string, formula: formula as string})
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