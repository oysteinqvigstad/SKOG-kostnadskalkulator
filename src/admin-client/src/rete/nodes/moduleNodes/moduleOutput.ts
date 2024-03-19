import {ClassicPreset as Classic} from "rete";
import {DataflowNode} from "rete-engine";
import {BaseNode, NodeControl} from "../parseableBaseNode";
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
        ModuleOutputControlData
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
}
