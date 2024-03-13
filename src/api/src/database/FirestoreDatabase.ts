import FirebaseFirestore, {Query} from "@google-cloud/firestore";
import {IDatabase} from "../models/IDatabase";
import {FirestoreConfiguration} from "../types/FirestoreConfiguration";
import {TreeState} from "@skogkalk/common/dist/src/parseTree";

export class FirestoreDatabase implements IDatabase {
    #db: FirebaseFirestore.Firestore

    constructor(config: FirestoreConfiguration) {
        this.#db = new FirebaseFirestore.Firestore({
            projectId: config.projectId
        })

        if (process.env.NODE_ENV !== 'production') {
            this.#db.settings({
                host: 'localhost:8080',
                ssl: false
            })
        }
    }

    async addCalculator(calculator: TreeState): Promise<void> {
        const ref = this.#db
            .collection('calculators')
            .doc(calculator.rootNode.formulaName)
            .collection('treeNodes')
            .doc(calculator.rootNode.version.toString())

        try {
            await this.#db.runTransaction(async (t) => {
                const doc = await t.get(ref)
                if (doc.exists) {
                    throw new Error('Calculator already exists')
                }
                t.set(ref, calculator)
            })
        } catch (e) {
            throw new Error('An error occurred while adding the calculator')
        }

        // await this.#db
        //     .collection(`calculators`)
        //     .doc(calculator.rootNode.formulaName)
        //     .collection('treeNodes')
        //     .add(calculator)
    }

    async getCalculatorByName(name: string, version?: number): Promise<TreeState[]> {
        let query: Query = this.#db.collection('calculators').doc(name).collection('treeNodes')

        if (version) {
            query = query.where('rootNode.version', '==', version)
        } else {
            query = query.orderBy('rootNode.version', 'desc')
        }
        let snapshot = await query.get()
        return snapshot.docs.map(doc => doc.data() as TreeState)
    }

    async getCalculatorsLatest(): Promise<TreeState[]> {
        let snapshot = await this.#db.collectionGroup('treeNodes').get()

        return snapshot.docs.reduce((acc: TreeState[], doc) => {
            const current = doc.data() as TreeState
            const existingIndex = acc.findIndex(e => e.rootNode.formulaName === current.rootNode.formulaName)
            if (existingIndex > -1) {
                const existing = acc[existingIndex]
                if (existing.rootNode.version < current.rootNode.version) {
                    acc[existingIndex] = current
                }
            } else {
                acc.push(current)
            }
            return acc
        }, [])
    }
}