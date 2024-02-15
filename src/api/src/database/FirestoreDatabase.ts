import FirebaseFirestore from "@google-cloud/firestore";
import {IDatabase} from "../models/IDatabase";
import {FirestoreConfiguration} from "../types/FirestoreConfiguration";
import {Formula} from "../types/Formula";

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

    async addFormula(formula: Formula): Promise<void> {
        await this.#db.collection('formulas').add(formula);
    }
}