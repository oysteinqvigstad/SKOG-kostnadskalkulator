import {ClassicPreset} from "rete";

export interface OutputNodeControlData {
    name: string
    value: number
    color?: string
    unit?: string
}

export class OutputNodeControl extends ClassicPreset.Control {
    constructor(
        public data: OutputNodeControlData,
        public options: {
            onUpdate: (nodeID: OutputNodeControlData) => void
        }
    ) {
        super();
    }
}