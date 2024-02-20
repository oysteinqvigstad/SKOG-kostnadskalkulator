import {Formula} from "@skogkalk/common/dist/src/types/Formula";

export interface IDatabase {
    addFormula(formula: Formula): Promise<void>;
    getFormulas(): Promise<Formula[]>;
}