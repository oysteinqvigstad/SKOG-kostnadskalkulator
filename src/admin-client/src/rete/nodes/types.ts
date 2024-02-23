import {ClassicPreset, GetSchemes} from "rete";
import {NumberNode} from "./numberNode";
import {BinaryNode} from "./binaryNode";
import {NaryNode} from "./naryNode";
import {InputNode} from "./inputNode";

export type SkogNode = NumberNode | BinaryNode | NaryNode | InputNode;

export class Connection<
    A extends SkogNode,
    B extends SkogNode
> extends ClassicPreset.Connection<A, B> {}

export type ConnProps =
    Connection<SkogNode, SkogNode>
    | Connection<BinaryNode, BinaryNode>
    | Connection<NaryNode, BinaryNode>
    | Connection<NaryNode, SkogNode>
    | Connection<SkogNode, NaryNode>
    | Connection<InputNode, BinaryNode>
    | Connection<InputNode, NaryNode>
    | Connection<InputNode, SkogNode>

export type Schemes = GetSchemes<SkogNode, ConnProps>;

