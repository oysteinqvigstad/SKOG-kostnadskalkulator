import type {ParseNode} from "./parseNode";
import {NodeType} from "../nodeMeta/node";
import type {DisplayOptions} from "../nodeMeta/display";
import type {NodeRendering} from "../nodeMeta/rendering";


export interface OutputNode extends ParseNode {
    type: NodeType.Output
    displayOptions: DisplayOptions[]
    displayMeta: NodeRendering
    decimalPlaces?: number
}

export function isOutputNode(node: ParseNode): node is OutputNode {
    return node.type === NodeType.Output;
}






