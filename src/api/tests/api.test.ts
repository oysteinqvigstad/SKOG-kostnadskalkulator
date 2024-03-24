import WebServer from "../src/server/WebServer";
import {IDatabase} from "../src/models/IDatabase";
import {MockDatabase} from "../src/database/MockDatabase";
import request from 'supertest'
import path from "path";
import {testTree, treeStateFromData} from "@skogkalk/common/dist/src/parseTree";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";
import {Configuration} from "../src/types/config";

let server: WebServer
let database: IDatabase
let calculator: Calculator

beforeAll(() => {
    database = new MockDatabase()
    calculator = {
        name: "testMy",
        version: 1,
        dateCreated: Date.now(),
        published: false,
        reteSchema: {
            graph: "test",
            store: "test",
        },
        treeNodes: treeStateFromData(testTree).subTrees
    }
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

describe('api calculator', () => {

    test('POST /api/v0/addCalculator', async () => {
        await request(server.app)
            .post('/api/v0/addCalculator')
            .send(calculator)
            .expect(200)
    })

    test('GET /api/v0/getCalculatorsInfo', async () => {
        const {reteSchema, treeNodes, ...rest} = calculator
        await request(server.app)
            .get('/api/v0/getCalculatorsInfo')
            .expect(200, [rest])
            .expect('Content-Type', /json/)
    })

    test('GET /api/v0/getCalculatorTree?name=testMy (no version)', async () => {
        await request(server.app)
            .get('/api/v0/getCalculatorTree?name=testMy')
            .expect(400)
    })

    test('GET /api/v0/getCalculatorTree?name=testMy&version=1', async () => {
        const {treeNodes} = calculator
        await request(server.app)
            .get('/api/v0/getCalculatorTree?name=testMy&version=1')
            .expect(200, treeNodes)
    })

    test('GET /api/v0/getCalculatorSchema?name=testMy&version=1', async () => {
        const {reteSchema} = calculator
        await request(server.app)
            .get('/api/v0/getCalculatorSchema?name=testMy&version=1')
            .expect(200, reteSchema)
    })
})

describe('api calculate', () => {
    test('post /api/v0/calculate (missing payload)', async () => {
        await request(server.app)
            .post('/api/v0/calculate')
            .send()
            .expect(400)
    })

    test('POST /api/v0/calculate (missing name)', async () => {
        await request(server.app)
            .post('/api/v0/calculate')
            .send({version: 1, mode: 'strict', inputs: {}})
            .expect(400)
    })

    test('POST /api/v0/calculate (missing version)', async () => {
        await request(server.app)
            .post('/api/v0/calculate')
            .send({name: "testMy", mode: 'strict', inputs: {}})
            .expect(400)
    })


    test('POST /api/v0/calculate (missing mode)', async () => {
        await request(server.app)
            .post('/api/v0/calculate')
            .send({name: "testMy", version: 1, inputs: {}})
            .expect(400)
    })

    test('POST /api/v0/calculate (invalid mode)', async () => {
        await request(server.app)
            .post('/api/v0/calculate')
            .send({name: "testMy", version: 1, mode: "", inputs: {}})
            .expect(400)
    })

    test('POST /api/v0/calculate (relaxed mode, no changes)', async () => {
        await request(server.app)
            .post('/api/v0/calculate')
            .send({name: "testMy", version: 1, mode: "relaxed", inputs: {}})
            .expect(200)
            .then(response => {
                console.log(response.body)
                expect(response.body['Omkrets'][1].value).toEqual(4)
            })
    })

    test('POST /api/v0/calculate (relaxed mode, one input change)', async () => {
        const inputs = {
            "Rektangel": {
                "bredde": 2
            }
        }
        await request(server.app)
            .post('/api/v0/calculate')
            .send({name: "testMy", version: 1, mode: "relaxed", inputs: inputs})
            .expect(200)
            .then(response => {
                expect(response.body['Omkrets'][1].value).toEqual(6)
            })
    })


    test('POST /api/v0/calculate (strict mode, no changes)', async () => {
        await request(server.app)
            .post('/api/v0/calculate')
            .send({name: "testMy", version: 1, mode: "strict", inputs: {}})
            .expect(400)
    })

    test('POST /api/v0/calculate (strict mode, all changes)', async () => {
        const inputs = {
            "Rektangel": {
                "bredde": 2,
                "høyde": 3
            },
            "Sirkel": {
                "radius": 4
            },
            "Enhet": {
                "enhet": "m"
            }
        }
        await request(server.app)
            .post('/api/v0/calculate')
            .send({name: "testMy", version: 1, mode: "strict", inputs: inputs})
            .expect(200)
            .then(response => {
                expect(response.body['Omkrets'][1].value).toEqual(10)
            })
    })
})
