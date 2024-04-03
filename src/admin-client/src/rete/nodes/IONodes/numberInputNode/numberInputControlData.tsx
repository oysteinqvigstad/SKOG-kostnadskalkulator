import {InputBaseData} from "../inputBaseControlData";


export interface NumberInputControlData extends InputBaseData {
    legalValues: { min?: number, max?: number }[]
}















