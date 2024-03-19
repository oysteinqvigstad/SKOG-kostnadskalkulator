import {ParseableBaseNode, NodeControl} from "../parseableBaseNode";
import {ClassicPreset} from "rete";
import {getBinaryOperation, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ParseNode} from "@skogkalk/common/dist/src/parseTree"
import {NumberControlData} from "./numberControl/numberControlData";
import {NumberSocket} from "../../sockets";
import {NumberControlComponent} from "./numberControl/numberControlComponent";

/**
 * Node for use with any binary math operation, such as +,-, * amd pow.
 */
export class BinaryNode extends ParseableBaseNode<
    { left: NumberSocket; right: NumberSocket },
    { value: NumberSocket },
    { c: NodeControl<NumberControlData> }
>
{
    binaryOperation: (left: number, right: number) => number;

    constructor(
        type: NodeType,
        protected updateNodeRendering: (id: string)=>void,
        id?: string,
    ) {
        super(type, 230, 180, type.toString(), id);

        this.binaryOperation = getBinaryOperation(type);

        this.addControl(
            "c",
            new NodeControl(
                {value: 0, readonly: true} as NumberControlData,
                {onUpdate: ()=>{}, minimized: false},
                this.type,
                NumberControlComponent
            )
        );

        this.addInput("left", new ClassicPreset.Input(new NumberSocket(), "Left"));
        this.addInput("right", new ClassicPreset.Input(new NumberSocket(), "Right"));
        this.addOutput("value", new ClassicPreset.Output(new NumberSocket(), "Out"));
    }

    data(inputs: { left?: number[]; right?: number[] }): { value: number } {
        const { left, right } = inputs;
        const value = this.binaryOperation(
            (left ? left[0] : 0),
            (right ? right[0] : 0)
        );

        this.controls.c.set({ value })

        this.updateNodeRendering(this.id);

        return { value };
    }

    toParseNode() : ParseNode {
        return {
            id: this.id,
            type: this.type,
            value: this.controls.c.get('value') || 0
        }
    }

    protected updateDataFlow: () => void = ()=>{}
}