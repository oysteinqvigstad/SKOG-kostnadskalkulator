import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {InputType, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DropdownInputControl} from "../customControls/inputNodeControls/dropdown/dropdownInputControl";
import {InputBaseControl} from "../customControls/inputNodeControls/common/inputBaseControl";
import {DropdownInput} from "@skogkalk/common/src/parseTree"



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
        protected updateNodeRendering: (nodeID: string) => void, // function that updates node rendering
        protected updateDataFlow: () => void, // function to be called on user changing value
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
                        this.updateDataFlow?.();
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
                        this.updateNodeRendering?.(this.id);
                        this.updateDataFlow?.();
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

    toParseNode() : DropdownInput {
        return { // TODO: Must implement controller
            id: this.id,
            value: this.controls.baseInputData.defaultValue || 0,
            type: NodeType.DropdownInput,
            defaultValue: this.controls.baseInputData.defaultValue || 0,
            name: this.controls.baseInputData.name || "",
            pageName: this.controls.baseInputData.pageName || "",
            dropdownAlternatives: [],
            infoText: this.controls.baseInputData.infoText || "",
            ordering: 0, // TODO: Add to controller,
            simpleInput: this.controls.baseInputData.simpleInput
        }
    }
}