import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {InputBasicControl, NumberInputBaseControls} from "../customControls/inputNodeControl/number/inputNodeControl";
import {getLegalValueInRange, isInRange} from "../customControls/commonComponents/numberInputField";



/**
 * Node whose value can be set by the user.
 */
export class NumberInputNode extends BaseNode<
    {},
    { value: ClassicPreset.Socket },
    {
        baseInputData: NumberInputBaseControls
    }
> {
    legalValues: {min: number, max: number}[] = []

    constructor(
        onValueChange?: () => void, // function to be called on user changing value
        onNodeUpdate?: (nodeID: string) => void // function that updates node rendering
    ) {
        super(NodeType.NumberInput, 400, 400, "Number Input");

        this.addControl("baseInputData", new NumberInputBaseControls(
            {
                name: "",
                simpleInput: true,
                defaultValue: 0,
            },
            [],
            {
                onUpdate: (newValue: InputBasicControl) => {
                    if(!(newValue instanceof NumberInputBaseControls)) {
                        throw new Error("Invalid instance of InputBasicControl in NumberInputNode constructor.");
                    }
                    this.controls.baseInputData.name = newValue.name;
                    this.controls.baseInputData.pageName = newValue.pageName;
                    this.controls.baseInputData.simpleInput = newValue.simpleInput;
                    this.controls.baseInputData.infoText = newValue.infoText;
                    this.controls.baseInputData.legalValues = newValue.legalValues;

                    if(this.controls.baseInputData.defaultValue !== undefined && newValue.legalValues.length > 0) {
                        if(!newValue.legalValues.some((v) => {
                            return isInRange(this.controls.baseInputData.defaultValue!, v);
                        })) {
                            this.controls.baseInputData.defaultValue =
                                getLegalValueInRange(this.controls.baseInputData.defaultValue!, newValue.legalValues[0]);
                        }
                    }


                    if(newValue.options.minimized) {
                        this.width = this.originalWidth * 0.7;
                        this.height = this.originalHeight * 0.5;
                    } else {
                        this.width = this.originalWidth;
                        this.height = this.originalHeight + this.controls.baseInputData.legalValues.length * 60;
                    }
                    onNodeUpdate?.(this.id);
                    onValueChange?.();
                },
                minimized: false
            }

        ));

        this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Number"));
    }

    data(): { value: number } {
        return {
            value: this.controls.baseInputData.defaultValue || 0
        };
    }
}