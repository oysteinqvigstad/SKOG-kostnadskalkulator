import {BaseNode, NodeControl} from "./baseNode";
import {ClassicPreset} from "rete";
import {InputType, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DropdownInput} from "@skogkalk/common/src/parseTree"
import {DropdownInputControlData} from "../customControls/inputNodeControls/dropdown/dropdownInputControlData";



/**
 * Node whose value can be set by the user.
 */
export class DropdownInputNode extends BaseNode<
    {},
    { value: ClassicPreset.Socket },
    {
        c: NodeControl<DropdownInputControlData>
    }
> {
    inputAlternatives: {label: string, value: number}[] = []

    constructor(
        protected updateNodeRendering: (nodeID: string) => void, // function that updates node rendering
        protected updateDataFlow: () => void, // function to be called on user changing value
    ) {
        super(NodeType.DropdownInput, 400, 400, "Dropdown Input");

        const initialControlData: DropdownInputControlData = {
            name: "",
            simpleInput: true,
            dropdownOptions: [],
            defaultKey: "",
            defaultValue: 0,
        }

        this.addControl("c", new NodeControl(
            initialControlData,
            {
                onUpdate: (newValue: DropdownInputControlData) => {

                    if(this.controls.c.options.minimized) {
                        this.width = this.originalWidth * 0.5;
                        this.height = this.originalHeight * 0.5;
                    } else {
                        this.width = this.originalWidth;
                        this.height = this.originalHeight;
                    }
                    this.updateNodeRendering(this.id);
                    this.updateDataFlow();
                },
                minimized: false
            },
            this.type
        ));

        this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Number"));
    }

    data(): { value: number } {
        return {
            value: this.controls.c.get('dropdownOptions').find((option)=>{return option.label === this.controls.c.get('defaultKey')})?.value || 0
        };
    }

    toParseNode() : DropdownInput {
        return { // TODO: Must implement controller
            id: this.id,
            value: this.controls.c.get('defaultValue') || 0,
            type: NodeType.DropdownInput,
            defaultValue: this.controls.c.get('defaultValue') || 0,
            name: this.controls.c.get('name') || "",
            pageName: this.controls.c.get('pageName') || "",
            dropdownAlternatives: [],
            infoText: this.controls.c.get('infoText') || "",
            ordering: 0, // TODO: Add to controller,
            simpleInput: this.controls.c.get('simpleInput') || false,
        }
    }
}