import FirebaseFirestore, {DocumentData, Query} from "@google-cloud/firestore";
import {IDatabase} from "../models/IDatabase";
import {FirestoreConfiguration} from "../types/FirestoreConfiguration";
import {Formula} from "@skogkalk/common/dist/src/types/Formula";

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

    async addCalculator(formula: Formula): Promise<void> {
        await this.#db.collection('formulas').add(formula);
    }

    async getCalculator(name: string | undefined, version: string | undefined): Promise<Formula[]> {
        let query: Query<DocumentData> = this.#db.collection('calculators')
        if (name) {
            query = query.where('name', '==', name)
        }
        if (version) {
            query = query.where('version', '==', version)
        }
        let snapshot = await query.get()
        return snapshot.docs.map(doc => doc.data() as Formula)
    }
}