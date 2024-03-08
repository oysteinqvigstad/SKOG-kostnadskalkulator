import {ClassicPreset} from "rete";

export interface InputBaseData {
    name?: string,
    defaultValue?: number,
    simpleInput: boolean,
    pageName?: string,
    infoText?: string,
}


export abstract class InputBaseControl extends ClassicPreset.Control {
    /**
     * @param name
     * @param defaultValue
     * @param simpleInput
     * @param pageName
     * @param infoText
     * @param options
     */
    protected constructor(
        public simpleInput: boolean,
        public options: {
            onUpdate?: (input: InputBaseControl) => void,
            minimized: boolean,
        },
        public name?: string,
        public defaultValue?: number,
        public pageName?: string,
        public infoText?: string,
    ) {
        super();
    }

    public update() : void {
        this.options?.onUpdate?.(this);
    }
}