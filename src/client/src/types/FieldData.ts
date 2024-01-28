import {FormInputErrorCode} from "../calculator/calculator-fields";
import {UnitType} from "./UnitTypes";


export interface FieldData {
    type: FieldType
    id: FormInputErrorCode
    title: string
    properties: NumberedProperties | DropdownProperties
}

export enum FieldType {
    NUMBERED_INPUT,
    DROPDOWN_INPUT
}

export interface NumberedProperties {
    min: number
    unit: UnitType
}

export interface DropdownProperties {
    options: Map<string, string>
}

export interface ResultListItem {
    text: string,
    value: string,
    unit: UnitType
}