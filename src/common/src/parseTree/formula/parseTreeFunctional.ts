import type {ParseNode} from "../nodes/parseNode";
import type {InputNode} from "../nodes/inputNode";
import type {OutputNode} from "../nodes/outputNode";
import {NodeType} from "../nodes/nodeMeta/node";
import {isReferenceNode} from "../nodes/referenceNode";
import {isOutputNode} from "../nodes/outputNode";
import {isInputNode} from "../nodes/inputNode";
import {isParseNode} from "../nodes/parseNode";


/**
 *
 */
export interface TreeState {
    subTrees: ParseNode[],
    inputs: InputNode[],
    outputs: OutputNode[],
}


/**
 * Creates a TreeState object from an array of ParseNode objects
 *
 * Throws an error on invalid data format
 *
 * @param data An array of ParseNode objects, or a JSON string version of such an array.
 * @returns A TreeState object where inputs and outputs are object references
 * to the nodes in the subTrees array
 */
export function treeStateFromData(data: any): TreeState {
    if(typeof data === "string") {
        data = JSON.parse(data);
    } else {
        data = JSON.parse(JSON.stringify(data));
    }
    if(!Array.isArray(data)) {
        throw new Error("Root of JSON is expected to be an array");
    }


    const result: TreeState = { subTrees: [], inputs: [], outputs: [] }

    data.forEach((subTreeRoot)=> {
        if(isParseNode(subTreeRoot)) {
            result.subTrees.push(subTreeRoot)
        } else {
            throw new Error("Invalid data format. Expected array of ParseNode objects");
        }
    })

    result.subTrees.forEach((node, index) => {
        forEachNode(node, (node) => {
            if(isOutputNode(node)) {
                result.outputs.push(node);
            }
            if(isInputNode(node)) {
                result.inputs.push(node);
            }
        });
    });
    return result;
}


/**
 * Returns a deep copy of a TreeState object
 * @param tree The TreeState object to be cloned
 */
export function cloneTree(tree: TreeState) : TreeState {
    return treeStateFromData(tree.subTrees);
}


/**
 * Returns a deep copy of a ParseNode object where the input value is updated
 * and calculation is run on every node.
 *
 * @param tree The tree to clone and update. The original is not altered.
 * @param inputId
 * @param value
 */
export function setInputValue(tree: TreeState, inputId: string, value: number) : TreeState | undefined {
    let result = cloneTree(tree);

    if(getNodeByID(result, inputId) === undefined) { return undefined; }

    result.subTrees.forEach((node, index) => {
        forEachNode(node, (node) => {
            if(node.id === inputId && node.type === NodeType.Input) {
                node.value = value;
            }
        });
    });

    updateNodeValuesMutably(result);

    return result;
}


/**
 * Returns the calculated output values for a given input node and a set of values
 *
 * @param tree The tree to calculate the output values from
 * @param inputID The ID of the input node
 * @param values An array of values to set the input node to
 * @returns An array with the results for each output node in the tree,
 * or undefined if the input node is not found in the tree.
 */
export function getResultsForInputs(tree: TreeState, inputID: string, values: number[]): {outputID: string, values: number[]}[] | undefined {
    const treeCopy = cloneTree(tree);
    let currentInput = getNodeByID(treeCopy, inputID);
    if(!currentInput) {return undefined;}

    const outputValues = new Map<string, number[]>;
    values.forEach((value, index) => {
        if(currentInput !== undefined && isInputNode(currentInput)) {
            currentInput.value = value;
            updateNodeValuesMutably(treeCopy);
            treeCopy.outputs.forEach((output) => {
                const out = outputValues.get(output.id);
                if(out) {
                    out.push(output.value);
                    outputValues.set(output.id, out);
                } else {
                    outputValues.set(output.id, [output.value]);
                }
            });
        }
    });
    return Array.from(outputValues).map(([outputID, values]) => {return {outputID, values}});
}


/**
 * Retrieves a node from a TreeState object by its ID
 *
 * @param tree TreeState object to search
 * @param nodeID The node id.
 * @returns A shallow copy of the matching node, otherwise undefined.
 */
export function getNodeByID(tree: TreeState, nodeID: string) : ParseNode | undefined {
    let matchNode: ParseNode | undefined;
    tree.subTrees.forEach((root)=> {
        forEachNode(root, (n)=>{
            if(n.id === nodeID) {
                matchNode = n;
            }
        })
    });
    return matchNode;
}







////////////////////////////////////////////////////////////////////////////////
                            // Internal Functions
////////////////////////////////////////////////////////////////////////////////


/**
 * Updates the calculated value of all nodes in the tree
 *
 * @param tree
 */
function updateNodeValuesMutably(tree: TreeState) : TreeState {
    tree.subTrees.forEach((root) => {
        calculateNodeValue(tree, root);
    });
    return tree;
}


/**
 * Creates a deep copy of the tree and updates the calculated value
 * of all nodes in the subtrees.
 *
 * NB: Noticeably slower than updateNodeValuesMutably due to the deep
 * copying of the tree
 *
 * @param tree
 */
function updateNodeValuesImmutably(tree: TreeState) : TreeState {
    const result = cloneTree(tree);
    result.subTrees.forEach((root) => {
        calculateNodeValue(result, root);
    });
    return result;
}


/**
 * Calculates the value of a node and all its children, along
 * with any subtrees referenced in the node or its children.
 *
 * @param tree
 * @param node
 */
function calculateNodeValue(tree: TreeState, node: ParseNode | undefined): number {
    if(!node) {return 0}

    let result = 0;

    switch(node.type) {
        case NodeType.Input: return node.value;
        case NodeType.Reference: {
            if(isReferenceNode(node)) {
                return calculateNodeValue(tree, getNodeByID(tree, node.referenceID));
            } else {
                throw new Error("Reference node is missing its referenceID property")
            }
        }
        case NodeType.Number: result =  node.value; break;
        case NodeType.Output: result =  calculateNodeValue(tree, node.child); break;
        case NodeType.Add: result = calculateNodeValue(tree, node.left) + calculateNodeValue(tree, node.right); break;
        case NodeType.Sub: result = calculateNodeValue(tree, node.left) - calculateNodeValue(tree, node.right); break;
        case NodeType.Mul: result = calculateNodeValue(tree, node.left) * calculateNodeValue(tree, node.right); break;
        case NodeType.Div: result =  calculateNodeValue(tree, node.left) / calculateNodeValue(tree, node.right); break;
        case NodeType.Sum: result =  node.inputs!.map((node)=>{return calculateNodeValue(tree, node)}).reduce((a, b)=> {return a + b}) ?? 0; break;
        case NodeType.Prod: result = node.inputs!.map((node)=>{return calculateNodeValue(tree, node)}).reduce((a, b)=> {return a * b}) ?? 0; break;
        default: result = 0;
    }

    node.value = result;
    return result;
}



function forEachNode(node: ParseNode, func: (node: ParseNode)=>void) {
    let nodes = [node];
    while(nodes.length != 0) {
        const currentNode = nodes.pop();

        if(currentNode) {
            func(currentNode);
        }

        if(currentNode?.left)   { nodes.push(currentNode.left); }
        if(currentNode?.right)  { nodes.push(currentNode.right); }
        if(currentNode?.child)  { nodes.push(currentNode.child); }
        if(currentNode?.inputs) { nodes.push(...currentNode.inputs); }
    }
}


