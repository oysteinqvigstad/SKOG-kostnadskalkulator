import {BaseNode} from "./baseNode";
import {DisplayOptions, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset} from "rete";


export class OutputNode extends BaseNode <
{result: ClassicPreset.Socket, groupName: ClassicPreset.Socket},
{},
{
    value: ClassicPreset.InputControl<"number">,
    description: ClassicPreset.InputControl<"text">,
    groupName: ClassicPreset.InputControl<"text">
}
> {
    displayOptions: DisplayOptions[] = []

    constructor(
        private onNodeUpdate?: (control: ClassicPreset.InputControl<"number"> | ClassicPreset.InputControl<"text">) => void
    ) {
        super(NodeType.Output);

        this.addInput("result",
            new ClassicPreset.Input(
                new ClassicPreset.Socket("socket"),
                "Result",
                false))
        this.addInput("groupName",
            new ClassicPreset.Input(
                new ClassicPreset.Socket("socket"),
                "Group"
            ))
        this.addControl("value",
            new ClassicPreset.InputControl(
                "number",
                {readonly: true, }))
        this.addControl("groupName",
            new ClassicPreset.InputControl<"text", string>("text", {initial: "", readonly: true })
            )
        this.addControl(
            "description",
            new ClassicPreset.InputControl("text", { initial: "description" })
        );
    }

    data( inputs :{ result: number, groupName: string }) : {} {
        const { result, groupName } = inputs

        this.onNodeUpdate?.(this.controls.value);
        this.onNodeUpdate?.(this.controls.groupName);
        this.controls.groupName.setValue(groupName);
        this.controls.value.setValue(result);
        console.log( {value: (this.controls.value.value), group: (this.controls.groupName.value)});
        return {}
    }
}