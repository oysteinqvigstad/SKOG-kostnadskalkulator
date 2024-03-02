import type {ParseNode} from "./parseNode";
import {NodeType} from "./parseNode";
import type {ReferenceNode} from "./referenceNode";



export interface OutputNode extends ParseNode {
    type: NodeType.Output
    child: ParseNode | ReferenceNode
    name: string
    color: string
    unit: string
}

export function isOutputNode(node: ParseNode): node is OutputNode {
    return node.type === NodeType.Output;
}






