import {DisplayControlData} from "../common/displayNodeControlData";

export interface DisplayPieNodeData extends DisplayControlData {
    pieType: "pie" | "donut"
}