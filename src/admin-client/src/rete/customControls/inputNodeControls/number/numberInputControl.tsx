import {InputBaseData, InputBaseControl} from "../common/inputBaseControl";


export interface NumberInputData extends InputBaseData {
    legalValues: { min?: number, max?: number }[]
}


export class NumberInputControl extends InputBaseControl<NumberInputData> {
    constructor(
        public data: NumberInputData,
        public options: {
            onUpdate: (input: NumberInputData) => void,
            minimized: boolean,
        }
    ) {
        super(data, options);
    }
}















