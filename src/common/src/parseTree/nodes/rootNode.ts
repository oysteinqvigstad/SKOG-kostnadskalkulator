import type {ParseNode} from "./parseNode";
import {NodeType} from "./parseNode";
import type {DisplayNode} from "./displayNode";


export interface RootNode extends ParseNode {
    type: NodeType.Root
    formulaName: string
    version: {
        major: number
        minor: number
        patch: number
    }
    pages: {
        icon?: string,
        pageName: string,
        ordering?: number
    }[],
    displays: DisplayNode[]
}

export function isRootNode(node: ParseNode): node is RootNode {
    return node.type === NodeType.Root;
}