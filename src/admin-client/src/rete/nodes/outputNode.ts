import {BaseNode} from "./baseNode";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset} from "rete";
import {OutputNodeControl} from "../customControls/outputNodeControls/outputNodeControl";
import {OutputNode as ParseOutputNode} from "@skogkalk/common/src/parseTree"


export class OutputNode extends BaseNode <
{ result: ClassicPreset.Socket },
{ output: ClassicPreset.Socket },
{
    control: OutputNodeControl
}
> {


    constructor(
        private onNodeUpdate?: (nodeID: string) => void
    ) {
        super(NodeType.Output, 200, 200);

        this.addInput( "result", new ClassicPreset.Input(  new ClassicPreset.Socket("socket"),  "Result",  false))
        this.addOutput(  "output", new ClassicPreset.Output( new ClassicPreset.Socket("socket"), "Out", true));
        this.addControl("control",
            new OutputNodeControl(
                {
                    name:"",
                    value: 0,

                },
                {
                    onUpdate: (newData)=> {
                        this.controls.control.data = newData;
                    }
                }
            ))
    }

    data( inputs :{ result?: number }) : { output: {name: string, value: number, id: string }} {

        const { result } = inputs
        if(result) {
            console.log("Hi")
            this.onNodeUpdate?.(this.id);
            this.controls.control.data.value = result;
        }
        return { output: { id: this.id, name: this.controls.control.data.name, value: this.controls.control.data.value }}
    }

    toParseNode(): ParseOutputNode {
        return {
            id: this.id,
            value: this.controls.control.data.value,
            type: NodeType.Output,
            child: {id:"", value: 0, type: NodeType.Number }, // Placeholder,
            name: this.controls.control.data.name,
            color: this.controls.control.data.color || "",
            unit: this.controls.control.data.unit || "",
        }
    }
}