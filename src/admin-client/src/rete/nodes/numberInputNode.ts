import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {InputType, NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {NumberInputControl} from "../customControls/inputNodeControls/number/numberInputControl";
import {getLegalValueInRange, isInRange} from "../../components/input/numberInputField";
import {InputBaseControl} from "../customControls/inputNodeControls/common/inputBaseControl";
import {NumberInputNode as ParseNumberInputNode} from "@skogkalk/common/dist/src/parseTree/nodes/inputNode";


/**
 * Node whose value can be set by the user.
 */
export class NumberInputNode extends BaseNode<
    {},
    { value: ClassicPreset.Socket },
    {
        baseInputData: NumberInputControl
    }
> {
    legalValues: {min: number, max: number}[] = []

    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        protected updateDataFlow: () => void
    ) {
        super(NodeType.NumberInput, 400, 400, "Number Input");

        this.addControl( "baseInputData",new NumberInputControl(
            {
                name: "",
                simpleInput: true,
                defaultValue: 0,
            },
            [],
            {
                onUpdate: (newValue: InputBaseControl) => {
                    if(!(newValue instanceof NumberInputControl)) {
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
                    updateNodeRendering?.(this.id);
                    updateDataFlow?.();
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

    toParseNode(): ParseNumberInputNode {
        return {
            id: this.id,
            value: this.controls.baseInputData.defaultValue || 0,
            type: NodeType.NumberInput,
            inputType: InputType.Float, //TODO: add to controller
            defaultValue: this.controls.baseInputData.defaultValue || 0,
            name: this.controls.baseInputData.name || "",
            pageName: this.controls.baseInputData.pageName || "",
            legalValues: this.controls.baseInputData.legalValues.map(legal=>{return {max: legal.max || null, min: legal.min || null}}) || [], //TODO: Change to undefined
            unit: "", //TODO: Add to controller,
            infoText: this.controls.baseInputData.infoText || "",
            ordering: 0, // TODO: Add to controller,
            simpleInput: this.controls.baseInputData.simpleInput
        }
    }
}