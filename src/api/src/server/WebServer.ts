import express, {Express} from "express";
import {
    addCalculator, calculateResult,
    cors,
    getCalculatorSchema,
    getCalculatorsInfo,
    getCalculatorTree,
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
            .post('/api/v0/addCalculator', addCalculator(this.#config.database, this.#config.auth))
            .post('/api/v0/calculate', calculateResult(this.#config.database))
        this.app.use(router)
    }

    #startHTTP() {
        this.#httpServer = this.app.listen(this.#config.httpPort, () => {
            console.log(`Server is running at http://localhost:${this.#config.httpPort}`)
        })
    }

}