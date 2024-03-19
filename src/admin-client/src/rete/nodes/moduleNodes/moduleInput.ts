import {ClassicPreset} from "rete";
import {BaseNode, NodeControl} from "../parseableBaseNode";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {NumberSocket} from "../../sockets";
import {ModuleInputControl} from "./moduleControls";


export interface ModuleInputControlData {
    inputName: string,
    value: number | undefined
}

export class ModuleInput extends BaseNode<
    {},
    { value: NumberSocket },
    ModuleInputControlData
> {
    width = 180;
    height = 140;
    value: any = null;

    constructor(
        protected updateNodeRendering: (id: string)=>void,
        protected updateDataFlow: ()=>void,
        initial?: string,
        id?: string
    ) {
        super(NodeType.ModuleInput, 140, 180, "Module Input", id);


        const initialState: ModuleInputControlData = {
            inputName: initial ??"",
            value: undefined
        }

        this.addControl("c", new NodeControl<ModuleInputControlData>(
            initialState,
            {
                onUpdate: () => {
                    this.updateNodeRendering(this.id)
                },
                minimized: false
            },
            this.type,
            ModuleInputControl
        ));

        this.addOutput("value", new ClassicPreset.Output( new NumberSocket(), "Number") );
    }

    data() {
        return {
            value: this.value
        };
    }
}