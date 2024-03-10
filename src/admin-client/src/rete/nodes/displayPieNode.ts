import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DisplayNodeControl} from "../customControls/displayNodeControls/common/displayNodeControl";
import {DisplayNode as ParseDisplayNode } from "@skogkalk/common/src/parseTree"


export class DisplayPieNode extends BaseNode <
    { outputNodes: ClassicPreset.Socket },
    {},
    { control: DisplayNodeControl }
> {
    constructor(
        private onNodeUpdate?: (nodeID: string) => void
    ) {
        super(NodeType.Display, 200, 200);

        this.addInput("outputNodes",
            new ClassicPreset.Input(
                new ClassicPreset.Socket("socket"),
                "Result",
                true))

        this.addControl("control",
            new DisplayNodeControl(
                {
                    name: "",
                    inputs: []
                },
                {
                    onUpdate: (data) => {
                        this.controls.control.data = data;
                        onNodeUpdate?.(this.id);
                    },
                    minimized: false
                }
            )
        );
    }

    data( inputs :{ outputNodes?: {name: string, value: number, id: string }[] }) : {} {
        const { outputNodes } = inputs
        console.log(outputNodes)
        // this.controls.control.data.inputs = outputNodes.map((node, index)=>{
        //     return {
        //         id: node.id,
        //         name: index.toString(),
        //         value: node.value,
        //         color: "", // TODO
        //         ordering: index
        //     }
        // });

        this.onNodeUpdate?.(this.id);
        return {}
    }

    toParseNode() : ParseDisplayNode {
        return {
            id: this.id,
            type: NodeType.Display,
            value: 0,
            inputs: [],
            name: this.controls.control.data.name,
            inputOrdering: this.controls.control.data.inputs.map(input=>{return {outputID: input.id, outputLabel: input.label}}),
        }
    }
}