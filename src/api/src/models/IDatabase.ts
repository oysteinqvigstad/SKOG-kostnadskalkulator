import {ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";

/**
 * Database methods that are used by the API
 */
export interface IDatabase {
    addCalculator(calculator: Calculator): Promise<void>
    getCalculatorsInfo(): Promise<Calculator[]>
    getCalculatorTree(name: string, version: number): Promise<ParseNode[]>
    getCalculatorSchema(name: string, version: number): Promise<any>
    calculate(name: string, version: number, inputs: JsonInputs, strict: boolean): Promise<any>
}