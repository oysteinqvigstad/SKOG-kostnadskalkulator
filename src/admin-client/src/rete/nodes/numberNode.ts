import {NodeControl, BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {NumberControlData} from "../customControls/numberControl/numberControlData";
import {NumberSocket} from "../sockets/sockets";
import {NumberControlComponent} from "../customControls/numberControl/numberControlComponent";





/**
 * Node providing a simple number value that can be manually set. Represents a constant.
 */
export class NumberNode extends BaseNode<
    {},
    { value: NumberSocket },
    { c: NodeControl<NumberControlData> }
> {
    clone: () => NumberNode;
    constructor(
        initialValue: number,
        protected updateNodeRendering: (id: string)=>void,
        protected updateDataFlow: () => void,
        id?: string
    ) {
        super(NodeType.Number, 160, 180, "Constant", id);

        this.clone = () => new NumberNode(this.controls.c.get('value') || 0, this.updateNodeRendering, this.updateDataFlow);

        this.addControl(
            "c",
            new NodeControl(
                {value:0, readonly: false} as NumberControlData,
                {
                    onUpdate: ()=>{
                        updateDataFlow();
                        updateNodeRendering(this.id);
                    },
                    minimized: false
                },
                this.type,
                NumberControlComponent
            )
        );
        this.addOutput("value", new ClassicPreset.Output(new NumberSocket(), "Number"));
    }

    data(): { value: number } {
        this.clone = () => new NumberNode(this.controls.c.get('value') || 0, this.updateNodeRendering, this.updateDataFlow);
        return {
            value: this.controls.c.get('value') || 0
        };
    }

    toParseNode(): ParseNode {
        return {
            id: this.id,
            value: this.controls.c.get('value') || 0,
            type: this.type
        }
    }
}