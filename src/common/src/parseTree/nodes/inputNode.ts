import type {ParseNode} from "./parseNode";
import {NodeType} from "../nodeMeta/node";
import type {InputAlternative, InputType, LegalValues} from "../nodeMeta/input";



/**
 * InputNode is a ParseNode that represents a value that can be set by the user.
 *
 * @example
 * const node : InputNode = {
 *     id: "test",
 *     type: NodeType.Input,
 *     value: 0,
 *     description: "Test",
 *     inputType: InputType.Float,
 *     illegalValues: [1.3,Infinity]
 * }
 * @property inputType Type of input to be expected
 * @property valueAlternatives Optional list of value alternatives
 * @property legalValues Optional either a single illegal value or a tuple signifying a range of illegal values
 */
export interface InputNode extends ParseNode {
    type: NodeType.Input
    inputType: InputType
    valueAlternatives?: InputAlternative[]
    legalValues?: LegalValues[]
}

export function isInputNode(node: ParseNode): node is InputNode {
    return node.type === NodeType.Output;
}