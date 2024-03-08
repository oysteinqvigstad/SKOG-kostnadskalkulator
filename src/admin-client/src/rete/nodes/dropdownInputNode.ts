import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DropdownInputControl} from "../customControls/inputNodeControls/dropdown/dropdownInputControl";
import {InputBaseControl} from "../customControls/inputNodeControls/common/inputBaseControl";




/**
 * Node whose value can be set by the user.
 */
export class DropdownInputNode extends BaseNode<
    {},
    { value: ClassicPreset.Socket },
    {
        value: ClassicPreset.InputControl<"number">,
        description: ClassicPreset.InputControl<"text">,
        baseInputData: DropdownInputControl
    }
> {
    inputAlternatives: {label: string, value: number}[] = []

    constructor(
        onValueChange?: () => void, // function to be called on user changing value
        onNodeUpdate?: (nodeID: string) => void // function that updates node rendering
    ) {
        super(NodeType.NumberInput, 400, 400, "Dropdown Input");

        this.addControl("baseInputData", new DropdownInputControl(
            {
                name: "",
                simpleInput: true,
            },
            [],
            {
                onUpdate: (newValue: InputBaseControl) => {
                    if(newValue instanceof DropdownInputControl) {
                        onValueChange?.();
                        this.controls.baseInputData.name = newValue.name;
                        this.controls.baseInputData.simpleInput = newValue.simpleInput;
                        this.controls.baseInputData.infoText = newValue.infoText;
                        this.controls.baseInputData.dropdownOptions = newValue.dropdownOptions;

                        if(newValue.options.minimized) {
                            this.width = this.originalWidth * 0.5;
                            this.height = this.originalHeight * 0.5;
                        } else {
                            this.width = this.originalWidth;
                            this.height = this.originalHeight;
                        }
                        onNodeUpdate?.(this.id);
                        onValueChange?.();
                    } else {
                        throw new Error("Invalid instance of InputBasicControl in DropdownInputNode constructor.");
                    }
                },
                minimized: false
            }
        ));


        this.addControl(
            "description",
            new ClassicPreset.InputControl("text", { initial: "description" })
        );
        this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Number"));
    }

    data(): { value: number } {
        return {
            value: this.controls.baseInputData.dropdownOptions.find((option)=>{return option.label === this.controls.baseInputData.defaultKey})?.value || 0
        };
    }
}