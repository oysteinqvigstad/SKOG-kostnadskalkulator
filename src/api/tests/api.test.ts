import WebServer from "../src/server/WebServer";
import {MockDatabase} from "../src/database/MockDatabase";
import request from 'supertest'
import {testTree, treeStateFromData} from "@skogkalk/common/dist/src/parseTree";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";
import {Configuration} from "../src/types/config";
import {MockAuth} from "../src/auth/MockAuth";

let server: WebServer
let calculator: Calculator

beforeAll(() => {
    calculator = {
        name: "testMy",
        version: 1,
        dateCreated: Date.now(),
        published: false,
        deleted: false,
        disabled: false,
        reteSchema: {
            graph: "test",
            store: "test",
        },
        treeNodes: treeStateFromData(testTree).subTrees
    }
    const config: Configuration = {
        database: new MockDatabase(),
        auth: new MockAuth(),
        httpPort: 4000,
    }
    server = new WebServer(config).run()
})

afterAll(() => {
    server.stop()
})



describe('api calculator', () => {
    test('POST /api/v1/addCalculator', async () => {
        await request(server.app)
            .post('/api/v1/addCalculator')
            .set('Authorization', 'Bearer test_token')
            .send(calculator)
            .expect(200)
    })

    test('POST /api/v1/addCalculator (no authorization header)', async () => {
        await request(server.app)
            .post('/api/v1/addCalculator')
            .send(calculator)
            .expect(401)
    })

    test('POST /api/v1/addCalculator (no authorization Bearer)', async () => {
        await request(server.app)
            .post('/api/v1/addCalculator')
            .set('Authorization', '')
            .send(calculator)
            .expect(401)
    })

    test('POST /api/v1/addCalculator (empty authorization Bearer)', async () => {
        await request(server.app)
            .post('/api/v1/addCalculator')
            .set('Authorization', 'Bearer ')
            .send(calculator)
            .expect(401)
    })

    test('GET /api/v1/getCalculatorsInfo', async () => {
        const {reteSchema, treeNodes, ...rest} = calculator
        await request(server.app)
            .get('/api/v1/getCalculatorsInfo')
            .expect(200, [rest])
            .expect('Content-Type', /json/)
    })

    test('GET /api/v1/getCalculatorTree?name=testMy (no version)', async () => {
        await request(server.app)
            .get('/api/v1/getCalculatorTree?name=testMy')
            .expect(400)
    })

    test('GET /api/v1/getCalculatorTree?name=testMy&version=1', async () => {
        const {treeNodes} = calculator
        await request(server.app)
            .get('/api/v1/getCalculatorTree?name=testMy&version=1')
            .expect(200, treeNodes)
    })

    test('GET /api/v1/getCalculatorSchema?name=testMy&version=1', async () => {
        const {reteSchema} = calculator
        await request(server.app)
            .get('/api/v1/getCalculatorSchema?name=testMy&version=1')
            .expect(200, reteSchema)
    })
})

describe('api calculate', () => {
    test('POST /api/v1/calculate (missing payload)', async () => {
        await request(server.app)
            .post('/api/v1/calculate')
            .send()
            .expect(400)
    })

    test('POST /api/v1/calculate (missing name)', async () => {
        await request(server.app)
            .post('/api/v1/calculate')
            .send({version: 1, mode: 'strict', inputs: {}})
            .expect(400)
    })

    test('POST /api/v1/calculate (missing version)', async () => {
        await request(server.app)
            .post('/api/v1/calculate')
            .send({name: "testMy", mode: 'strict', inputs: {}})
            .expect(400)
    })


    test('POST /api/v1/calculate (missing mode)', async () => {
        await request(server.app)
            .post('/api/v1/calculate')
            .send({name: "testMy", version: 1, inputs: {}})
            .expect(400)
    })

    test('POST /api/v1/calculate (invalid mode)', async () => {
        await request(server.app)
            .post('/api/v1/calculate')
            .send({name: "testMy", version: 1, mode: "", inputs: {}})
            .expect(400)
    })

    test('POST /api/v1/calculate (relaxed mode, no changes)', async () => {
        await request(server.app)
            .post('/api/v1/calculate')
            .send({name: "testMy", version: 1, mode: "relaxed", inputs: {}})
            .expect(200)
            .then(response => {
                console.log(response.body)
                expect(response.body['Omkrets'][1].value).toEqual(4)
            })
    })

    test('POST /api/v1/calculate (relaxed mode, one input change)', async () => {
        const inputs = {
            "Rektangel": {
                "bredde": 2
            }
        }
        await request(server.app)
            .post('/api/v1/calculate')
            .send({name: "testMy", version: 1, mode: "relaxed", inputs: inputs})
            .expect(200)
            .then(response => {
                expect(response.body['Omkrets'][1].value).toEqual(6)
            })
    })


    test('POST /api/v1/calculate (strict mode, no changes)', async () => {
        await request(server.app)
            .post('/api/v1/calculate')
            .send({name: "testMy", version: 1, mode: "strict", inputs: {}})
            .expect(400)
    })

    test('POST /api/v1/calculate (strict mode, all changes)', async () => {
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
            .post('/api/v1/calculate')
            .send({name: "testMy", version: 1, mode: "strict", inputs: inputs})
            .expect(200)
            .then(response => {
                expect(response.body['Omkrets'][1].value).toEqual(10)
            })
    })
})
