import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {getBinaryOperation, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ParseNode} from "@skogkalk/common/dist/src/parseTree"

/**
 * Node for use with any binary math operation, such as +,-, * amd pow.
 */
export class BinaryNode extends BaseNode<
    { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
    { value: ClassicPreset.Socket },
    { value: ClassicPreset.InputControl<"number">, description: ClassicPreset.InputControl<"text"> }
>
{
    binaryOperation: (left: number, right: number) => number;

    constructor(
        type: NodeType,
        private onNodeUpdate?: (control: ClassicPreset.InputControl<"number">) => void, // function called on node value change
    ) {
        super(type, 230, 180);

        this.binaryOperation = getBinaryOperation(type);

        this.addControl(
            "value",
            new ClassicPreset.InputControl("number", {
                readonly: true
            })
        );

        this.addControl(
            "description",
            new ClassicPreset.InputControl("text", { initial: "description" })
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

        this.controls.value.setValue(value);

        this.onNodeUpdate?.(this.controls.value);

        return { value };
    }

    toParseNode() : ParseNode {
        return {
            id: this.id,
            type: this.type,
            value: this.controls.value.value || 0
        }
    }
}