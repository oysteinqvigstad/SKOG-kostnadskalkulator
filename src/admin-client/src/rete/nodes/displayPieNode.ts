import {BaseNode, NodeControl} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DisplayPieNode as ParseDisplayPieNode } from "@skogkalk/common/src/parseTree"
import {DisplayPieNodeData} from "../customControls/displayNodeControls/pieDisplayNode/displayPieNodeControlData";


export class DisplayPieNode extends BaseNode <
    { input: ClassicPreset.Socket },
    {},
    { c: NodeControl<DisplayPieNodeData> }
> {
    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        private updateStore: () => void
    ) {
        super(NodeType.Display, 600, 400);

        this.addInput("input",
            new ClassicPreset.Input(
                new ClassicPreset.Socket("socket"),
                "Result",
                true))

        const initialControlData: DisplayPieNodeData = {
            nodeID: this.id,
            name: "",
            unit: "",
            inputs: [],
            pieType: "pie",
        }
        this.addControl("c",
            new NodeControl(
                initialControlData,
                {
                    onUpdate: () => {
                        updateNodeRendering(this.id);

                    },
                    minimized: false
                },
                this.type
            )
        );
    }

    data( inputs :{ input?: {name: string, value: number, id: string , color: string}[] }) : {} {
        const { input } = inputs
        if(input) {
            this.controls.c.set({inputs: input.map((node, index)=>{return { label: node.name, id: node.id, value: node.value, color: node.color, ordering: index}})});
            this.updateStore();
        }
        this.updateNodeRendering?.(this.id);
        return {}
    }

    toParseNode() : ParseDisplayPieNode {
        this.controls.c.set({nodeID: this.id})
        return {
            id: this.id,
            pieType: this.controls.c.get("pieType"),
            unit: this.controls.c.get("unit"),
            type: NodeType.Display,
            value: 0,
            inputs: [],
            name: this.controls.c.get("name"),
            inputOrdering: this.controls.c.get('inputs').map(input=>{return {outputID: input.id, outputLabel: input.label}}),
        }
    }

    protected updateDataFlow: () => void = () => {}
}