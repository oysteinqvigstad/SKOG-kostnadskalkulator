import {BaseControl} from "../../nodes/baseNode";

export interface NumberControlData {
    value: number,
    readonly: boolean
}


export class NumberControl extends BaseControl {
    constructor(
        public data: NumberControlData,
        public options: {
            onUpdate: (data: NumberControlData) => void,
            minimized: boolean
        }
    ) {
        super(data, options);
    }
}