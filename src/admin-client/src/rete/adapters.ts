import {Schemes, SkogNode} from "./nodes/types";
import {NodeEditor} from "rete";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {LabelNode} from "./nodes/labelNode";
import {OutputNode} from "./nodes/outputNode";


interface NodeConnection {
    id: string
    name: string
    left?: string
    right?: string
    child?: string
    inputs?: string[]
}


export function createJSONGraph(editor: NodeEditor<Schemes>) : ParseNode | undefined {
    let subtrees: (ParseNode | undefined)[] = [];
    let connections = editor.getConnections();


    const nodes = editor.getNodes() as SkogNode[];
    const nodeSet = new Map(nodes.map((node) => {
        const parsed: NodeConnection = {
            id: (node.id),
            name: (node.controls.description.value ?? "")
        }
        return [node.id, parsed]
    }));

    let nodeOutputs = new Map(nodes.map((node) => [node.id, 0]));
    let nodeInputs = new Map(nodes.map((node) => [node.id, 0]));

    connections.forEach((connection) => {
        let parentNode = nodeSet.get(connection.target);
        const targetPortName = connection.targetInput;


        if(parentNode !== undefined) {
            if(targetPortName === "result") {
                parentNode.child = connection.source;
            }
            if(targetPortName === "left") {
                parentNode.left = connection.source;
            }
            if(targetPortName === "right") {
                parentNode.right = connection.source;
            }
            if(targetPortName === "input") {
                if(parentNode.inputs !== undefined) {
                    parentNode.inputs.push(connection.source)
                } else {
                    parentNode.inputs = [connection.source]
                }
            }
            nodeSet.set(connection.target, parentNode);
        }


        nodeOutputs.set(connection.source, (nodeOutputs.get(connection.source) ?? 0) + 1);
        nodeInputs.set(connection.target, (nodeInputs.get(connection.target) ?? 0) + 1);
    });

    nodes.forEach((node) => {
        if (nodeOutputs.get(node.id) === 0) {
            subtrees.push(populateTree(nodeSet.get(node.id) ?? {id: node.id, name: node.controls.description.value ?? ""}, nodeSet, new Map(nodes.map((node) => [node.id, node]))));
        }
    });

    return subtrees[0];
}



/**
 * populateTree takes a root node and attaches children sequentially until all leaf nodes
 * have been reached.
 *
 * @param startNode A node in the tree represented as a NodeConnection. Can be any node found in connections map.
 * @param connections A map of node IDs to information about the node's children IDs. The function will throw
 * if startNode cannot be found in connections.
 * @param nodes A map from node IDs to actual node data.
 * @return The root node of the built tree represented as a ParseNode.
 */
function populateTree(startNode: NodeConnection, connections: Map<string, NodeConnection>, nodes: Map<string, SkogNode>): ParseNode {

    const rootNodeData = nodes.get(startNode.id);
    if(!rootNodeData) { throw new Error("Start node not found in nodes map")}

    const rootNode: ParseNode = {
        id: startNode.id, // Only id is needed. Rest is filled out in loop below.
        type: NodeType.Number,
        value: 0,
        description: ""
    }

    const stack: ParseNode[] = [rootNode];

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (!currentNode) {
            break;
        }

        const currentConnection = connections.get(currentNode.id);
        const currentSkogNode = nodes.get(currentNode.id);

        if(currentSkogNode === undefined) {throw new Error("Node not found");}

        currentNode.type = currentSkogNode.type;
        if(currentSkogNode !instanceof LabelNode && currentSkogNode !instanceof OutputNode) {
            //TODO: Need a more flexible way of declaring input and output controls dynamically
            // and allowing these to be parsed
            currentNode.value = currentSkogNode.controls.value.value ?? 0;
        }
        currentNode.description = currentSkogNode.controls.description.value ?? "";


        if (currentConnection?.left) {
            currentNode.left = {
                id: currentConnection.left,
                type: NodeType.Number,
                value: 0,
                description: "",
            };
            const leftNode = currentNode.left;
            stack.push(leftNode);
        }

        if (currentConnection?.right) {
            currentNode.right = {
                id: currentConnection.right,
                type: NodeType.Number,
                value: 0,
                description: "",
            };
            const rightNode = currentNode.right;
            stack.push(rightNode);
        }

        if (currentConnection?.child) {
            currentNode.child = {
                id: currentConnection.child,
                type: NodeType.Number,
                value: 0,
                description: "",
            }
            const childNode = currentNode.child;
            stack.push(childNode);
        }

        if (currentConnection?.inputs) {
            currentNode.inputs = [];
            currentConnection.inputs.forEach((nodeID)=> {
                const node: ParseNode = {
                    id: nodeID,
                    type: NodeType.Number,
                    value: 0,
                    description: ""
                }
                currentNode.inputs?.push(node)
                stack.push(node)
            })
        }
    }
    return rootNode;
}




