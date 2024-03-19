import {ParseableBaseNode, NodeControl} from "../../parseableBaseNode";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset} from "rete";
import {OutputNodeControlData} from "./outputNodeControlData";
import {OutputNode as ParseOutputNode} from "@skogkalk/common/dist/src/parseTree"
import {NumberSocket, ResultSocket} from "../../../sockets";
import {OutputNodeControlContainer} from "./outputNodeControlContainer";


export class OutputNode extends ParseableBaseNode <
    { result: NumberSocket },
    { output: ResultSocket },
    OutputNodeControlData
> {


    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        protected updateDataFlow: ()=>void,
        id?: string
    ) {
        super(NodeType.Output, 240, 200, "Output", id);

        this.addInput( "result", new ClassicPreset.Input(  new NumberSocket(),  "Result",  false))
        this.addOutput(  "output", new ClassicPreset.Output( new ResultSocket(), "Out", true));

        const initialState: OutputNodeControlData = {
            name: "",
            value: 0,
            color: "#AAAAAA",
            unit: "",
        }
        this.addControl("c",
            new NodeControl(
                initialState,
                {
                    onUpdate: ()=> {
                        this.updateDataFlow();
                        this.updateNodeRendering(this.id);
                    },
                    minimized: false
                },
                this.type,
                OutputNodeControlContainer
            ))
    }

    data( inputs :{ result?: number[] }) : { output: {name: string, value: number, id: string, color: string }} {
        const { result } = inputs
        if(result) {
            this.updateNodeRendering?.(this.id);
            this.controls.c.setNoUpdate({value: result[0]});
        }
        return {
            output: {
                id: this.id,
                name: this.controls.c.get('name'),
                value: this.controls.c.get('value') || 0,
                color: this.controls.c.get('color') || ""
            }
        }
    }

    toParseNode(): ParseOutputNode {
        return {
            id: this.id,
            value: this.controls.c.get('value'), // TODO: Somehow turns into an array with the actual value
            type: NodeType.Output,
            child: {id:"", value: 0, type: NodeType.Number }, // Placeholder,
            name: this.controls.c.get('name'),
            color: this.controls.c.get('color') || "",
            unit: this.controls.c.get('unit') || "",
        }
    }
}