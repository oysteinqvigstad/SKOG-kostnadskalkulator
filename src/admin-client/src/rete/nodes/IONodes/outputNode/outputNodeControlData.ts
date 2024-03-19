import {ClassicPreset} from "rete";
import {NodeControl} from "../../baseNode";

export interface OutputNodeControlData {
    name: string
    value: number
    color?: string
    unit?: string
}

// export class OutputNodeControl extends NodeControl {
//     constructor(
//         public data: OutputNodeControlData,
//         public options: {
//             onUpdate: (nodeID: OutputNodeControlData) => void,
//             minimized: boolean
//         }
//     ) {
//         super(data, options);
//     }
// }