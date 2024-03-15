import {IDatabase} from "../models/IDatabase";
import express from "express";
import path from "path";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";


/**
 * Adds a calculator to the database
 */
export function addCalculator(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const c: Calculator = req.body
        if (!c.reteSchema || !c.treeNodes) {
            return res.status(400).json({ error: "fields reteSchema and treeNodes are required" })
        } else if (!c.name || !c.version || isNaN(c.version)) {
            return res.status(400).json({ error: "fields name and version cannot be empty or zero" })
        }

        await handleDatabaseOperation(db.addCalculator(c), res)
    }
}

/**
 * Returns metainfo on all calculator versions in the database
 */
export function getCalculatorsInfo(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        await handleDatabaseOperation(db.getCalculatorsInfo(), res)
    }
}

/**
 * Returns the parse tree of a specific calculator version
 */
export function getCalculatorTree(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const queryParams = validateQueryNameAndVersion(req, res)
        if (!queryParams) return

        await handleDatabaseOperation(db.getCalculatorTree(queryParams.name, queryParams.version), res)
    }
}

/**
 * Returns the rete schema of a specific calculator version
 */
export function getCalculatorSchema(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const queryParams = validateQueryNameAndVersion(req, res)
        if (!queryParams) return

        await handleDatabaseOperation(db.getCalculatorSchema(queryParams.name, queryParams.version), res)
    }
}

/**
 * Serves the react app
 */
export function reactApp(staticFilesPath: string) {
    return async function(_req: express.Request, res: express.Response) {
        res.sendFile(path.join(staticFilesPath, 'index.html'));
    }
}

/**
 * Adds CORS headers to the response
 */
export function cors() {
    return function(_req: express.Request, res: express.Response, next: express.NextFunction) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    }
}

/**
 * Validates the query parameters for the getCalculatorTree and getCalculatorSchema endpoints
 */
function validateQueryNameAndVersion(req: express.Request, res: express.Response): {name: string, version: number} | null {
    const { name, version } = req.query as { name: string, version: string }
    if (!name || isNaN(parseInt(version))) {
        res.status(400).json({ error: "Name and version are required" }).send()
        return null
    }
    return { name, version: parseInt(version) };
}


/**
 * Wrapper function to handle the database operation and catch errors
 */
async function handleDatabaseOperation(operation: Promise<any>, res: express.Response) {
    try {
        const result = await operation;
        res.status(200).send(result);
    } catch (e) {
        switch ((e as Error).message) {
            case 'Calculator not found':
                res.status(404).json({ error: "Calculator not found" }).send(); break
            case 'Schema not found':
                res.status(404).json({ error: "Calculator Schema not found" }).send(); break
            case 'Tree not found':
                res.status(404).json({ error: "Calculator Tree not found" }).send(); break
            default:
                res.status(500).json({ error: "Database error" }).send()
        }
    }
}