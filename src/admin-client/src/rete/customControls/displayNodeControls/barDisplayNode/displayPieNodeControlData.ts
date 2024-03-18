import {DisplayControlData} from "../common/displayNodeControlData";

export interface DisplayBarNodeData extends DisplayControlData {
    unit: string
    max: number
}