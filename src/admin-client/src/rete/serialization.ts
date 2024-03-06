import {ClassicPreset, NodeEditor} from "rete";
import {Connection, ConnProps, Schemes, SkogNode} from "./nodes/types";
import {DataflowEngine} from "rete-engine";
import {AreaPlugin} from "rete-area-plugin";
import {process} from "./editor";
import {getSkogNodeFromNodeType} from "./utility/utility";
import {NumberNode} from "./nodes/numberNode";
import {BinaryNode} from "./nodes/binaryNode";
import {OutputNode} from "./nodes/outputNode";
import {LabelNode} from "./nodes/labelNode";
import {NumberInputNode} from "./nodes/numberInputNode";


export async function importGraph(
    data: any,
    editor: NodeEditor<Schemes>,
    engine:DataflowEngine<Schemes>,
    area: AreaPlugin<Schemes, any>
){

    return new Promise<void>(async (resolve, reject) => {


        if(!data) {
            reject();
            return;
        }

        const onValueUpdate = process(engine, editor);
        const updateNodeRender = (c:  ClassicPreset.InputControl<"number", number>) => { area.update("control",c.id) }

        let totalConnections: ConnProps[]  = [];

        for await (const { id, controls, type, xy , connections} of data.nodes) {
            let node = getSkogNodeFromNodeType(
                type,
                onValueUpdate,
                updateNodeRender
            );

            if(!node) {
                reject("Invalid node type found in file");
            } else {
                if(!(node instanceof OutputNode) && !(node instanceof LabelNode) && !(node instanceof NumberInputNode)) {
                    node.controls.value.setValue(controls.value.value);
                    console.log("Not instance of input or output")
                } else {
                    console.log("Instance of input or output")
                }

                // node.controls.description.setValue(controls.description.value);
                node.id = id;
                node.xTranslation = xy[0];
                node.yTranslation = xy[1];

                totalConnections.push(...connections);
                await editor.addNode(node);
                await area.translate(node.id, { x: node.xTranslation, y: node.yTranslation });
            }
        }

        for await (const connection of totalConnections) {
            editor.addConnection(connection)
                .catch((e) => console.log(e))
                .then(() => {});
        }

        resolve();
    });
}


export async function exportGraph(editor: NodeEditor<Schemes>) : Promise<any> {

    const data: any = { nodes: [] };
    const nodes = editor.getNodes() as SkogNode[];
    const connections = editor.getConnections() as Connection<NumberNode, BinaryNode>[];

    for (const node of nodes) {
        const inputsEntries = Object.entries(node.inputs).map(([key, input]) => {
            return [key, input && serializePort(input)];
        });
        const outputsEntries = Object.entries(node.outputs).map(([key, output]) => {
            return [key, output && serializePort(output)];
        });
        const controlsEntries = Object.entries(node.controls).map(
            ([key, control]) => {
                return [key, control && serializeControl(control)];
            }
        );

        data.nodes.push({
            id: node.id,
            label: node.label,
            xy: [node.xTranslation, node.yTranslation],
            type: node.type,
            outputs: Object.fromEntries(outputsEntries),
            inputs: Object.fromEntries(inputsEntries),
            controls: Object.fromEntries(controlsEntries),
            connections: []
        });

        data.nodes.map((node: any) => {
            for(const connection of connections){
                if(
                    connection.source === node.id &&
                    node.connections.find((e:any)=>e.id === connection.id) === undefined
                ) {

                    node.connections.push(serializeConnection(connection));
                }
            }
            return node;
        });
    }
    return data;
}


function serializePort(
    port:
        | ClassicPreset.Input<ClassicPreset.Socket>
        | ClassicPreset.Output<ClassicPreset.Socket>
) {
    return {
        id: port.id,
        label: port.label,
        socket: {
            name: port.socket.name
        }
    };
}

function serializeControl(control: ClassicPreset.Control) {
    if (control instanceof ClassicPreset.InputControl) {
        return {
            __type: "ClassicPreset.InputControl" as const,
            id: control.id,
            readonly: control.readonly,
            type: control.type,
            value: control.value
        };
    }
    return null;
}

function serializeConnection(
    connection: Connection<NumberNode, BinaryNode>
) {
    return {
        id: connection.id,
        source: connection.source,
        sourceOutput: connection.sourceOutput,
        target: connection.target,
        targetInput: connection.targetInput
    };
}
