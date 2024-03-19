import {DisplayControlData} from "../displayNodeControlData";

export interface DisplayPieNodeData extends DisplayControlData {
    pieType: "pie" | "donut"
}