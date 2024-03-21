import {ConnProps, Schemes, ReteNode, ParseableNode, isParseableNode} from "./nodes/types";
import {NodeEditor} from "rete";
import {NodeType, ParseNode, ReferenceNode} from "@skogkalk/common/dist/src/parseTree";
import {ModuleNode} from "./nodes/moduleNodes/moduleNode";
import {ModuleInput} from "./nodes/moduleNodes/moduleInput";
import {ModuleOutput} from "./nodes/moduleNodes/moduleOutput";
import {getUID} from 'rete'
import {ParseableBaseNode} from "./nodes/parseableBaseNode";


interface NodeConnection {
    id: string
    left?: string
    right?: string
    child?: string
    inputs?: string[]
}


/**
 * Recursively searches for the presence of a named module in a graph
 * @param name
 * @param nodes
 */
export function detectModule(name: string, nodes: ReteNode[]) {
    const modules = nodes.filter(node=>{return node instanceof ModuleNode})
    modules.some(module=>{
        return (module as ModuleNode).controls.c.get('currentModule') === name || detectModule(name, (module as ModuleNode).getNodes())
    })
    return false;
}


/**
 * Traverses a graph and reduces any modules to simple connections and nodes
 * @param nodes
 * @param connections
 */
export function flattenGraph(nodes: ReteNode[], connections: ConnProps[]) : {nodes: ParseableNode[], connections: ConnProps[] } {

    const modules = nodes
        .filter(node=>{return node instanceof ModuleNode})
        .map((node)=>{
            let internalConnections = (node as ModuleNode).getConnections();
            let internalNodes = (node as ModuleNode).getNodes();
            const flattened = flattenGraph(internalNodes, internalConnections)

            internalConnections = flattened.connections
            internalNodes = flattened.nodes

            const internalNodesWithoutInOut = internalNodes.filter(node=>{return !(node instanceof ModuleOutput || node instanceof ModuleInput)})

            const internalInputNodes = internalNodes
                .filter(node=>{
                    return node instanceof ModuleInput
                }).map(node=>{
                    const target = internalConnections.find(conn=>{return conn.source === node.id})
                    return {
                        inputName: (node as ModuleInput).controls.c.get('inputName'),
                        internalTargetName: target?.targetInput,
                        targetID: target?.target
                    }});

            const internalOutputNodes = internalNodes
                .filter(node=>{
                    return node instanceof ModuleOutput
                })
                .map(node=>{
                    const source = internalConnections.find(conn=>conn.target === node.id);
                    return {
                        outputName: (node as ModuleOutput).controls.c.get('outputName'),
                        internalSourceName: source?.sourceOutput,
                        sourceID: source?.source
                    }
                });


            const externalConnections = connections
                .filter(conn=>{return conn.target == node.id || conn.source == node.id})

            const externalOutputs = externalConnections
                .filter( conn=>conn.sourceOutput in node.outputs )
                .map(conn=>{return {outputName: conn.sourceOutput, targetName: conn.targetInput, externalID: conn.target}});

            const externalInputs = externalConnections
                .filter(conn =>conn.targetInput in node.inputs )
                .map(conn=>{return {inputName: conn.targetInput, sourceName: conn.sourceOutput, externalID: conn.source}});

            const combinedInputData = externalInputs.map(input=>{
                const internalInput = internalInputNodes.find(node=>node.inputName === input.inputName);
                return { ...input, internalID: internalInput?.targetID, internalTargetName: internalInput?.internalTargetName }
            })

            const combinedOutputData = externalOutputs.map(output=>{
                const internalOutput = internalOutputNodes.find(node=>node.outputName === output.outputName);
                return { ...output, internalID: internalOutput?.sourceID, internalSourceName: internalOutput?.internalSourceName }
            })

            const newConnPropsInputs = combinedInputData.map(data=>{
                return {
                    id: getUID(),
                    target: data.internalID || "",
                    targetInput: data.internalTargetName || "",
                    source: data.externalID || "",
                    sourceOutput: data.sourceName || ""
                } as ConnProps
            })

            const newConnPropsOutputs = combinedOutputData.map(data=>{
                return {
                    id: getUID(),
                    target: data.externalID || "",
                    targetInput: data.targetName || "",
                    source: data.internalID || "",
                    sourceOutput: data.internalSourceName || ""
                } as ConnProps
            })

            connections = connections.filter(conn=>{return ![conn.target, conn.source].includes(node.id)})

            return { moduleID: node.id, outputs: newConnPropsOutputs, inputs: newConnPropsInputs, nodes: internalNodesWithoutInOut }
        })

    nodes = nodes.filter(node=>node instanceof ParseableBaseNode)

    modules.forEach(module=>{
        nodes = nodes.concat(module.nodes);
        connections = connections.concat(module.inputs).concat(module.outputs)
    })
    if(nodes.some(node=>{return !isParseableNode(node)})) {
        throw new Error("Module nodes not removed from graph");
    }
    return {nodes: nodes as ParseableNode[], connections: connections }
}


export function createParseNodeGraph(editor: NodeEditor<Schemes>) : ParseNode[] | undefined {
    let subtrees: ParseNode[] = [];

    let connProps = editor.getConnections();
    let nodes = editor.getNodes() as ReteNode[];

    const flattened = flattenGraph(nodes, connProps);

    nodes = flattened.nodes;

    connProps = flattened.connections;

    const idToNodeConnection = new Map(nodes.map((node) => {
        const parsed: NodeConnection = {
            id: (node.id)
        }
        return [node.id, parsed]
    }));

    let nodeParentCount = new Map(nodes.map((node) => [node.id, 0]));

    // iterates through connections, setting up child ids for parent nodes
    // on NodeConnection objects.
    connProps.forEach((connection) => {
        let parentNode = idToNodeConnection.get(connection.target);
        const targetPortName = connection.targetInput;


        if(parentNode !== undefined) {
            if(targetPortName === "result") {
                parentNode.child = connection.source;
            } else if(targetPortName === "left") {
                parentNode.left = connection.source;
            } else if(targetPortName === "right") {
                parentNode.right = connection.source;
            } else {
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
    });

    //TODO: Module IDs same across instances of module. Works fine for dataflow, but not for parsetree
    const idToParseableNode = new Map((nodes as ParseableNode[]).map((node) => [node.id, {node: node, isRoot: isSubTreeRoot(node, nodeParentCount.get(node.id) || 0)}]));
    nodes.forEach((node) => { // Inserts roots and populates these.
        if (isSubTreeRoot(node, nodeParentCount.get(node.id) || 0)) {
            const subTree = populateTree( idToNodeConnection.get(node.id) ?? {id: node.id}, idToNodeConnection, idToParseableNode )
            subtrees.push(subTree);
        }
    });

    return subtrees;
}

function isSubTreeRoot(node: ReteNode, parentCount: number) {
    return parentCount === 0 || parentCount >=2 || node.type === NodeType.Root;
}


/**
 * populateTree takes a root node and attaches children sequentially until all leaf nodes
 * have been reached.
 *
 * @param startNode A node in the tree represented as a NodeConnection. Can be any node found in connections map.
 * @param nodeConnections A map of node IDs to information about the node's children IDs. The function will throw
 * if startNode cannot be found in connections.
 * @param reteNodes A map from node IDs to actual node data.
 * @return The root node of the built tree represented as a ParseNode.
 */
function populateTree(startNode: NodeConnection, nodeConnections: Map<string, NodeConnection>, reteNodes: Map<string, {node: ParseableNode, isRoot: boolean}>): ParseNode {
    const rootSkogNode = reteNodes.get(startNode.id);
    if(!rootSkogNode) { throw new Error("Start node not found in nodes map")}

    const rootNode = rootSkogNode.node.toParseNode();

    const stack: ParseNode[] = [rootNode];

    const parseNodeFromID: (id: string)=>ParseNode = (id: string) => {
        const result = reteNodes.get(id);
        if(!result) { throw new Error ("node not found in nodes map")}
        const parseNode = result.node.toParseNode();
        if(result.isRoot) {
            return {
                id: (Math.round(Math.random()*1000000000)).toString(),
                value: parseNode.value,
                type: NodeType.Reference,
                referenceID: result.node.id
            } as ReferenceNode
        } else {
            return parseNode;
        }
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




