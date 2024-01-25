// [type, title, unit, props]

import {FormInputErrorCode} from "../calculator/calculator-fields";

export enum FieldType {
    NUMBERED_INPUT,
    DROPDOWN_INPUT
}

export enum UnitType {
    CUBIC_M = 'm',
    CUBIC_M_PER_DEKAR = 'm³/daa',
    TREE_PER_DEKAR = 'tre/daa',
    PIECE = 'stk',
    COST_PER_G15 = 'kr/G₁₅-time'
}


export interface NumberedProperties {
    min: number
    unit: UnitType
}

export interface DropdownProperties {
    options: Map<string, string>
}

export interface FieldData {
    type: FieldType
    id: FormInputErrorCode
    title: string
    properties: NumberedProperties | DropdownProperties
}

export const inputFieldData: FieldData[] = [
    {
        type: FieldType.NUMBERED_INPUT,
        id: FormInputErrorCode.HARVESTER_HOUR_COST_G15,
        title: "Timekostnad - hogstmaskin",
        properties: { min: 0, unit: UnitType.COST_PER_G15 }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        id: FormInputErrorCode.TIMBER_TREES_1000_SQM,
        title: "Tømmertrær pr dekar",
        properties: { min: 1, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        id: FormInputErrorCode.DRIVING_CONDITIONS,
        title: "Overflatestruktur i terrenget",
        properties: { options: new Map([
                ["Meget god", "1"],
                ["God", "2"],
                ["Middels god", "3"],
                ["Dårlig", "4"],
                ["Svært dårlig", "5"]
            ]) }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        id: FormInputErrorCode.CLEARANCE_TREES_1000_SQM,
        title: "Ryddetrær per Dekar",
        properties: { min: 0, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        id: FormInputErrorCode.INCLINE,
        title: "Helling på hogstfeltet",
        properties: { options: new Map([
                ["0-10 %", "1"],
                ["10-20 %", "2"],
                ["20-33 %", "3"],
                ["33-50 %", "4"],
                ["> 50 %", "5"]
            ]) }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        id: FormInputErrorCode.SELLABLE_TIMBER_VOLUME,
        title: "Volum pr dekar",
        properties: { min: 0, unit: UnitType.CUBIC_M_PER_DEKAR }
    },
]