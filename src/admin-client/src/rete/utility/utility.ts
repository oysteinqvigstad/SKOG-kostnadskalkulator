import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset} from "rete";
import {SkogNode} from "../nodes/types";
import {NumberNode} from "../nodes/numberNode";
import {BinaryNode} from "../nodes/binaryNode";
import {NaryNode} from "../nodes/naryNode";

export function getSkogNodeFromNodeType(
    type:NodeType,
    onValueUpdate: ()=>void,
    updateNodeRender: (c:  ClassicPreset.InputControl<"number", number>) => void
) : SkogNode | undefined {
    switch(type) {
        case NodeType.Number: return new NumberNode(0, onValueUpdate);
        case NodeType.Add: return new BinaryNode(NodeType.Add, updateNodeRender);
        case NodeType.Sub: return new BinaryNode(NodeType.Sub, updateNodeRender);
        case NodeType.Mul: return new BinaryNode(NodeType.Mul, updateNodeRender);
        case NodeType.Pow: return new BinaryNode(NodeType.Pow, updateNodeRender);
        case NodeType.Div: return new BinaryNode(NodeType.Div, updateNodeRender);
        case NodeType.Sum: return new NaryNode(NodeType.Sum, updateNodeRender);
        case NodeType.Prod: return new NaryNode(NodeType.Prod, updateNodeRender);
        default: return undefined;
    }
}
