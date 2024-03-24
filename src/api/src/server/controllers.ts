import {IDatabase} from "../models/IDatabase";
import express from "express";
import path from "path";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";
import {BadRequestError, DatabaseError, NotFoundError} from "../types/errorTypes";


/**
 * Adds a calculator to the database
 */
export function addCalculator(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const c: Calculator = req.body
        if (!c.reteSchema || !c.treeNodes) {
            console.log(c.treeNodes)
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
        const queryParams = validateGetCalculatorQueryNameAndVersion(req, res)
        if (!queryParams) return

        await handleDatabaseOperation(db.getCalculatorTree(queryParams.name, queryParams.version), res)
    }
}

/**
 * Returns the rete schema of a specific calculator version
 */
export function getCalculatorSchema(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const queryParams = validateGetCalculatorQueryNameAndVersion(req, res)
        if (!queryParams) return

        await handleDatabaseOperation(db.getCalculatorSchema(queryParams.name, queryParams.version), res)
    }
}

export function calculateResult(db: IDatabase) {
    return async function(req: express.Request, res: express.Response) {
        const {name, version, mode, inputs} = req.body as { name: string, version: number, mode: string, inputs: any }
        if (!name || !version || isNaN(version) || !mode || !['strict', 'relaxed'].includes(mode)) {
            return res.status(400).json({error: "Name, version and mode are required"})
        }

        handleDatabaseOperation(db.calculate(name, version, inputs, mode == 'strict'), res)
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
function validateGetCalculatorQueryNameAndVersion(req: express.Request, res: express.Response): {name: string, version: number} | null {
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
        if (e instanceof BadRequestError) {
            res.status(400).json({error: e.message}).send()
        } else if (e instanceof NotFoundError) {
            res.status(404).json({error: e.message}).send()
        } else if (e instanceof DatabaseError) {
            res.status(500).json({error: e.message}).send()
        } else {
            res.status(500).json({error: "An unexpected error occured while processing the request"}).send()
        }

    }
}