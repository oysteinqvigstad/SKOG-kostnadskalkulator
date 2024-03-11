import {BaseNode, NodeControl} from "./baseNode";
import {ClassicPreset} from "rete";
import {getBinaryOperation, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ParseNode} from "@skogkalk/common/dist/src/parseTree"
import {NumberControlData} from "../customControls/numberControl/numberControlData";

/**
 * Node for use with any binary math operation, such as +,-, * amd pow.
 */
export class BinaryNode extends BaseNode<
    { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
    { value: ClassicPreset.Socket },
    { c: NodeControl<NumberControlData> }
>
{
    binaryOperation: (left: number, right: number) => number;

    constructor(
        type: NodeType,
        protected updateNodeRendering: (id: string)=>void,
    ) {
        super(type, 230, 180);

        this.binaryOperation = getBinaryOperation(type);

        this.addControl(
            "c",
            new NodeControl(
                {value: 0, readonly: true} as NumberControlData,
                {onUpdate: (data)=>{this.controls.c.data.value = data.value}, minimized: false},
                this.type,
            )
        );

        this.addInput("left", new ClassicPreset.Input(new ClassicPreset.Socket("socket"), "Left"));
        this.addInput("right", new ClassicPreset.Input(new ClassicPreset.Socket("socket"), "Right"));
        this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Out"));
    }

    data(inputs: { left?: number[]; right?: number[] }): { value: number } {
        const { left, right } = inputs;
        const value = this.binaryOperation(
            (left ? left[0] : 0 || 0),
            (right ? right[0] : 0 || 0)
        );

        this.controls.c.data.value = value;

        this.updateNodeRendering(this.id);

        return { value };
    }

    toParseNode() : ParseNode {
        return {
            id: this.id,
            type: this.type,
            value: this.controls.c.data.value || 0
        }
    }

    protected updateDataFlow: () => void = ()=>{}
}