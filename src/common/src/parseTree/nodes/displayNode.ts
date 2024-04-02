import type {ParseNode} from "./parseNode";
import type {OutputNode} from "./outputNode";
import type {ReferenceNode} from "./referenceNode";
import {NodeType} from "./parseNode";


export interface DisplayNode extends ParseNode {
    name: string
    inputs: (OutputNode | ReferenceNode)[]
    inputOrdering: {
        outputID: string,
        outputLabel: string,
        ordering?: number
    }[]
    decimalPlaces?: number
}

export function isDisplayNode (node: ParseNode) : node is DisplayNode {
    return node.type === NodeType.Display || node.type === NodeType.BarDisplay || node.type === NodeType.PreviewDisplay
}


export interface DisplayPieNode extends DisplayNode {
    unit: string
    pieType: "pie" | "donut"
}

export interface DisplayBarNode extends DisplayNode {
    unit: string
    max: number
}

export interface DisplayPreviewNode extends DisplayNode {
    unit: string
}

