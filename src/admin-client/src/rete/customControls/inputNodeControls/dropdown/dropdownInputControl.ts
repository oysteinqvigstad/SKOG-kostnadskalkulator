import {InputBaseData, InputBaseControl} from "../common/inputBaseControl";

export class DropdownInputControl extends InputBaseControl{

    constructor(
        baseData: InputBaseData,
        public dropdownOptions: { value: number, label: string }[],
        options: {
            minimized: boolean,
            onUpdate?: (input: InputBaseControl) => void,
        },
        public defaultKey?: string
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