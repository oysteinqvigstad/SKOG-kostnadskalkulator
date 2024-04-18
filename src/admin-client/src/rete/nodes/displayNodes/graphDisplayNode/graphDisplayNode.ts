import {ParseableBaseNode} from "../../parseableBaseNode";
import {ResultSocket} from "../../../sockets";
import {NodeControl} from "../../nodeControl";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset} from "rete";
import {GraphDisplayNodeControlData} from "./graphDisplayNodeControlData";
import {GraphDisplayNodeControlContainer} from "./graphDisplayNodeControlContainer";
import {GraphDisplayNode as ParseGraphDisplayNode} from "@skogkalk/common/src/parseTree";


export class GraphDisplayNode extends ParseableBaseNode <
    { input: ResultSocket },
    {},
    { c: NodeControl<GraphDisplayNodeControlData> }
> {
    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        private updateStore: () => void,
        id?: string,
    ) {
        super(NodeType.GraphDisplay, 600, 400, "Graph Display", id);
        console.log("graph constructor id", this.id);

        this.addInput("input",
            new ClassicPreset.Input(
                new ResultSocket(),
                "Result",
                true))

        const initialControlData: GraphDisplayNodeControlData = {
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
                GraphDisplayNodeControlContainer
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

    deserializeControls(data: any) {
        this.controls.c.set(data);
    }

    toParseNode() : ParseGraphDisplayNode {
        console.log("graphid", this.id);
        this.controls.c.setNoUpdate({nodeID: this.id})
        return {
            unit: this.controls.c.get('unit'),
            name: this.controls.c.get('name'),
            inputs: [],
            inputOrdering: [],
            id: this.id,
            type: NodeType.GraphDisplay,
            value: 0,
            arrangement: {
                xs: this.controls.c.get('arrangement')?.xs ?? {order: 0, span: 12},
                md: this.controls.c.get('arrangement')?.md ?? {order: 0, span: 6},
                lg: this.controls.c.get('arrangement')?.lg ?? {order: 0, span: 4},
            }
        }
    }

    protected updateDataFlow: () => void = () => {}
}