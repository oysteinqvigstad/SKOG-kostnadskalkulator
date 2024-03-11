import {BaseNode, NodeControl} from "./baseNode";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset} from "rete";
import {OutputNodeControlData} from "../customControls/outputNodeControls/outputNodeControlData";
import {OutputNode as ParseOutputNode} from "@skogkalk/common/src/parseTree"


export class OutputNode extends BaseNode <
{ result: ClassicPreset.Socket },
{ output: ClassicPreset.Socket },
{
    c: NodeControl<OutputNodeControlData>
}
> {


    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
    ) {
        super(NodeType.Output, 200, 200);

        this.addInput( "result", new ClassicPreset.Input(  new ClassicPreset.Socket("socket"),  "Result",  false))
        this.addOutput(  "output", new ClassicPreset.Output( new ClassicPreset.Socket("socket"), "Out", true));
        this.addControl("c",
            new NodeControl(
                {
                    id: "",
                    name:"",
                    value: 0,
                } as OutputNodeControlData,
                {
                    onUpdate: (newData)=> {
                        this.controls.c.data = newData;
                    },
                    minimized: false
                },
                this.type
            ))
    }

    data( inputs :{ result?: number }) : { output: {name: string, value: number, id: string }} {

        const { result } = inputs
        if(result) {
            this.updateNodeRendering?.(this.id);
            this.controls.c.data.value = result;
        }
        return { output: { id: this.id, name: this.controls.c.data.name, value: this.controls.c.data.value }}
    }

    toParseNode(): ParseOutputNode {
        return {
            id: this.id,
            value: this.controls.c.data.value,
            type: NodeType.Output,
            child: {id:"", value: 0, type: NodeType.Number }, // Placeholder,
            name: this.controls.c.data.name,
            color: this.controls.c.data.color || "",
            unit: this.controls.c.data.unit || "",
        }
    }

    protected updateDataFlow: () => void = () => {}
}