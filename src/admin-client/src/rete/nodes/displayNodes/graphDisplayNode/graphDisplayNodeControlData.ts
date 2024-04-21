import {DisplayControlData} from "../displayNodeControlData";


export interface GraphDisplayNodeControlData extends DisplayControlData {
    shouldAddGroup: boolean,
    inputFieldShow: {name: string, page: string, id: string, show: boolean}[]
}

export interface GraphDisplayGroupData {
    id: string,
    name: string,
    resultIDs: string[],
    shouldDelete: boolean,
    unit: string,
}