import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {ButtonControl} from "../customControls/controls";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";

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
        this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Number"));
    }

    data(): { value: number } {
        return {
            value: this.controls.value.value || 0
        };
    }
}