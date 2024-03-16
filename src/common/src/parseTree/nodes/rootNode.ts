import type {ParseNode} from "./parseNode";
import {NodeType} from "./parseNode";
import type {DisplayNode} from "./displayNode";


export interface RootNode extends ParseNode {
    type: NodeType.Root
    formulaName: string
    version: number
    pages: {
        icon?: string,
        pageName: string,
        ordering?: number
    }[],
    inputs: DisplayNode[]
}

export function isRootNode(node: ParseNode): node is RootNode {
    return node.type === NodeType.Root;
}