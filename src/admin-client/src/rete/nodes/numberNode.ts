import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";

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
        super(NodeType.Number, 160, 180);

        this.clone = () => new NumberNode(this.controls.value.value || 0);

        this.addControl(
            "value",
            new ClassicPreset.InputControl("number", { initial: initialValue, change: onValueChange })
        );
        this.addControl(
            "description",
            new ClassicPreset.InputControl("text", { initial: "description" })
        );
        this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Number"));
    }

    data(): { value: number } {
        this.clone = () => new NumberNode(this.controls.value.value || 0);
        return {
            value: this.controls.value.value || 0
        };
    }

    toParseNode(): ParseNode {
        return {
            id: this.id,
            value: this.controls.value.value || 0,
            type: this.type
        }
    }
}