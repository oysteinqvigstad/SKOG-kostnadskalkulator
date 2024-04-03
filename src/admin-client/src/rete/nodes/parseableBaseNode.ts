import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {BaseSocket} from "../sockets";
import {BaseNode} from "./baseNode";
import {NodeControl} from "./nodeControl";


/**
 * Adds extra metadata properties to the Rete.js Node class.
 */
export abstract class ParseableBaseNode<
    Inputs extends Record<string, BaseSocket>,
    Outputs extends Record<string, BaseSocket>,
    Controls extends Record<string, NodeControl<any>>
> extends BaseNode<Inputs, Outputs, Controls> {

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
