import {ConnProps, isParseableNode, ParseableNode, ReteNode, Schemes} from "./nodes/types";
import {getUID, NodeEditor} from "rete";
import {NodeType, ParseNode, ReferenceNode} from "@skogkalk/common/dist/src/parseTree";
import {ModuleNode} from "./nodes/moduleNodes/moduleNode";
import {ModuleInput} from "./nodes/moduleNodes/moduleInput";
import {ModuleOutput} from "./nodes/moduleNodes/moduleOutput";


interface NodeConnection {
    id: string
    left?: string
    right?: string
    child?: string
    inputs?: string[]
}

function split<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const left: T[] = [];
    const right: T[] = [];
    arr.forEach((item) => {
        if (predicate(item)) {
            left.push(item);
        } else {
            right.push(item);
        }
    });
    return [left, right];
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




function getModuleOutputSources(nodes: ReteNode[], connections: ConnProps[]) : { outputNodeName: string, sourceOutput: string, source: string}[] {
    return nodes
        .filter(node=>{
            return node instanceof ModuleOutput
        })
        .map(node=>{
            const connection = connections.find(conn=>conn.target === node.id);
            return {
                outputNodeName: (node as ModuleOutput).controls.c.get('outputName'),
                sourceOutput: connection?.sourceOutput || "",
                source: connection?.source || ""
            }
        });
}

function getModuleInputTargets(nodes: ReteNode[], connections: ConnProps[]) : { inputNodeName: string, targetInput: string, target: string}[] {
    return nodes
        .filter(node=>{
            return node instanceof ModuleInput
        })
        .map(node=>{
            const connection = connections.find(conn=>conn.source === node.id);
            return {
                inputNodeName: (node as ModuleInput).controls.c.get('inputName'),
                targetInput: connection?.targetInput || "",
                target: connection?.target || ""
            }
        });
}

function redirectExternalConnections(
    moduleNode: ModuleNode,
    connections: ConnProps[],
    internalTargets: { inputNodeName: string, targetInput: string, target: string}[],
    internalSources: { outputNodeName: string, sourceOutput: string, source: string}[]
) {
    return connections.map(connection=>{
        const newConnection = {
            ...connection
        }
        if(connection.target === moduleNode.id) {
            const internalTarget = internalTargets.find((target)=>{ return target.inputNodeName === connection.targetInput })
            newConnection.target = internalTarget?.target || "";
            newConnection.targetInput = internalTarget?.targetInput || "";
        } else if(connection.source === moduleNode.id) {
            const internalSource = internalSources.find((source)=>{ return source.outputNodeName === connection.sourceOutput})
            newConnection.source = internalSource?.source || "";
            newConnection.sourceOutput = internalSource?.sourceOutput || "";
        }
        return newConnection;
    })
}


/**
 *
 * @param moduleNode
 * @param externalIOConnections
 */
export function resolveIncomingModuleConnections(moduleNode: ModuleNode,  externalIOConnections: ConnProps[]) {
    const internalNodes = moduleNode.getNodes();
    const internalIOConnections = moduleNode.getConnections();
    const resolvedInputConnections : ConnProps[] = []


    const inputConnections = externalIOConnections.filter(connection=>{return connection.target === moduleNode.id});

    inputConnections.forEach(connection=>{
        // finds the ModuleInput node associated with the Module input targeted by connection
        const inputNode = internalNodes.find( node=>
            node.type === NodeType.ModuleInput &&
            (node as ModuleInput).controls.c.get('inputName') === connection.targetInput
        );
        if(inputNode) {
            // finds the connection going from the associated ModuleInput to another node
            const connectionFromModuleInput = internalIOConnections.find(conn=>conn.source === inputNode.id);
            if (connectionFromModuleInput) { // Connection exists
                //TODO: Rewrite to filter in case of multiple targets
                const targetNode = internalNodes.find(node=>node.id === connectionFromModuleInput.target);
                if(targetNode) {
                    if(targetNode.type === NodeType.ModuleOutput) { // target is a ModuleOutput
                        // finds the outgoing connection matching the targeted ModuleOutput
                        const outputConnection = externalIOConnections.find(conn=>
                            conn.sourceOutput === (targetNode as ModuleOutput).controls.c.get('outputName'));
                        /**
                         * Case: Incoming connection has been rerouted to the target of a moduleoutput
                         */
                        if(outputConnection) {
                            // @ts-ignore
                            resolvedInputConnections.push({
                                id: getUID(),
                                source: connection.source,
                                target: outputConnection.target,
                                sourceOutput: connection.sourceOutput,
                                targetInput: outputConnection.targetInput
                            })
                        } else {
                            /**
                             * Case: Incoming connection goes to an output with no connection, discarded
                             */
                        }
                    } else {
                        /**
                         * Case: Incoming connection has been rerouted to a regular node in the module
                         */
                        // @ts-ignore
                        resolvedInputConnections.push({
                            id: getUID(),
                            source: connection.source,
                            target: connectionFromModuleInput.target,
                            sourceOutput: connection.sourceOutput,
                            targetInput: connectionFromModuleInput.targetInput
                        })
                    }
                } else {
                    throw new Error ("resolveIncomingModuleConnections: targeted node does not exist in internalIONodes")
                }
            } else {
                /**
                 * Case: ModuleInput is not connected to anything. Incoming connection discarded.
                 */
            }
        }
    });
    return resolvedInputConnections;
}


export function expandModule(module: ModuleNode, externalConnections: ConnProps[]) {
    const internalNodes = module.getNodes();
    const internalConnections = module.getConnections();

    // internal IO nodes are separated out as we only need information about their source and target nodes.
    const [internalIONodes, internalNonIONodes] = split(internalNodes, (node)=>{
        return node instanceof ModuleNode || node instanceof ModuleOutput;
    });



    // internal IO connections are separated out as we need to know which nodes they connect to
    // among the module's internal nodes.
    const [internalIOConnections, internalRegularConnections] = split(internalConnections, (connection)=>{
        return internalIONodes.find(node => node.id === connection.target || node.id === connection.source) !== undefined;
    });

    if(internalNonIONodes.length === 0) {

    }

    // matching external and internal connections are combined into "redirected" connections where
    // the source and target nodes are replaced with the internal nodes they connect to.
    const redirectedConnections = redirectExternalConnections(
        module,
        externalConnections,
        getModuleInputTargets(internalIONodes, internalIOConnections),
        getModuleOutputSources(internalIONodes, internalIOConnections)
    );

    let newConnections = redirectedConnections.concat(internalRegularConnections);

    internalNonIONodes.forEach(()=>{

    });
}



export function flattenGraph(nodes: ReteNode[], connections: ConnProps[]) : {nodes: ParseableNode[], connections: ConnProps[] } {
    let nodesCopy = [...nodes]
    let connectionsCopy = [...connections]
    const flattenedNodes: ReteNode[] = [];
    const flattenedConnections: ConnProps[] = [];
    nodesCopy
        .filter(node=>node instanceof ModuleNode)
        .forEach((moduleNode)=>{
            let internalConnections = (moduleNode as ModuleNode).getConnections();
            let internalNodes = (moduleNode as ModuleNode).getNodes();
            const internalOutputIDs = internalNodes.filter(node=>node instanceof ModuleOutput).map(node=>node.id);
            const internalInputIDs = internalNodes.filter(node=>node instanceof ModuleOutput).map(node=>node.id);

            const internalInputNodeTargets = getModuleInputTargets(internalNodes, internalConnections);
            const internalOutputNodeSources = getModuleOutputSources(internalNodes, internalConnections);

            connectionsCopy = redirectExternalConnections(
                (moduleNode as ModuleNode),
                connectionsCopy,
                internalInputNodeTargets,
                internalOutputNodeSources
            );

            const internalNodesWithoutInOut = internalNodes
                .filter(node=>{return !(node instanceof ModuleOutput || node instanceof ModuleInput)});

            internalConnections = internalConnections.filter(connection=>{
                return !internalOutputIDs.includes(connection.source) && !internalInputIDs.includes(connection.target)
            })
            const flattened = flattenGraph(internalNodesWithoutInOut, internalConnections);

            internalConnections = flattened.connections;
            internalNodes = flattened.nodes;

            flattenedNodes.push(...internalNodes);
            flattenedConnections.push(...internalConnections);
        })
    nodesCopy = nodesCopy.filter(node=>!(node instanceof ModuleNode))
    nodesCopy.push(...flattenedNodes);
    connectionsCopy.push(...flattenedConnections);

    if(nodesCopy.some(node=>{return !isParseableNode(node)})) {
        throw new Error("Module nodes not removed from graph");
    }
    return {nodes: nodesCopy as ParseableNode[], connections: connectionsCopy }
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
        if(!result) { throw new Error ("node not found in nodes map " + id)}
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




