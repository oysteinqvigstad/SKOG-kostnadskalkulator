import {Schemes, SkogNode} from "./nodes/types";
import {NodeEditor} from "rete";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";


interface NodeConnection {
    id: string
    left?: string
    right?: string
    child?: string
    inputs?: string[]
}


export function createJSONGraph(editor: NodeEditor<Schemes>) : ParseNode[] | undefined {
    let subtrees: ParseNode[] = [];
    let connProps = editor.getConnections();


    const nodes = editor.getNodes() as SkogNode[];
    const idToNodeConnection = new Map(nodes.map((node) => {
        const parsed: NodeConnection = {
            id: (node.id)
        }
        return [node.id, parsed]
    }));

    let nodeParentCount = new Map(nodes.map((node) => [node.id, 0]));
    let nodeChildrenCount = new Map(nodes.map((node) => [node.id, 0]));

    // iterates through connections, setting up child ids for parent nodes
    // on NodeConnection objects.
    connProps.forEach((connection) => {
        let parentNode = idToNodeConnection.get(connection.target);
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
            // target on ConnProp is id of the parent node when translating to ParseNode tree
            idToNodeConnection.set(connection.target, parentNode);
        }

        nodeParentCount.set(connection.source, (nodeParentCount.get(connection.source) ?? 0) + 1);
        nodeChildrenCount.set(connection.target, (nodeChildrenCount.get(connection.target) ?? 0) + 1);
    });

    const idToSkogNode = new Map(nodes.map((node) => [node.id, node]));
    nodes.forEach((node) => { // Inserts roots and populates these.
        if (isSubTreeRoot(node, nodeParentCount.get(node.id) || 0)) {
            const subTree = populateTree( idToNodeConnection.get(node.id) ?? {id: node.id}, idToNodeConnection, idToSkogNode )
            subtrees.push(subTree);
        }
    });


    return subtrees;
}

function isSubTreeRoot(node: SkogNode, parentCount: number) {
    return [0, 2].includes(parentCount) || node.type === NodeType.Root;

}


/**
 * populateTree takes a root node and attaches children sequentially until all leaf nodes
 * have been reached.
 *
 * @param startNode A node in the tree represented as a NodeConnection. Can be any node found in connections map.
 * @param nodeConnections A map of node IDs to information about the node's children IDs. The function will throw
 * if startNode cannot be found in connections.
 * @param skogNodes A map from node IDs to actual node data.
 * @return The root node of the built tree represented as a ParseNode.
 */
function populateTree(startNode: NodeConnection, nodeConnections: Map<string, NodeConnection>, skogNodes: Map<string, SkogNode>): ParseNode {
    const rootSkogNode = skogNodes.get(startNode.id);
    if(!rootSkogNode) { throw new Error("Start node not found in nodes map")}

    const rootNode = rootSkogNode.toParseNode();

    const stack: ParseNode[] = [rootNode];

    const parseNodeFromID: (id: string)=>ParseNode = (id: string) => {
        const result = skogNodes.get(id);
        if(!result) { throw new Error ("node not found in nodes map")}
        return result.toParseNode();
    }

    while (stack.length > 0) {
        let currentNode = stack.pop();

        if (!currentNode) {
            break;
        }

        const currentConnection = nodeConnections.get(currentNode.id);

        if (currentConnection?.left) {
            const leftNode = currentNode.left = parseNodeFromID(currentConnection.left);
            stack.push(leftNode);
        }

        if (currentConnection?.right) {
            const rightNode = currentNode.right = parseNodeFromID(currentConnection.right);
            stack.push(rightNode);
        }

        if (currentConnection?.child) {
            const childNode = currentNode.child = parseNodeFromID(currentConnection.child);
            stack.push(childNode);
        }

        if (currentConnection?.inputs) {
            currentNode.inputs = [];
            currentConnection.inputs.forEach((nodeID)=> {
                const node = parseNodeFromID(nodeID);
                currentNode!.inputs?.push(node);
                stack.push(node);
            })
        }
    }
    return rootNode;
}




