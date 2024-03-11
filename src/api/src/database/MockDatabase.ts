import {IDatabase} from "../models/IDatabase";
import {TreeState} from "@skogkalk/common/dist/src/parseTree";

export class MockDatabase implements IDatabase {
    #formulas = new Map<string, TreeState[]>()

    async addCalculator(calculator: TreeState): Promise<void> {
        const name = calculator.rootNode.formulaName
        const existing = this.#formulas.get(name) ?? []
        this.#formulas.set(name, [...existing, calculator])
    }

    async getCalculatorByName(name: string, version?: number): Promise<TreeState[]> {
        return this.#formulas
            .get(name)
            ?.filter(calc => (!version || calc.rootNode.version === version))
            ?? []
    }

    async getCalculatorsLatest(): Promise<TreeState[]> {
        return Array
            .from(this.#formulas.values())
            .map(calcs => calcs.reduce((prev, current) =>
                prev.rootNode.version > current.rootNode.version ? prev : current
            ))
    }
}