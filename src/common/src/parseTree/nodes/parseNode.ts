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
    inputs?: ParseNode[]
}

