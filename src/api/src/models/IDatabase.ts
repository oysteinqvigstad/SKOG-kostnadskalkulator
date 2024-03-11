import {TreeState} from "@skogkalk/common/dist/src/parseTree";

export interface IDatabase {
    addCalculator(tree: TreeState): Promise<void>;
    getCalculatorByName(name: string, version?: number): Promise<TreeState[]>;
    getCalculatorsLatest(): Promise<TreeState[]>;
}