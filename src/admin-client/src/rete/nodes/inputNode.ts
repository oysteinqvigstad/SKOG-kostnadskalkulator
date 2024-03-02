import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {DropdownValuesControl} from "../customControls/dropdownValues";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {InputAlternative} from "@skogkalk/common/dist/src/parseTree/nodes/nodeMeta/input";
import {DropdownSelectionControl} from "../customControls/dropdownSelection";

/**
 * Node whose value can be set by the user.
 */
export class InputNode extends BaseNode<
    {},
    { value: ClassicPreset.Socket },
    {
        value: ClassicPreset.InputControl<"number">,
        description: ClassicPreset.InputControl<"text">,
        dropdown: DropdownValuesControl
        dropdownSelection: DropdownSelectionControl
    }
> {
    inputAlternatives: InputAlternative[] = []

    constructor(
        initialValue: number,
        onValueChange?: () => void // function to be called on user changing value
    ) {
        super(NodeType.Number, "Dropdown Input");
        this.height = 400;
        this.width = 400;


        this.addControl(
            "value",
            new ClassicPreset.InputControl("number", { initial: initialValue, change: onValueChange })
        );


        this.addControl(
            "dropdownSelection",
            new DropdownSelectionControl(
                "dropdownSelection",
                this.inputAlternatives,
                (input) => {
                    this.controls.value.setValue(input.value);
                }
            )
            )

        this.addControl("dropdown", new DropdownValuesControl("dropdown",
            [],
            (dropdownAlternatives) => {
                this.controls.dropdownSelection.setInitialState(dropdownAlternatives);
                this.inputAlternatives = dropdownAlternatives;
            })
        );

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