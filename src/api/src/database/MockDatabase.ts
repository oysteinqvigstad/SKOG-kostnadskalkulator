import {IDatabase} from "../models/IDatabase";
import {ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";

export class MockDatabase implements IDatabase {
    #calculators: Record<string, Record<number, Calculator>> = {}

    /**
     * Adds a calculator to the database
     */
    async addCalculator(c: Calculator): Promise<void> {
        // overwrites any existing calculators
        if (!this.#calculators[c.name]) {
            this.#calculators[c.name] = {}
        }
        this.#calculators[c.name][c.version] = c
    }

    /**
     * Returns metainfo on all calculator versions in the database
     */
    async getCalculatorsInfo(): Promise<Calculator[]> {
        return Object
            .values(this.#calculators)
            .flatMap(calculators => Object.values(calculators))
            .map(c => {
                // remove reteSchema and treeNodes
                const {reteSchema, treeNodes, ...rest} = c
                return rest
            })
    }

    /**
     * Returns the parse tree of a specific calculator version
     */
    async getCalculatorTree(name: string, version: number): Promise<ParseNode[]> {
        const calculator = this.#calculators[name]?.[version]
        if (!calculator) throw new Error('Calculator not found')

        const tree = calculator.treeNodes
        if (!tree) throw new Error('Tree not found')
        return tree
    }

    /**
     * Returns the rete schema of a specific calculator version
     */
    async getCalculatorSchema(name: string, version: number): Promise<any> {
        const calculator = this.#calculators[name]?.[version]
        if (!calculator) throw new Error('Calculator not found')

        const schema = calculator.reteSchema
        if (!schema) throw new Error('Schema not found')
        return schema
    }
}