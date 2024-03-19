import {ClassicPreset, ClassicPreset as Classic} from "rete";
import {DataflowNode} from "rete-engine";
import {BaseNode, NodeControl} from "../baseNode";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {NumberSocket} from "../../sockets";
import {ModuleOutputControl} from "./moduleControls";


export interface ModuleOutputControlData {
    outputName: string,
    value: number | undefined
}
export class ModuleOutput extends BaseNode<
        { value: NumberSocket },
        {},
        { c: NodeControl<ModuleOutputControlData> }
    >
    implements DataflowNode {
    width = 180;
    height = 140;

    constructor(
        protected updateNodeRendering: (id: string)=>void,
        protected updateDataFlow: () => void,
        initialName?: string,
        id?: string
    ) {
        super(NodeType.ModuleOutput, 140, 180, "Module Output", id);

        const initialState: ModuleOutputControlData = {
            outputName: initialName ?? "",
            value: undefined
        }

        this.addControl("c", new NodeControl(
            initialState,
            {
                onUpdate: () => {
                    this.updateNodeRendering(this.id)
                },
                minimized: false,
            },
            this.type,
            ModuleOutputControl
        ));
        this.addInput("value", new Classic.Input(new NumberSocket(), "Number"));
    }

    data() {
        return {};
    }

    toParseNode() {
        // throw new Error("This node is not meant to go in parseNode tree structure")
        return {
            id:"",
            value: 0,
            type: NodeType.Module
        }
    }

}