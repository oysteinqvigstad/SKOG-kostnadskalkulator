import {ClassicPreset} from "rete";
import {BaseNode, NodeControl} from "../baseNode";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {NumberSocket} from "../../sockets/sockets";


export interface ModuleInputControlData {
    inputName: string,
    value: number | undefined
}

export class ModuleInput extends BaseNode<
        {},
        { value: NumberSocket },
        { c: NodeControl<ModuleInputControlData> }
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
            this.type
        ));

        this.addOutput("value", new ClassicPreset.Output( new NumberSocket(), "Number") );
    }

    data() {
        return {
            value: this.value
        };
    }

    toParseNode(): ParseNode {
        // throw new Error("This node is not meant to go in parseTree structure");
        return {
            id:"",
            value: 0,
            type: NodeType.Module
        }
    }
}