import {BaseNode, NodeControl} from "./baseNode";
import {ClassicPreset} from "rete";
import {InputType, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {NumberInputData} from "../customControls/inputNodeControls/number/numberInputControlData";
import {getLegalValueInRange, isInRange} from "../../components/input/numberInputField";
import {NumberInputNode as ParseNumberInputNode} from "@skogkalk/common/dist/src/parseTree/nodes/inputNode";
import {NumberSocket} from "../sockets/sockets";


/**
 * Node whose value can be set by the user.
 */
export class NumberInputNode extends BaseNode<
    {},
    { value: NumberSocket },
    {
        c: NodeControl<NumberInputData>
    }
> {
    legalValues: {min: number, max: number}[] = []

    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        protected updateDataFlow: () => void,
        private updateStore: () => void,
        id?: string
    ) {
        super( NodeType.NumberInput, 400, 400, "Number Input", id);

        const initialData: NumberInputData = {
            id: this.id,
            name: "",
            simpleInput: true,
            defaultValue: 0,
            legalValues: [],
            pageName: "",
            infoText: ""
        }

        this.addControl( "c",new NodeControl(
            initialData,
            {
                onUpdate: (newValue: Partial<NumberInputData>) => {
                    const defaultValue = this.controls.c.get('defaultValue');
                    if(newValue.legalValues !== undefined && defaultValue !== undefined && newValue.legalValues.length > 0) {
                        if(!newValue.legalValues.some((v) => {
                            return isInRange(defaultValue!, v);
                        })) {
                            this.controls.c.setNoUpdate({defaultValue: getLegalValueInRange(defaultValue, newValue.legalValues[0])})
                        }
                    }



                    if(this.controls.c.options.minimized) {
                        this.width = this.originalWidth * 0.7;
                        this.height = this.originalHeight * 0.5;
                    } else {
                        this.width = this.originalWidth;
                        this.height = this.originalHeight + this.controls.c.get('legalValues').length * 60;
                    }
                    this.updateNodeRendering?.(this.id);
                    this.updateDataFlow?.();
                    this.updateStore();
                },
                minimized: false
            },
            this.type
        ));

        this.addOutput("value", new ClassicPreset.Output(new NumberSocket(), "Number"));
        this.updateStore();
    }

    data(): { value: number } {
        return {
            value: this.controls.c.get('defaultValue') || 0
        };
    }

    toParseNode(): ParseNumberInputNode {
        this.controls.c.setNoUpdate({id: this.id})
        return {
            id: this.id,
            value: this.controls.c.get('defaultValue') || 0,
            type: NodeType.NumberInput,
            inputType: InputType.Float, //TODO: add to controller
            defaultValue: this.controls.c.get('defaultValue') || 0,
            name: this.controls.c.get('name') || "",
            pageName: this.controls.c.get('pageName') || "",
            legalValues: this.controls.c.get('legalValues').map(legal=>{return {max: legal.max || null, min: legal.min || null}}) || [], //TODO: Change to undefined
            unit: "", //TODO: Add to controller,
            infoText: this.controls.c.get('infoText') || "",
            ordering: 0, // TODO: Add to controller,
            simpleInput: this.controls.c.get('simpleInput') || false,
        }
    }
}