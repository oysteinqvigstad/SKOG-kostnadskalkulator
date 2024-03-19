import {ClassicPreset, GetSchemes} from "rete";
import {NumberNode} from "./mathNodes/numberNode";
import {BinaryNode} from "./mathNodes/binaryNode";
import {NaryNode} from "./mathNodes/naryNode";
import {NumberInputNode} from "./IONodes/numberInputNode/numberInputNode";
import {OutputNode} from "./IONodes/outputNode/outputNode";
import {DropdownInputNode} from "./IONodes/dropdownInputNode/dropdownInputNode";
import {DisplayPieNode} from "./displayNodes/displayPieNode/displayPieNode";
import {ModuleInput} from "./moduleNodes/moduleInput";
import {ModuleOutput} from "./moduleNodes/moduleOutput";
import {ModuleNode} from "./moduleNodes/moduleNode";
import {DisplayBarNode} from "./displayNodes/displayBarNode/displayBarNode";

export type SkogNode = NumberNode | BinaryNode | NaryNode | NumberInputNode | OutputNode | DropdownInputNode | DisplayPieNode | DisplayBarNode | ModuleInput | ModuleOutput | ModuleNode;

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
    | Connection<BinaryNode, OutputNode>
    | Connection<NaryNode, OutputNode>

export type Schemes = GetSchemes<SkogNode, ConnProps>;

