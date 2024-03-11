import {BaseControl} from "../../../nodes/baseNode";

export interface InputBaseData {
    name?: string,
    defaultValue?: number,
    simpleInput: boolean,
    pageName?: string,
    infoText?: string,
}


export abstract class InputBaseControl<T extends InputBaseData> extends BaseControl {

    protected constructor(
        public data: T,
        public options: {
            onUpdate: (input: T) => void,
            minimized: boolean,
        },
    ) {
        super(data, options);
    }

    public update() : void {
        this.options?.onUpdate?.(this.data);
    }
}