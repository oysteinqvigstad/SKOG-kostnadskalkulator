import type {NodeType} from "../nodeMeta/node";

/**
 * Basis for an N-ary parse tree with basic information about a node's
 * id, type, description and value.
 */
export type ParseNode = {
    id: string
    type: NodeType
    value: number
    description: string
    left?: ParseNode
    right?: ParseNode
    child?: ParseNode
    inputs?: ParseNode[]
}


export function isParseNode(node: any): node is ParseNode {
    return (
        typeof node.id === 'string' &&
        typeof node.type === 'string' &&
        typeof node.value === 'number' &&
        typeof node.description === 'string' &&
        (node.left === undefined || typeof node.left === 'object') &&
        (node.right === undefined || typeof node.right === 'object') &&
        (node.child === undefined || typeof node.child === 'object') &&
        (node.inputs === undefined || Array.isArray(node.inputs))
    );
}
