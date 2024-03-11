import type {ReferenceNode} from "./referenceNode";

/**
 * Basis for an N-ary parse tree with basic information about a node's
 * id, type, description and value.
 */
export type ParseNode = {
    id: string
    type: NodeType
    value: number
    left?: ParseNode | ReferenceNode
    right?: ParseNode | ReferenceNode
    child?: ParseNode | ReferenceNode
    inputs?: (ReferenceNode | ParseNode)[]
}


export function isParseNode(node: any): node is ParseNode {
    return (
        typeof node.id === 'string' &&
        typeof node.type === 'string' &&
        (node.left === undefined || typeof node.left === 'object') &&
        (node.right === undefined || typeof node.right === 'object') &&
        (node.child === undefined || typeof node.child === 'object') &&
        (node.inputs === undefined || Array.isArray(node.inputs))
    );
}

export function isBinaryNode(node: ParseNode) : boolean {
    return node.type in [
        NodeType.Add,
        NodeType.Sub,
        NodeType.Pow,
        NodeType.Div,
        NodeType.Mul
    ]
}

export function isNaryNode(node: ParseNode) : boolean {
    return node.type in [
        NodeType.Sum,
        NodeType.Prod
    ]
}

export enum NodeType {
    Reference = "Reference",
    Root = "Root",
    Display = "Display",
    NumberInput = "NumberInput",
    DropdownInput = "DropdownInput",
    Output = "Output",
    Number = "Number",
    Add = "Add",
    Sub = "Sub",
    Mul = "Mul",
    Pow = "Pow",
    Sum = "Sum",
    Prod = "Prod",
    Div = "Div",
}
