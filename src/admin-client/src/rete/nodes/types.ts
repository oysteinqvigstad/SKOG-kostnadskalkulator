import {ClassicPreset, GetSchemes} from "rete";
import {NumberNode} from "./numberNode";
import {BinaryNode} from "./binaryNode";
import {NaryNode} from "./naryNode";
import {InputNode} from "./inputNode";
import {OutputNode} from "./outputNode";
import {LabelNode} from "./labelNode";

export type SkogNode = NumberNode | BinaryNode | NaryNode | InputNode | OutputNode | LabelNode;

export class Connection<
    A extends SkogNode,
    B extends SkogNode
> extends ClassicPreset.Connection<A, B> {}

export type ConnProps = // Defines which nodes will signal which nodes
    | Connection<InputNode, BinaryNode>
    | Connection<InputNode, NaryNode>
    | Connection<InputNode, OutputNode>
    | Connection<NumberNode, BinaryNode>
    | Connection<NumberNode, NaryNode>
    | Connection<NumberNode, OutputNode>
    | Connection<LabelNode, OutputNode>
    | Connection<BinaryNode, OutputNode>
    | Connection<NaryNode, OutputNode>

export type Schemes = GetSchemes<SkogNode, ConnProps>;

