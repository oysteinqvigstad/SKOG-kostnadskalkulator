import {Formula} from "../types/Formula";

export interface IDatabase {
    addFormula(formula: Formula): Promise<void>;
    getFormulas(): Promise<Formula[]>;
}