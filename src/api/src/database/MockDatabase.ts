import {IDatabase} from "../models/IDatabase";
import {Formula} from "@skogkalk/common/dist/src/types/Formula";

export class MockDatabase implements IDatabase {
    #formulas = new Array<Formula>;

    async addFormula(formula: Formula): Promise<void> {
        this.#formulas.push(formula);
    }

    async getFormulas(): Promise<Formula[]> {
        return this.#formulas;
    }
}