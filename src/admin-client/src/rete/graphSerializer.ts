import {ClassicPreset, getUID, NodeEditor} from "rete";
import {Connection, ConnProps, Schemes, ReteNode} from "./nodes/types";
import {AreaPlugin} from "rete-area-plugin";
import {NumberNode} from "./nodes/mathNodes/numberNode";
import {BinaryNode} from "./nodes/mathNodes/binaryNode";
import {NodeControl} from "./nodes/parseableBaseNode";
import {NodeFactory} from "./nodeFactory";


/**
 * Class responsible for writing and reading graph state to a parseable format.
 */
export class GraphSerializer {
    constructor(
        private editor: NodeEditor<Schemes>,
        private factory: NodeFactory,
        private area?: AreaPlugin<Schemes, any>
    ) {}

    /**
     * imports nodes from data exported by exportNodes
     * @param data
     * @param freshIDs if true, IDs are replaced with new UIDs
     */
    public async importNodes(data: any, freshIDs?: boolean){
        return new Promise<void>(async (resolve, reject) => {

            if(!data) {
                reject();
                return;
            }

            let totalConnections: ConnProps[]  = [];

            const idMap = new Map<string, string>();

            for await (const { id, controls, type, xy , connections} of data.nodes) {

                let node = this.factory.createNode(type, id);

                if(!node) {
                    reject("Invalid node type found in file");
                } else {
                    node.controls.c.set(controls.c.data);
                    node.xTranslation = xy[0];
                    node.yTranslation = xy[1];
                    if(freshIDs) {
                        const newID = getUID();
                        idMap.set(node.id, newID);
                        node.id = newID;
                    }

                    totalConnections.push(...connections);

                    await this.editor.addNode(node);
                    if(this.area) {
                        await this.area.translate(node.id, { x: node.xTranslation, y: node.yTranslation });
                    }
                }
            }

            for await (const connection of totalConnections) {
                if(freshIDs) {
                    connection.source = idMap.get(connection.source) || "";
                    connection.target = idMap.get(connection.target) || "";
                }
                this.editor.addConnection(connection)
                    .catch((e) => console.log(e))
                    .then(() => {});
            }

            if(freshIDs) {
                this.editor.getNodes().forEach(node=>{node.id = ""})
            }

            resolve();
        });
    }


    /**
     * Exports node structure as a data structure that can later be read with importNodes()
     */
    public exportNodes() : any {

        const data: any = { nodes: [] };
        const nodes = this.editor.getNodes() as ReteNode[];
        const connections = this.editor.getConnections() as Connection<NumberNode, BinaryNode>[];

        for (const node of nodes) {
            const inputsEntries = Object.entries(node.inputs).map(([key, input]) => {
                return [key, input && this.serializePort(input)];
            });
            const outputsEntries = Object.entries(node.outputs).map(([key, output]) => {
                return [key, output && this.serializePort(output)];
            });
            const controlsEntries = Object.entries(node.controls).map(
                ([key, control]) => {
                    return [key, control && this.serializeControl(control)];
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

                        node.connections.push(this.serializeConnection(connection));
                    }
                }
                return node;
            });
        }
        return data;
    }

    private serializePort(
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

    private serializeControl(control: ClassicPreset.Control) {
        if (control instanceof ClassicPreset.InputControl) {
            return {
                __type: "ClassicPreset.InputControl" as const,
                id: control.id,
                readonly: control.readonly,
                type: control.type,
                value: control.value
            };
        }
        if (control instanceof NodeControl) {
            return {
                data: control.getData()
            }
        }
        return null;
    }

    private serializeConnection(
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
}

