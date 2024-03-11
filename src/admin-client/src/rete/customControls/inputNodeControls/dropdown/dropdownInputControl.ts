import {InputBaseData, InputBaseControl} from "../common/inputBaseControl";

export interface DropdownInputControlData extends InputBaseData {
    dropdownOptions: { value: number, label: string }[],
}

export class DropdownInputControl extends InputBaseControl<DropdownInputControlData>{

    constructor(
        public data: DropdownInputControlData,
        public options: {
            minimized: boolean,
            onUpdate: (input: DropdownInputControlData) => void,
        },
        public defaultKey?: string
    ) {
        super(data, options);
    }
}