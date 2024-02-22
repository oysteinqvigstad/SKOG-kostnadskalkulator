
import type {OutputNode} from "../nodes/outputNode";
import type {ParseNode} from "../nodes/parseNode";
import {isOutputNode} from "../nodes/outputNode";
import {isInputNode} from "../nodes/inputNode";
import type {InputNode} from "../nodes/inputNode";

/**
 * getNodeByID traverses the children of the provided node, attempting to find a node
 * with the provided ID.
 *
 * @param id ID of the node to find
 * @param node Entrypoint for the search. Can be a root-node or any other node in a ParseNode tree.
 * @returns A reference to the ParseNode object with a matching id or undefined
 */
export function getNodeByID(id: string, node: ParseNode | undefined) : ParseNode | undefined {
    if(node?.id === id || node === undefined) {
        return node;
    }
    if(node.inputs) {
        for(let n of node.inputs) {
            let result = getNodeByID(id, n);
            if (result !== undefined) {
                return result;
            }
        }
    }
    return getNodeByID(id, node.left) ?? getNodeByID(id, node.right);
}


export function getOutputNodes(node: ParseNode | undefined): OutputNode[] | undefined {
    return getNodesOfType(node, isOutputNode);
}


export function getInputNodes(node: ParseNode | undefined): InputNode[] | undefined {
    return getNodesOfType(node, isInputNode);
}



function getNodesOfType<
    T extends ParseNode
>(
    node: ParseNode | undefined, typeCheck: (node: ParseNode)=> node is T
): T[] | undefined {

    if(node === undefined) { return undefined }
    let result: T[] = [];
    if(typeCheck(node)) {
        result.push(node);
    }
    if(node.left) {
        result.push(...(getNodesOfType(node.left, typeCheck) ?? []))
    }

    if(node.right) {
        result.push(...(getNodesOfType(node.right, typeCheck) ?? []))
    }

    if(node.inputs) {
        for(let n of node.inputs) {
            result.push(...(getNodesOfType(n, typeCheck) ?? []))
        }
    }
    return result;
}

