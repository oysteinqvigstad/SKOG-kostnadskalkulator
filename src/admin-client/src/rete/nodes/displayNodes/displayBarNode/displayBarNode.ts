import {ParseableBaseNode} from "../../parseableBaseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {DisplayBarNode as ParseDisplayBarNode} from "@skogkalk/common/dist/src/parseTree"
import {ResultSocket} from "../../../sockets";
import {NodeControl} from "../../nodeControl";
import {DisplayBarNodeData} from "./displayBarNodeControlData";
import {DisplayBarNodeControlContainer} from "./displayBarNodeControlContainer";


export class DisplayBarNode extends ParseableBaseNode <
    { input: ResultSocket },
    {},
    DisplayBarNodeData
> {
    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        private updateStore: () => void,
        id?: string,
    ) {
        super(NodeType.BarDisplay, 600, 400, "Bar Chart", id);

        this.addInput("input",
            new ClassicPreset.Input(
                new ResultSocket(),
                "Result",
                true))

        const initialControlData: DisplayBarNodeData = {
            nodeID: this.id,
            name: "",
            unit: "",
            max: 100,
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
                this.type,
                DisplayBarNodeControlContainer
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

    toParseNode() : ParseDisplayBarNode {
        this.controls.c.setNoUpdate({nodeID: this.id})
        return {
            id: this.id,
            unit: this.controls.c.get("unit"),
            max: this.controls.c.get("max"),
            type: NodeType.BarDisplay,
            value: 0,
            inputs: [],
            name: this.controls.c.get("name"),
            inputOrdering: this.controls.c.get('inputs').map(input=>{return {outputID: input.id, outputLabel: input.label}}),
        }
    }

    protected updateDataFlow: () => void = () => {}
}