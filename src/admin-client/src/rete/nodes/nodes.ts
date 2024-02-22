import { ClassicPreset } from "rete";
import {ButtonControl} from "./controls";
import {SkogNode} from "./types";
import {getBinaryOperation, getNaryOperation, NodeType} from "@skogkalk/common/dist/src/parseTree";

export class Connection<
    A extends SkogNode,
    B extends SkogNode
> extends ClassicPreset.Connection<A, B> {}

const socket = new ClassicPreset.Socket("socket");


export function getSkogNodeFromNodeType(
    type:NodeType,
    onValueUpdate: ()=>void,
    updateNodeRender: (c:  ClassicPreset.InputControl<"number", number>) => void
) : SkogNode | undefined {
    switch(type) {
        case NodeType.Number: return new NumberNode(0, onValueUpdate);
        case NodeType.Add: return new BinaryNode(NodeType.Add, updateNodeRender);
        case NodeType.Sub: return new BinaryNode(NodeType.Sub, updateNodeRender);
        case NodeType.Mul: return new BinaryNode(NodeType.Mul, updateNodeRender);
        case NodeType.Pow: return new BinaryNode(NodeType.Pow, updateNodeRender);
        case NodeType.Div: return new BinaryNode(NodeType.Div, updateNodeRender);
        case NodeType.Sum: return new NaryNode(NodeType.Sum, updateNodeRender);
        case NodeType.Prod: return new NaryNode(NodeType.Prod, updateNodeRender);
        default: return undefined;
    }
}


/**
 * Adds extra metadata properties to the Rete.js Node class.
 */
class BaseNode<
    Inputs extends Record<string, ClassicPreset.Socket>,
    Outputs extends Record<string, ClassicPreset.Socket>,
    Controls extends Record<string, ClassicPreset.Control>
> extends ClassicPreset.Node<Inputs, Outputs, Controls> {
    xTranslation: number = 0;
    yTranslation: number = 0;
    type: NodeType;
    width: number;
    height: number;
    parent?: string;


    constructor(
        type: NodeType,
        height: number = 230,
        width: number = 180
    ) {
        super(type.toString());
        this.type = type;
        this.height = height;
        this.width = width;
    }
}


/**
 * Node whose value can be set by the user.
 */
export class InputNode extends BaseNode<
    {},
    { value: ClassicPreset.Socket },
    {
        value: ClassicPreset.InputControl<"number">,
        description: ClassicPreset.InputControl<"text">,
        button: ButtonControl
    }
> {
    constructor(
        initialValue: number,
        onValueChange?: () => void // function to be called on user changing value
    ) {
        super(NodeType.Number);
        this.height = 400;
        this.width = 400;
        this.addControl(
            "value",
            new ClassicPreset.InputControl("number", { initial: initialValue, change: onValueChange })
        );
        this.addControl("button", new ButtonControl("Click me", () => console.log("clicked")));
        this.addControl(
            "description",
            new ClassicPreset.InputControl("text", { initial: "description" })
        );
        this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
    }

    data(): { value: number } {
        return {
            value: this.controls.value.value || 0
        };
    }
}


/**
 * Node providing a simple number value that can be manually set. Represents a constant.
 */
export class NumberNode extends BaseNode<
    {},
    { value: ClassicPreset.Socket },
    { value: ClassicPreset.InputControl<"number">, description: ClassicPreset.InputControl<"text">}
> {
    clone: () => NumberNode;
    constructor(initialValue: number, onValueChange?: () => void) {
        super(NodeType.Number);
        this.height = 160;
        this.clone = () => new NumberNode(this.controls.value.value || 0);
        this.addControl(
            "value",
            new ClassicPreset.InputControl("number", { initial: initialValue, change: onValueChange })
        );
        this.addControl(
            "description",
            new ClassicPreset.InputControl("text", { initial: "description" })
        );
        this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
    }

    data(): { value: number } {
        this.clone = () => new NumberNode(this.controls.value.value || 0);
        return {
            value: this.controls.value.value || 0
        };
    }
}


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
        super(type);

        this.type = type;
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

        this.addInput("left", new ClassicPreset.Input(socket, "Left"));
        this.addInput("right", new ClassicPreset.Input(socket, "Right"));
        this.addOutput("value", new ClassicPreset.Output(socket, "Out"));
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
}


/**
 * Node for use with math operations that can take n inputs and reduce them to
 * one single output, such as SUM and PROD.
 */
export class NaryNode extends BaseNode<
    { input: ClassicPreset.Socket },
    { value: ClassicPreset.Socket },
    { value: ClassicPreset.InputControl<"number">, description: ClassicPreset.InputControl<"text"> }
> {
    naryOperation: (inputs: number[]) => number;

    constructor(
        type: NodeType,
        private onNodeUpdate?: (control: ClassicPreset.InputControl<"number">) => void
    ) {
        super(type);

        this.naryOperation = getNaryOperation(type);
        this.type = type;
        this.height = 190;
        this.width = 180;

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

        this.addInput("input", new ClassicPreset.Input(socket, "In", true));
        this.addOutput("value", new ClassicPreset.Output(socket, "Out"));
    }

    data(inputs: { input?: number[] }): { value: number } {
        const inputControl =
            this.inputs.input?.control as ClassicPreset.InputControl<"number">;

        const input = inputs.input;
        const value = (input ? this.naryOperation(input) : inputControl?.value || 0);

        this.controls.value.setValue(value);

        this.onNodeUpdate?.(this.controls.value);

        return { value };
    }
}