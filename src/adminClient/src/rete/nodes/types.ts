import {GetSchemes} from "rete";
import {BinaryNode, Connection, InputNode, NaryNode, NumberNode} from "./nodes";

export type SkogNode = NumberNode | BinaryNode | NaryNode | InputNode;

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