

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
}
