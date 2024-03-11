import {ClassicPreset} from "rete";

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

export class DisplayNodeControl extends ClassicPreset.Control {

    constructor(
        public data: DisplayControlData,
        public options: {
            onUpdate: (data: DisplayControlData) => void,
            minimized: boolean
        }
    ){
        super()
    }
}