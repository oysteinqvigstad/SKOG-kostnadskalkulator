import {DisplayControlData, DisplayNodeControl} from "../common/displayNodeControl";

export interface DisplayPieNodeData extends DisplayControlData {

}

export class DisplayPieNodeControl extends DisplayNodeControl {
    constructor(
        data: DisplayControlData,
        options: {
            onUpdate: (newData: DisplayControlData) => void,
            minimized: boolean
        }
    ) {
        super(data, options);
    }
}