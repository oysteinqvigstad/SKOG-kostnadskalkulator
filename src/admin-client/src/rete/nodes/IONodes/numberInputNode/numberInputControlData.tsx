import {InputBaseData} from "../inputBaseControlData";


export interface NumberInputData extends InputBaseData {
    legalValues: { min?: number, max?: number }[]
    allowDecimals: boolean
}















