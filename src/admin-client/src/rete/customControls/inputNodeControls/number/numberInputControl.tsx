import {InputBaseData, InputBaseControl} from "../common/inputBaseControl";


export interface NumberInputData extends InputBaseData {
    legalValues: { min?: number, max?: number }[]

}


export class NumberInputControl extends InputBaseControl {
    constructor(
        public data: NumberInputData,
        public options: {
            onUpdate: (input: InputBaseControl) => void,
            minimized: boolean,
        }
    ) {
        super(data, options);
    }
}















