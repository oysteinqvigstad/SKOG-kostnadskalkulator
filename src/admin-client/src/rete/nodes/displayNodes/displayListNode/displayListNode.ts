import {ParseableBaseNode} from "../../parseableBaseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DisplayPreviewNode as ParseDisplayPreviewNode } from "@skogkalk/common/dist/src/parseTree"
import {ResultSocket} from "../../../sockets";
import {
    DisplayListNodeControlContainer
} from "./displayListNodeControlContainer";
import {NodeControl} from "../../nodeControl";
import {DisplayListNodeData} from "./displayListNodeControlData";
import {DisplayBarNodeData} from "../displayBarNode/displayBarNodeControlData";


export class DisplayListNode extends ParseableBaseNode <
    { input: ResultSocket},
    {},
    { c: NodeControl<DisplayListNodeData> }
> {
    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        private updateStore: () => void,
        id?: string,
    ) {
        super(NodeType.ListDisplay, 600, 400, "List", id);

        this.addInput("input",
            new ClassicPreset.Input(
                new ResultSocket(),
                "Result",
                true))

        const initialControlData: DisplayListNodeData = {
            nodeID: this.id,
            name: "",
            unit: "",
            inputs: [],
        }
        this.addControl("c",
            new NodeControl(
                initialControlData,
                {
                    onUpdate: () => {
                        updateNodeRendering(this.id);
                        updateStore();

                    },
                    minimized: false
                },
                DisplayListNodeControlContainer
            )
        );
    }

    data( inputs :{ input?: {name: string, value: number, id: string , color: string}[] }) : {} {
        const { input } = inputs
        if(input) {
            this.controls.c.setNoUpdate({inputs: input.map((node, index)=>{return { label: node.name, id: node.id, value: node.value, color: node.color, ordering: index}})});
            this.updateStore();
        }
        this.updateNodeRendering?.(this.id);
        return {}
    }

    serializeControls(): any {
        return this.controls.c.getData();
    }

    deserializeControls(serializedData: any): void {
        this.controls.c.setNoUpdate(serializedData)
    }

    toParseNode() : ParseDisplayPreviewNode {
        this.controls.c.setNoUpdate({nodeID: this.id})
        return {
            id: this.id,
            unit: this.controls.c.get("unit"),
            type: NodeType.ListDisplay,
            value: 0,
            inputs: [],
            name: this.controls.c.get("name"),
            inputOrdering: this.controls.c.get('inputs').map(input=>{return {outputID: input.id, outputLabel: input.label}}),
        }
    }

    protected updateDataFlow: () => void = () => {}
}