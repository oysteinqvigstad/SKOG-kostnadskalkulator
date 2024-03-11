import {BaseControl, BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {NumberControl} from "../customControls/numberControl/numberControl";





/**
 * Node providing a simple number value that can be manually set. Represents a constant.
 */
export class NumberNode extends BaseNode<
    {},
    { value: ClassicPreset.Socket },
    { c: NumberControl }
> {
    clone: () => NumberNode;
    constructor(
        initialValue: number,
        protected updateNodeRendering: (id: string)=>void,
        protected updateDataFlow: () => void
    ) {
        super(NodeType.Number, 160, 180);

        this.clone = () => new NumberNode(this.controls.c.data.value || 0, this.updateNodeRendering, this.updateDataFlow);

        this.addControl(
            "c",
            new NumberControl({value:0, readonly: false},
                {
                    onUpdate: data=>{

                        this.controls.c.data.value = data.value;
                        updateDataFlow();
                        updateNodeRendering(this.id);
                    },
                    minimized: false
                })
        );
        this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Number"));
    }

    data(): { value: number } {
        this.clone = () => new NumberNode(this.controls.c.data.value || 0, this.updateNodeRendering, this.updateDataFlow);
        return {
            value: this.controls.c.data.value || 0
        };
    }

    toParseNode(): ParseNode {
        return {
            id: this.id,
            value: this.controls.c.data.value || 0,
            type: this.type
        }
    }
}