import WebServer from "../src/server/WebServer";
import {IDatabase} from "../src/models/IDatabase";
import {Configuration} from "../src/types/Configuration";
import {MockDatabase} from "../src/database/MockDatabase";
import request from 'supertest'
import path from "path";
import {testTree, TreeState, treeStateFromData} from "@skogkalk/common/dist/src/parseTree";

let server: WebServer
let database: IDatabase
let calculator: TreeState

beforeAll(() => {
    database = new MockDatabase()
    calculator = treeStateFromData(testTree) as TreeState
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
        await database.addCalculator(calculator)
        await request(server.app)
            .get('/api/v0/getCalculator')
            .expect('Content-Type', /json/)
            .expect(200, [calculator])
    })

    test('GET /api/v0/getCalculator?name=mycalc', async () => {
        const anotherCalculator = treeStateFromData(testTree)
        anotherCalculator.rootNode.formulaName = 'mycalc'
        await database.addCalculator(anotherCalculator)

        await request(server.app)
            .get('/api/v0/getCalculator?name=mycalc')
            .expect('Content-Type', /json/)
            .expect(200, [anotherCalculator])
    })

    test('POST /api/v0/addCalculator (same version)', async () => {
        await request(server.app)
            .post('/api/v0/addCalculator')
            .send(calculator)
            .expect(409)
    })

    test('POST /api/v0/addCalculator (different version)', async () => {
        const anotherCalculator = treeStateFromData(testTree)
        anotherCalculator.rootNode.version = 5

        await request(server.app)
            .post('/api/v0/addCalculator')
            .send(anotherCalculator)
            .expect(201)
    })
})
