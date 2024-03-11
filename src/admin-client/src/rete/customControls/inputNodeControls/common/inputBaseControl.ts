import {ClassicPreset} from "rete";
import {BaseControl} from "../../../nodes/baseNode";

export interface InputBaseData {
    name?: string,
    defaultValue?: number,
    simpleInput: boolean,
    pageName?: string,
    infoText?: string,
}


export abstract class InputBaseControl extends BaseControl {

    protected constructor(
        public data: InputBaseData,
        public options: {
            onUpdate: (input: InputBaseControl) => void,
            minimized: boolean,
        },
    ) {
        super(data, options);
    }

    public update() : void {
        this.options?.onUpdate?.(this);
    }
}