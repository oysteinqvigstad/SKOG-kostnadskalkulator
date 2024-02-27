import {UnitType} from "./UnitType";

/**
 * `ResultListItem` is an interface that is used to define the structure of the result list items.
 */
export interface ResultListItem {
    text: string,
    value: number,
    percentage?: number,
    unit: UnitType
}