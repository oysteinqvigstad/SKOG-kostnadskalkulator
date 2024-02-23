import {Formula} from "@skogkalk/common/dist/src/types/Formula";

export interface IDatabase {
    addCalculator(formula: Formula): Promise<void>;
    getCalculator(name: string | undefined, version: string | undefined): Promise<Formula[]>;
}