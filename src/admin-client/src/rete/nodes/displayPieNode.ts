import {BaseNode, NodeControl} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DisplayNode as ParseDisplayNode } from "@skogkalk/common/src/parseTree"
import {DisplayPieNodeData} from "../customControls/displayNodeControls/pieDisplayNode/displayPieNodeControlData";


export class DisplayPieNode extends BaseNode <
    { input: ClassicPreset.Socket },
    {},
    { c: NodeControl<DisplayPieNodeData> }
> {
    constructor(
        protected updateNodeRendering: (nodeID: string) => void

    ) {
        super(NodeType.Display, 500, 400);

        this.addInput("input",
            new ClassicPreset.Input(
                new ClassicPreset.Socket("socket"),
                "Result",
                true))

        this.addControl("c",
            new NodeControl(
                {
                    name: "",
                    inputs: []
                } as DisplayPieNodeData,
                {
                    onUpdate: (data) => {
                        this.controls.c.data = data;
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
            this.controls.c.data.inputs = input.map((node, index)=>{return { label: node.name, id: node.id, value: node.value, color: node.color, ordering: index}});
        }
        this.updateNodeRendering?.(this.id);
        return {}
    }

    toParseNode() : ParseDisplayNode {
        return {
            id: this.id,
            type: NodeType.Display,
            value: 0,
            inputs: [],
            name: this.controls.c.data.name,
            inputOrdering: this.controls.c.data.inputs.map(input=>{return {outputID: input.id, outputLabel: input.label}}),
        }
    }

    protected updateDataFlow: () => void = () => {}
}