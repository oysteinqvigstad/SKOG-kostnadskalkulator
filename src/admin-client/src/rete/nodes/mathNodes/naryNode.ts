import {ParseableBaseNode, NodeControl} from "../parseableBaseNode";
import {ClassicPreset} from "rete";
import {getNaryOperation, NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {NumberControlData} from "./numberControl/numberControlData";
import {NumberSocket} from "../../sockets";
import {NumberControlComponent} from "./numberControl/numberControlComponent";


/**
 * Node for use with math operations that can take n inputs and reduce them to
 * one single output, such as SUM and PROD.
 */
export class NaryNode extends ParseableBaseNode<
    { input: NumberSocket },
    { value: NumberSocket },
    { c: NodeControl<NumberControlData> }
> {
    naryOperation: (inputs: number[]) => number;

    constructor(
        type: NodeType,
        protected updateNodeRendering: (id: string) => void,
        id?: string
    ) {
        super(type, 190, 180, type.toString(), id);

        this.naryOperation = getNaryOperation(type);

        this.addControl(
            "c",
            new NodeControl(
                {value: 0, readonly: true} as NumberControlData,
                {
                    onUpdate: ()=>{},
                    minimized: false
                },
                this.type,
                NumberControlComponent
                )
        );

        this.addInput("input", new ClassicPreset.Input(new NumberSocket(), "In", true));
        this.addOutput("value", new ClassicPreset.Output(new NumberSocket(), "Out"));
    }

    data(inputs: { input?: number[] }): { value: number } {
        const inputControl =
            this.inputs.input?.control as ClassicPreset.InputControl<"number">;

        const input = inputs.input;
        const value = (input ? this.naryOperation(input) : inputControl?.value || 0);

        this.controls.c.set({ value });

        this.updateNodeRendering?.(this.id);

        return { value };
    }

    toParseNode(): ParseNode {
        return {
            id: this.id,
            type: this.type,
            value: this.controls.c.get('value') || 0
        }
    }

    protected updateDataFlow: () => void = ()=>{}

}