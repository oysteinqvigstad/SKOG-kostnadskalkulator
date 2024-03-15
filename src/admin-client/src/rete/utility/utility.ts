import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {SkogNode} from "../nodes/types";
import {NumberNode} from "../nodes/numberNode";
import {BinaryNode} from "../nodes/binaryNode";
import {NaryNode} from "../nodes/naryNode";
import {OutputNode} from "../nodes/outputNode";
import {NumberInputNode} from "../nodes/numberInputNode";
import {DropdownInputNode} from "../nodes/dropdownInputNode";
import {DisplayPieNode} from "../nodes/displayPieNode";

export function getSkogNodeFromNodeType(
    type:NodeType,
    onValueUpdate: ()=>void,
    updateNodeRender: (nodeID: string) => void,
    updateStore: () => void,
    id?: string
) : SkogNode | undefined {
    switch(type) {
        case NodeType.Output: return new OutputNode(updateNodeRender, onValueUpdate, id);
        case NodeType.Number: return new NumberNode(0, updateNodeRender, onValueUpdate, id);
        case NodeType.NumberInput: return new NumberInputNode(updateNodeRender, onValueUpdate, updateStore, id);
        case NodeType.DropdownInput: return new DropdownInputNode(updateNodeRender, onValueUpdate, updateStore, id);
        case NodeType.Display: return new DisplayPieNode(updateNodeRender, updateStore, id)
        case NodeType.Add: return new BinaryNode(NodeType.Add, updateNodeRender, id);
        case NodeType.Sub: return new BinaryNode(NodeType.Sub, updateNodeRender, id);
        case NodeType.Mul: return new BinaryNode(NodeType.Mul, updateNodeRender, id);
        case NodeType.Pow: return new BinaryNode(NodeType.Pow, updateNodeRender, id);
        case NodeType.Div: return new BinaryNode(NodeType.Div, updateNodeRender, id);
        case NodeType.Sum: return new NaryNode(NodeType.Sum, updateNodeRender, id);
        case NodeType.Prod: return new NaryNode(NodeType.Prod, updateNodeRender, id);
        default: return undefined;
    }
}
