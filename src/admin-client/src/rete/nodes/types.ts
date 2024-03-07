import {ClassicPreset, GetSchemes} from "rete";
import {NumberNode} from "./numberNode";
import {BinaryNode} from "./binaryNode";
import {NaryNode} from "./naryNode";
import {NumberInputNode} from "./numberInputNode";
import {OutputNode} from "./outputNode";
import {LabelNode} from "./labelNode";
import {DropdownInputNode} from "./dropdownInputNode";

export type SkogNode = NumberNode | BinaryNode | NaryNode | NumberInputNode | OutputNode | LabelNode | DropdownInputNode;

export class Connection<
    A extends SkogNode,
    B extends SkogNode
> extends ClassicPreset.Connection<A, B> {}

export type ConnProps = // Defines which nodes will signal which nodes
    | Connection<NumberInputNode, BinaryNode>
    | Connection<NumberInputNode, NaryNode>
    | Connection<NumberInputNode, OutputNode>
    | Connection<NumberNode, BinaryNode>
    | Connection<NumberNode, NaryNode>
    | Connection<NumberNode, OutputNode>
    | Connection<LabelNode, OutputNode>
    | Connection<BinaryNode, OutputNode>
    | Connection<NaryNode, OutputNode>

export type Schemes = GetSchemes<SkogNode, ConnProps>;

