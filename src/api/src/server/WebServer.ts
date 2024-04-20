import express, {Express} from "express";
import {
    addCalculator, calculateResult,
    cors,
    getCalculatorSchema,
    getCalculatorsInfo,
    getCalculatorTree,
    reactApp
} from "./controllers";
import * as http from "http";
import {Configuration} from "../types/config";

export default class WebServer {
    #config: Configuration
    app: Express    // must be exposed for the testing framework
    #httpServer: http.Server | undefined

    constructor(config: Configuration) {
        this.#config = config
        this.app = express()
        this.#initRouting()
    }

    run() {
        this.#startHTTP()
        return this
    }

    stop() {
        this.#httpServer?.close()
    }

    #initRouting() {
        let router = express.Router()
            .use(express.json())
            .use(cors()) // temprory during development to allow CORS
            .get('/api/v0/getCalculatorsInfo', getCalculatorsInfo(this.#config.database))
            .get('/api/v0/getCalculatorTree', getCalculatorTree(this.#config.database))
            .get('/api/v0/getCalculatorSchema', getCalculatorSchema(this.#config.database))
            .get('*', reactApp(this.#config.staticFilesPath))
            .post('/api/v0/addCalculator', addCalculator(this.#config.database, this.#config.auth))
            .post('/api/v0/calculate', calculateResult(this.#config.database))

        // TODO: Remove this after implementing a proper way to add calculators in admin console
        // const c: Calculator = {
        //         name: "Kostnadskalkulator",
        //         version: 11,
        //         dateCreated: Date.now(),
        //         published: true,
        //         reteSchema: "test",
        //         treeNodes: treeStateFromData(testTree).subTrees
        //     }
        // this.#config.database.addCalculator(c)
        //     .then(() => console.log('Added test calculator'))
        //     .catch(err => console.error('Error adding test calculator', err))

        this.app.use(router)
    }

    #startHTTP() {
        this.#httpServer = this.app.listen(this.#config.httpPort, () => {
            console.log(`Server is running at http://localhost:${this.#config.httpPort}`)
        })
    }

}