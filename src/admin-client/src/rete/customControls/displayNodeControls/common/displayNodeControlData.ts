

export interface OutputData {
    id: string,
    label: string,
    value: number,
    color: string,
    ordering: number
}

export interface DisplayControlData {
    name: string,
    inputs: OutputData[],
}
