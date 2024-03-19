import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {BaseSocket} from "../sockets";
import {BaseNode} from "./baseNode";


/**
 * Adds extra metadata properties to the Rete.js Node class.
 */
export abstract class ParseableBaseNode<
    Inputs extends Record<string, BaseSocket>,
    Outputs extends Record<string, BaseSocket>,
    ControlData extends {}
> extends BaseNode<Inputs, Outputs, ControlData> {

    /**
     *
     * @param type NodeType
     * @param height height of the node
     * @param width width of the node
     * @param name
     * @param id
     */
    protected constructor(
        type: NodeType,
        height: number,
        width: number,
        name?: string,
        id?: string,
    ) {
        super(type, height, width, name, id);
    }

    abstract toParseNode() : ParseNode;
}
