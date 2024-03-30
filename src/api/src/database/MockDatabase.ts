import {IDatabase} from "../models/IDatabase";
import {
    ParseNode,
    treeStateFromData
} from "@skogkalk/common/dist/src/parseTree";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";
import {generateJsonCalculationResponse, setInputsByJSON} from "../utils/transformations";
import {NotFoundError} from "../types/errorTypes";

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
        if (!calculator) throw new NotFoundError('Calculator not found')

        const tree = calculator.treeNodes
        if (!tree) throw new NotFoundError('Tree not found')
        return tree
    }

    /**
     * Returns the rete schema of a specific calculator version
     */
    async getCalculatorSchema(name: string, version: number): Promise<any> {
        const calculator = this.#calculators[name]?.[version]
        if (!calculator) throw new NotFoundError('Calculator not found')

        const schema = calculator.reteSchema
        if (!schema) throw new NotFoundError('Schema not found')
        return schema
    }

    async calculate(name: string, version: number, inputs: JsonInputs, strict: boolean): Promise<any> {
        let tree = treeStateFromData(await this.getCalculatorTree(name, version))
        tree = setInputsByJSON(tree, inputs, strict)
        return generateJsonCalculationResponse(tree)
    }
}