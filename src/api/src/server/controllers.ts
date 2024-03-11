import {IDatabase} from "../models/IDatabase";
import express from "express";
import path from "path";
import {TreeState} from "@skogkalk/common/dist/src/parseTree";

export function getCalculator(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        // parse the query
        const {name, version} = req.query as {name?: string, version?: string}
        let response: TreeState[] = []

        // fetch the data
        try {
            response = name ? await db.getCalculatorByName(name, version ? parseInt(version) : undefined)
                            : await db.getCalculatorsLatest()
        } catch (e) {
            return res.status(500).json({ error: 'An error occurred while fetching the calculator data' })
        }

        if (response.length) {
            res.status(200).json(response)
        } else {
            return res.status(404).json({ error: "Calculator not found" })
        }
    }
}

export function addCalculator(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        let data: TreeState
        try {
            data = req.body as TreeState
        } catch (e) {
            return res.status(400).json("Invalid JSON")
        }

        let existing: TreeState[] | undefined = undefined
        try {
            existing = await db.getCalculatorByName(data.rootNode.formulaName, data.rootNode.version)
        } catch (e) {
            return res.status(500).json({ error: "An error occurred while adding the calculator" })
        }

        if (!existing.length) {
            await db.addCalculator(data)
                .then(() => res.status(201).send())
                .catch(() => res.status(500).json({ error: "An error occurred while adding the calculator" }).send())
        } else {
            return res.status(409).json({ error: "Calculator already exists"} )
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

export function calculate(_db: IDatabase) {
    return async function(req: express.Request, _res: express.Response) {
        const queries = Object.entries(req.query) as [string, string][]
        const _numberedList = queries
            .map(([key, value]) => [key, value?.split(',').map(parseFloat) ?? []])

    }

}