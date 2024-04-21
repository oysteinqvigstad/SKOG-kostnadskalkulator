import {DisplayControlData} from "../displayNodeControlData";
import {ResultGroup} from "@skogkalk/common/dist/src/parseTree/nodes/displayNode";



export interface GraphDisplayNodeControlData extends DisplayControlData {
    shouldAddGroup: boolean,
    resultGrouping: ResultGroup[]
    inputFieldShow: {name: string, page: string, id: string, show: boolean}[]
}

export interface GraphDisplayGroupData {
    id: string,
    name: string,
    shouldDelete: boolean,
    unit: string,
    label: string
}