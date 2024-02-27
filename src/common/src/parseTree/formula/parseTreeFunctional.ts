import type {ParseNode} from "../nodes/parseNode";
import type {InputNode} from "../nodes/inputNode";
import type {OutputNode} from "../nodes/outputNode";
import {NodeType} from "../nodeMeta/node";
import {isReferenceNode} from "../nodes/referenceNode";
import {isOutputNode} from "../nodes/outputNode";
import {isInputNode} from "../nodes/inputNode";
import {isParseNode} from "../nodes/parseNode";


export interface TreeState {
    subTrees: ParseNode[],
    inputs: InputNode[],
    outputs: OutputNode[],
}







export function treeStateFromData(data: any): TreeState {
    if(typeof data === "string") {
        data = JSON.parse(data);
    } else {
        data = JSON.parse(JSON.stringify(data));
    }

    const result: TreeState = {
        subTrees: [],
        inputs: [],
        outputs: []
    }

    if(Array.isArray(data)) {
        data.forEach((subTreeRoot)=> {
            if(isParseNode(subTreeRoot)) {
                result.subTrees.push(subTreeRoot)
            }
        })
    } else {
        throw new Error("Root of JSON is expected to be an array");
    }

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

    updateTree(result);

    return result;
}

export function cloneTree(tree: TreeState) : TreeState {
    return treeStateFromData(tree.subTrees);
}

export function setInputValue(tree: TreeState, inputId: string, value: number) : TreeState {
    let result = cloneTree(tree);

    result.subTrees.forEach((node, index) => {
        forEachNode(node, (node) => {
            if(node.id === inputId && node.type === NodeType.Input) {
                node.value = value;
            }
        });
    });

    updateTree(result);

    return result;
}


export function getResultsForInputs(tree: TreeState, inputID: string, values: number[]): {outputID: string, values: number[]}[] {
    const treeCopy = cloneTree(tree);
    let currentInput = getNodeByID(treeCopy, inputID);
    const outputValues = new Map<string, number[]>;
    values.forEach((value, index) => {
        if(currentInput !== undefined && isInputNode(currentInput)) {
            currentInput.value = value;
            updateTree(treeCopy);
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






/// Kun skumle ting forbi denne strek //////////////////////////////////////////


function updateTree(tree: TreeState) : TreeState {
    let result = JSON.parse(JSON.stringify(tree));
    tree.subTrees.forEach((root) => {
        calculateNode(tree, root);
    });
    return result;
}

function calculateNode(tree: TreeState, node: ParseNode | undefined): number {
    if(!node) {return 0}

    let result = 0;

    switch(node.type) {
        case NodeType.Input: return node.value;
        case NodeType.Reference: {
            if(isReferenceNode(node)) {
                return calculateNode(tree, getNodeByID(tree, node.referenceID));
            } else {
                throw new Error("Reference node is missing its referenceID property")
            }
        }
        case NodeType.Number: result =  node.value; break;
        case NodeType.Output: result =  calculateNode(tree, node.child); break;
        case NodeType.Add: result = calculateNode(tree, node.left) + calculateNode(tree, node.right); break;
        case NodeType.Sub: result = calculateNode(tree, node.left) - calculateNode(tree, node.right); break;
        case NodeType.Mul: result = calculateNode(tree, node.left) * calculateNode(tree, node.right); break;
        case NodeType.Div: result =  calculateNode(tree, node.left) / calculateNode(tree, node.right); break;
        case NodeType.Sum: result =  node.inputs!.map((node)=>{return calculateNode(tree, node)}).reduce((a, b)=> {return a + b}) ?? 0; break;
        case NodeType.Prod: result = node.inputs!.map((node)=>{return calculateNode(tree, node)}).reduce((a, b)=> {return a * b}) ?? 0; break;
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


