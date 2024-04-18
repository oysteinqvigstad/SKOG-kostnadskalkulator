import {FormInputErrorCode} from "../calculator/calculator-fields";
import {UnitType} from "./UnitType";

/**
 * `FieldData` is an interface that is used to define the structure of the form fields.
 */
export interface FieldData {
    type: FieldType
    descriptionHTML: string
    errorId: FormInputErrorCode | null
    title: string
    default: string | null
    page: number
    showGraph: boolean
    advanced: boolean
    properties: NumberedProperties | DropdownProperties
}

/**
 * `FieldType` is an enum that is used to define the different types of form fields.
 */
export enum FieldType {
    NUMBERED_INPUT,
    DROPDOWN_INPUT
}

/**
 * `NumberedProperties` is an interface that is used to define the structure of the properties of a numbered input field.
 */
export interface NumberedProperties {
    min: number
    unit: UnitType
}

/**
 * `DropdownProperties` is an interface that is used to define the structure of the properties of a dropdown input field.
 */
export interface DropdownProperties {
    options: Map<string, string>
}

