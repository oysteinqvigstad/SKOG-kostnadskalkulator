import {ClassicPreset} from "rete";
import {BaseControl} from "../../nodes/baseNode";

export interface OutputNodeControlData {
    name: string
    value: number
    color?: string
    unit?: string
}

export class OutputNodeControl extends BaseControl {
    constructor(
        public data: OutputNodeControlData,
        public options: {
            onUpdate: (nodeID: OutputNodeControlData) => void,
            minimized: boolean
        }
    ) {
        super(data, options);
    }
}