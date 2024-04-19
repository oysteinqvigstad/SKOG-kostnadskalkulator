import {DisplayArrangement} from "@skogkalk/common/dist/src/parseTree/nodes/displayNode";


export interface OutputData {
    id: string,
    label: string,
    value: number,
    color: string,
    ordering: number
}

export interface DisplayControlData {
    nodeID: string,
    name: string,
    unit: string,
    inputs: OutputData[],
    infoText?: string
    arrangement?: {
        xs: DisplayArrangement,
        md: DisplayArrangement,
        lg: DisplayArrangement,
    }
}
