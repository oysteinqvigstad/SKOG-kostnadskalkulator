import {FormInputErrorCode} from "../calculator/calculator-fields";
import {UnitType} from "./UnitTypes";


export interface FieldData {
    type: FieldType
    errorId: FormInputErrorCode | null
    title: string
    default: string | null
    page: number
    properties: NumberedProperties | DropdownProperties
}

export enum FieldType {
    NUMBERED_INPUT,
    DROPDOWN_INPUT
}

export enum FieldNames {
    SKOGTYPE = "Skogtype",
    VOLUM_PR_DEKAR = "Volum pr dekar",
    TOMMERTREAR_PR_DEKAR = "Tømmertrær pr dekar",
    RYDDETREAR_PR_DEKAR = "Ryddetrær pr dekar",
    OVERFLATESTRUKTUR_TERRENG = "Overflatestruktur i terrenget",
    OVERFLATESTRUKTUR_TRAKTORVEG = "Overflatestruktur på traktorvei",
    HELLING_HOGSTFELT = "Helling på hogstfeltet",
    HELLING_PAA_TRAKTORVEG = "Helling på traktorvei",
    KJOREAVSTAND_TERRENG = "Kjøreavstand i terrenget",
    KJOREAVSTAND_VEG = "Kjøreavstand på vei",
    LASSTORRELSE = "Lasstørrelse",
    ANTALL_SORTIMENT = "Antall sortiment",
    TIMEKOST_HOGSTMASKIN = "Timekostnad - hogstmaskin",
    TIMEKOST_LASSBEARER = "Timekostnad - lassbærer"
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