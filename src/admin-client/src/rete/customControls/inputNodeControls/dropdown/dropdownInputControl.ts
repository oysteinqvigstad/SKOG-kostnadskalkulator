import {InputBaseData, InputBaseControl} from "../common/inputBaseControl";

export interface DropdownInputControlData extends InputBaseData {
    dropdownOptions: { value: number, label: string }[],
}

export class DropdownInputControl extends InputBaseControl{

    constructor(
        public data: DropdownInputControlData,
        public options: {
            minimized: boolean,
            onUpdate: (input: InputBaseControl) => void,
        },
        public defaultKey?: string
    ) {
        super(data, options);
    }
}