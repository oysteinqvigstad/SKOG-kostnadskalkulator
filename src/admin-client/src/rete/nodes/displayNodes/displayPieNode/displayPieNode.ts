import {ParseableBaseNode, NodeControl} from "../../parseableBaseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DisplayPieNode as ParseDisplayPieNode } from "@skogkalk/common/dist/src/parseTree"
import {DisplayPieNodeData} from "./displayPieNodeControlData";
import {ResultSocket} from "../../../sockets";
import {
    DisplayPieNodeControlContainer
} from "./displayPieNodeControlContainer";


export class DisplayPieNode extends ParseableBaseNode <
    { input: ResultSocket},
    {},
    { c: NodeControl<DisplayPieNodeData> }
> {
    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        private updateStore: () => void,
        id?: string,
    ) {
        super(NodeType.Display, 600, 400, "Pie Chart", id);

        this.addInput("input",
            new ClassicPreset.Input(
                new ResultSocket(),
                "Result",
                true))

        const initialControlData: DisplayPieNodeData = {
            nodeID: this.id,
            name: "",
            unit: "",
            inputs: [],
            pieType: "pie",
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
                this.type,
                DisplayPieNodeControlContainer
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

    toParseNode() : ParseDisplayPieNode {
        this.controls.c.setNoUpdate({nodeID: this.id})
        return {
            id: this.id,
            pieType: this.controls.c.get("pieType"),
            unit: this.controls.c.get("unit"),
            type: NodeType.Display,
            value: 0,
            inputs: [],
            name: this.controls.c.get("name"),
            inputOrdering: this.controls.c.get('inputs').map(input=>{return {outputID: input.id, outputLabel: input.label}}),
        }
    }

    protected updateDataFlow: () => void = () => {}
}