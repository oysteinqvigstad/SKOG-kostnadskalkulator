import {InputBaseData, InputBaseControl} from "../common/inputBaseControl";



export class NumberInputControl extends InputBaseControl {
    /**
     *
     * @param baseData
     * @param legalValues
     * @param options
     */
    constructor(
        baseData: InputBaseData,
        public legalValues: { min?: number, max?: number }[],
        options: {
            onUpdate?: (input: InputBaseControl) => void,
            minimized: boolean,
        }
    ) {
        super(
            baseData.simpleInput,
            options,
            baseData.name,
            baseData.defaultValue,
            baseData.pageName,
            baseData.infoText,
        );
    }
}















