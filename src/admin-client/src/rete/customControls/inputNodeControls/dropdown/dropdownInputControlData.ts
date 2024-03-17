import {InputBaseData} from "../common/inputBaseControlData";

export interface DropdownInputControlData extends InputBaseData {
    dropdownOptions: { value: number, label: string, key: number }[],
    defaultKey: string,

}