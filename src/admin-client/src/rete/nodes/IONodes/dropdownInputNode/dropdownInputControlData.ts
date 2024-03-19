import {InputBaseData} from "../inputBaseControlData";

export interface DropdownInputControlData extends InputBaseData {
    dropdownOptions: { value: number, label: string, key: number }[],
    defaultKey: string,

}