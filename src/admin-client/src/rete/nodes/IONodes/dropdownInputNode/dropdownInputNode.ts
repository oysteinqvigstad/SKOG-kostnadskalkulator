import {ParseableBaseNode} from "../../parseableBaseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DropdownInput} from "@skogkalk/common/dist/src/parseTree"
import {DropdownInputControlData} from "./dropdownInputControlData";
import {NumberSocket} from "../../../sockets";
import {
    DropdownInputControlContainer
} from "./dropdownInputControlContainer";
import {NodeControl} from "../../nodeControl";
import {NumberNodeOutput} from "../../types";



/**
 * Node whose value can be set by the user.
 */
export class DropdownInputNode extends ParseableBaseNode<
    {},
    { out: NumberSocket },
    DropdownInputControlData
> {
    inputAlternatives: {label: string, value: number}[] = []

    constructor(
        protected updateNodeRendering: (nodeID: string) => void, // function that updates node rendering
        protected updateDataFlow: () => void, // function to be called on user changing value
        private updateStore: () => void,
        id?: string,
    ) {
        super(NodeType.DropdownInput, 400, 400, "Dropdown Input", id);

        const initialControlData: DropdownInputControlData = {
            id: this.id,
            name: "",
            simpleInput: true,
            dropdownOptions: [],
            defaultKey: "",
            defaultValue: 0,
            infoText: "",
            pageOrdering: 0,
            unit: ""

        }

        this.addControl("c", new NodeControl(
            initialControlData,
            {
                onUpdate: () => {
                    if(this.controls.c.options.minimized) {
                        this.width = this.originalWidth * 0.5;
                        this.height = this.originalHeight * 0.5;
                    } else {
                        this.width = this.originalWidth;
                        this.height = this.originalHeight + this.controls.c.get('dropdownOptions').length * 60;
                    }
                    this.updateNodeRendering(this.id);
                    this.updateDataFlow();
                    this.updateStore();
                },
                minimized: false
            },
            this.type,
            DropdownInputControlContainer
        ));

        this.addOutput("out", new ClassicPreset.Output(new NumberSocket(), "Number"));
        this.updateStore();
    }

    data(): { out: NumberNodeOutput } {
        return {
            out: {
                sourceID: this.id,
                value: this.controls.c.get('dropdownOptions').find((option)=>{return option.label === this.controls.c.get('defaultKey')})?.value || 0
            }
        };
    }

    toParseNode() : DropdownInput {
        this.controls.c.setNoUpdate({id: this.id})
        return { // TODO: Must implement controller
            id: this.id,
            value: this.controls.c.get('defaultValue') || 0,
            type: NodeType.DropdownInput,
            defaultValue: this.controls.c.get('defaultValue') || 0,
            name: this.controls.c.get('name') || "",
            pageName: this.controls.c.get('pageName') || "",
            dropdownAlternatives: this.controls.c.get('dropdownOptions')?.map(({value, label})=>{return {value, label}}) || [],
            infoText: this.controls.c.get('infoText') || "",
            ordering: this.controls.c.get('pageOrdering') || 0,
            simpleInput: this.controls.c.get('simpleInput') || false,
            unit: this.controls.c.get('unit') || ""
        }
    }
}