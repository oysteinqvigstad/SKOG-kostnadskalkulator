import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {getNaryOperation, NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {NumberControl} from "../customControls/numberControl/numberControl";


/**
 * Node for use with math operations that can take n inputs and reduce them to
 * one single output, such as SUM and PROD.
 */
export class NaryNode extends BaseNode<
    { input: ClassicPreset.Socket },
    { value: ClassicPreset.Socket },
    { c: NumberControl }
> {
    naryOperation: (inputs: number[]) => number;

    constructor(
        type: NodeType,
        protected updateNodeRendering: (id: string) => void
    ) {
        super(type, 190, 180);

        this.naryOperation = getNaryOperation(type);

        this.addControl(
            "c",
            new NumberControl({value: 0, readonly: true},
                {
                    onUpdate: (data)=>{ this.controls.c.data.value = data.value; },
                    minimized: false
                },)
        );

        this.addInput("input", new ClassicPreset.Input(new ClassicPreset.Socket("socket"), "In", true));
        this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Out"));
    }

    data(inputs: { input?: number[] }): { value: number } {
        const inputControl =
            this.inputs.input?.control as ClassicPreset.InputControl<"number">;

        const input = inputs.input;
        const value = (input ? this.naryOperation(input) : inputControl?.value || 0);

        this.controls.c.data.value = value;

        this.updateNodeRendering?.(this.id);

        return { value };
    }

    toParseNode(): ParseNode {
        return {
            id: this.id,
            type: this.type,
            value: this.controls.c.data.value || 0
        }
    }

    protected updateDataFlow: () => void = ()=>{}

}