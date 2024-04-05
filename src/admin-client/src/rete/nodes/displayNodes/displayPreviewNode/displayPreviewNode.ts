import {ParseableBaseNode} from "../../parseableBaseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DisplayPreviewNode as ParseDisplayPreviewNode } from "@skogkalk/common/dist/src/parseTree"
import {ResultSocket} from "../../../sockets";
import {
    DisplayPreviewNodeControlContainer
} from "./displayPreviewNodeControlContainer";
import {NodeControl} from "../../nodeControl";
import {DisplayPreviewNodeData} from "./displayPreviewNodeControlData";


export class DisplayPreviewNode extends ParseableBaseNode <
    { input: ResultSocket},
    {},
    { c: NodeControl<DisplayPreviewNodeData> }
> {
    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        private updateStore: () => void,
        id?: string,
    ) {
        super(NodeType.PreviewDisplay, 600, 400, "Preview", id);

        this.addInput("input",
            new ClassicPreset.Input(
                new ResultSocket(),
                "Result",
                true))

        const initialControlData: DisplayPreviewNodeData = {
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
                DisplayPreviewNodeControlContainer
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
        return this.controls.c.getData()
    }

    deserializeControls(serializedData: any) {
        this.controls.c.setNoUpdate(serializedData)
    }

    toParseNode() : ParseDisplayPreviewNode {
        this.controls.c.setNoUpdate({nodeID: this.id})
        return {
            id: this.id,
            unit: this.controls.c.get("unit"),
            type: NodeType.PreviewDisplay,
            value: 0,
            inputs: [],
            name: this.controls.c.get("name"),
            inputOrdering: this.controls.c.get('inputs').map(input=>{return {outputID: input.id, outputLabel: input.label}}),
        }
    }

    protected updateDataFlow: () => void = () => {}
}