import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";


export class LabelNode extends BaseNode<
    {},
    {value: ClassicPreset.Socket},
    {label: ClassicPreset.InputControl<"text">, description: ClassicPreset.InputControl<"text">}
> {
    constructor(
        private onStateUpdate: () => void
    ) {
        super(NodeType.Number, "Label"); // TODO: Add meta nodes
        this.height = 180;
        this.addOutput(
            "value",
            new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Label Name"),
        )
        this.addControl(
            "label",
            new ClassicPreset.InputControl("text", {
                initial: "",
                change: onStateUpdate
            })
        )
        this.addControl(
            "description",
            new ClassicPreset.InputControl("text"),
        )
    }

    data() : {value: string} {
        const value = this.controls.label.value;
        console.log(value);
        return { value: (value ?? "") }
    }
}