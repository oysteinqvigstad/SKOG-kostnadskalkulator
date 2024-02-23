import WebServer from "../src/server/WebServer";
import {IDatabase} from "../src/models/IDatabase";
import {Configuration} from "../src/types/Configuration";
import {MockDatabase} from "../src/database/MockDatabase";
import request from 'supertest'
import path from "path";
import {Formula} from "@skogkalk/common/dist/src/types/Formula";

let server: WebServer
let database: IDatabase

beforeAll(() => {
    database = new MockDatabase()
    const config: Configuration = {
        database: database,
        httpPort: 4000,
        staticFilesPath: path.join(__dirname, '..', '..', 'client', 'build')
    }
    server = new WebServer(config)
    server.run()
})

afterAll(() => {
    server.stop()
})

describe('serve static files', () => {
    test('GET /', async () => {
        await request(server.app)
            .get('/')
            .expect(200)
            .then(response => {
                expect(response.text).toContain('<!doctype html>')
            })
    })

    test('GET /random-urls-to-react-dom-router', async () => {
        await request(server.app)
            .get('/')
            .expect(200)
            .then(response => {
                expect(response.text).toContain('<!doctype html>')
            })
    })
})

describe('api formulas', () => {
    test('GET /api/v0/getCalculator', async () => {
        const formula: Formula = {
            name: "Quadratic Formula",
            version: "1.0.0",
            formula: "x^2 + 2x + 1"
        }
        await database.addCalculator(formula)
        await request(server.app)
            .get('/api/v0/getCalculator')
            .expect('Content-Type', /json/)
            .expect(200, [formula])
    })

    test('GET /api/v0/getCalculator?name=mycalc', async () => {
        const formulas: Formula[] = [
            {
            name: "mycalculator",
            version: "1.0.0",
            formula: "x^2 + 2x + 1"
            },
            {
            name: "mycalc",
            version: "1.0.1",
            formula: "x^2 + 2x + 1"
            }
        ]

        await database.addCalculator(formulas[0])
        await database.addCalculator(formulas[1])

        await request(server.app)
            .get('/api/v0/getCalculator?name=mycalc')
            .expect('Content-Type', /json/)
            .expect(200, [formulas[1]])
    })

    test('POST /api/v0/addCalculator', async () => {
        const formula: Formula = {
            name: "Quadratic Formula",
            version: "1.0.0",
            formula: "x^2 + 2x + 1"
        }
        await request(server.app)
            .post('/api/v0/addCalculator')
            .send(formula)
            .expect(201)
    })

    test('POST /api/v0/addCalculator (missing field)', async () => {
        const formula = {
            name: "Quadratic Formula",
            formula: "x^2 + 2x + 1"
        }
        await request(server.app)
            .post('/api/v0/addCalculator')
            .send(formula)
            .expect(400)
    })
})
