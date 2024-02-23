import {IDatabase} from "../models/IDatabase";
import {Formula} from "@skogkalk/common/dist/src/types/Formula";

export class MockDatabase implements IDatabase {
    #formulas = new Array<Formula>;

    async addCalculator(formula: Formula): Promise<void> {
        this.#formulas.push(formula);
    }

    async getCalculator(name: string | undefined, version: string | undefined): Promise<Formula[]> {
        return this.#formulas.filter(calc =>
            (!name || calc.name === name) && (!version || calc.version === version)
        )
    }
}