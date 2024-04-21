import {ParseableBaseNode} from "../../parseableBaseNode";
import {ResultSocket} from "../../../sockets";
import {NodeControl} from "../../nodeControl";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset, getUID} from "rete";
import {GraphDisplayGroupData, GraphDisplayNodeControlData} from "./graphDisplayNodeControlData";
import {GraphDisplayGroupControlContainer, GraphDisplayNodeControlContainer} from "./graphDisplayNodeControlContainer";
import {GraphDisplayNode as ParseGraphDisplayNode} from "@skogkalk/common/src/parseTree";


interface SerializedControls {
    mainControlData: GraphDisplayNodeControlData,
    inputControlData: { key: string, data: GraphDisplayGroupData }[]
}


export class GraphDisplayNode extends ParseableBaseNode <
    Record<string, ResultSocket>,
    {},
    { c: NodeControl<GraphDisplayNodeControlData> }
> {
    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        private updateStore: () => void,
        private removeConnection: (nodeID: string, connection?:{input?:string, output?:string}) => void,
        id?: string,
    ) {
        super(NodeType.GraphDisplay, 600, 400, "Graph Display", id);

        const initialControlData: GraphDisplayNodeControlData = {
            shouldAddGroup: false,
            resultGrouping: [],
            inputFieldShow: [],
            nodeID: this.id,
            name: "",
            unit: "",
            inputs: [],
        }
        this.addControl("c",
            new NodeControl(
                initialControlData,
                {
                    onUpdate: (data: Partial<GraphDisplayNodeControlData>) => {
                        if(data.shouldAddGroup) {
                            data.shouldAddGroup = false;
                        }
                        updateNodeRendering(this.id);
                        updateStore();
                    },
                    minimized: false
                },
                GraphDisplayNodeControlContainer
            )
        );
    }

    data( inputs : Record<string, {name: string, value: number, id: string , color: string}[]>) : {} {
        const groupIDs = Object.keys(inputs);
        for(const groupID of groupIDs) {

            const results = inputs[groupID];
            const resultIDs = results.map(result=>result.id);
            let oldResults = [...this.controls.c.get('inputs')]
                .filter(inputNode=>!resultIDs.includes(inputNode.id));
            const inputData = results.map((node, index)=>{
                return { label: node.name, id: node.id, value: node.value, color: node.color, ordering: index}
            });
            inputData.push(...oldResults);

            const inputGroups = [...this.controls.c.get('resultGrouping')];
            const inputGroup = inputGroups.find(group=>group.id === groupID);
            if(!inputGroup) { throw new Error("Invalid input group found in control c of DisplayGraph node")}
            inputGroup.inputIDs = resultIDs;

            this.controls.c.setNoUpdate({inputs: inputData, resultGrouping: inputGroups});

            this.updateStore();
        }

        this.updateNodeRendering?.(this.id);
        return {}
    }


    addInputGroup(inputID?: string) {
        if(!inputID) inputID = getUID();
        this.addInput(inputID, new ClassicPreset.Input(new ResultSocket(), "Result", true));
        const control = new NodeControl<GraphDisplayGroupData>(
            { id: inputID, name: "", shouldDelete: false, unit: "", label: "" },
            {
                onUpdate: (data: Partial<GraphDisplayGroupData>) => {
                    if(data.shouldDelete) {
                        this.removeInput(inputID!);
                        this.removeConnection(this.id, {input: inputID});
                        const resultGroups = [...this.controls.c.get('resultGrouping')]
                            .filter(group=>{
                                return (this.inputs[inputID!]?.control as NodeControl<GraphDisplayGroupData> | undefined)?.get('id') === group.id
                            });

                        this.controls.c.setNoUpdate({resultGrouping: resultGroups})
                    } else {
                        const oldGrouping = this.controls.c.get('resultGrouping');
                        const resultGroups = [...oldGrouping].filter(group=>group.id !== inputID);
                        const thisGroup = oldGrouping.find(group=>group.id === inputID);
                        if(thisGroup === undefined) throw new Error("Graph result group not in resultGrouping of main control");
                        thisGroup.name = data.name ?? thisGroup.name;
                        thisGroup.unit = data.unit ?? thisGroup.unit;
                        thisGroup.label = data.label ?? thisGroup.label;

                        resultGroups.push(thisGroup);
                    }

                    this.updateNodeRendering(this.id);
                    this.updateStore();
                },
                minimized: false,
            },
            GraphDisplayGroupControlContainer
        )
        this.inputs[inputID]?.addControl(control);
        const currentGroups = [...this.controls.c.get('resultGrouping')];
        currentGroups.push({
            id: control.get('id'),
            name: control.get('name'),
            inputIDs: [],
            unit: control.get('unit'),
            label: control.get('label')
        })
        this.controls.c.set({resultGrouping: currentGroups})

    }

    serializeControls(): SerializedControls {
        const inputKeys = Object.keys(this.inputs);
        let inputControls = [];
        for(const key of inputKeys) {
            inputControls.push({ key: key, data: (this.inputs[key]?.control as NodeControl<GraphDisplayGroupData>).getData()});
        }
        return {
            mainControlData: this.controls.c.getData(),
            inputControlData: inputControls
        }
    }

    deserializeControls(data: SerializedControls) {
        data.inputControlData.forEach(({key, data})=>{
            this.addInputGroup(key);
            (this.inputs[key]?.control as NodeControl<GraphDisplayGroupData>).setNoUpdate(data);
        })
        this.controls.c.set(data.mainControlData);


    }

    toParseNode() : ParseGraphDisplayNode {
        this.controls.c.setNoUpdate({nodeID: this.id})
        console.log("resultGrouping", this.controls.c.get('resultGrouping'))
        return {
            resultGroups: [...this.controls.c.get('resultGrouping')],
            displayedInputIDs: this.controls.c.get('inputFieldShow').filter(field=>field.show).map(field=>field.id),
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