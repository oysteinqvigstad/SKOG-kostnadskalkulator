import {DisplayControlData} from "../displayNodeControlData";

export interface DisplayBarNodeData extends DisplayControlData {
    unit: string
    max: number
}