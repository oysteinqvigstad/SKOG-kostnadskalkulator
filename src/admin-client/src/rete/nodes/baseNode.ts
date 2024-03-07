import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";

/**
 * Adds extra metadata properties to the Rete.js Node class.
 */
export class BaseNode<
    Inputs extends Record<string, ClassicPreset.Socket>,
    Outputs extends Record<string, ClassicPreset.Socket>,
    Controls extends Record<string, ClassicPreset.Control>
> extends ClassicPreset.Node<Inputs, Outputs, Controls> {
    xTranslation: number = 0;
    yTranslation: number = 0;
    type: NodeType;
    width: number;
    originalWidth: number;
    height: number;
    originalHeight: number;


    /**
     *
     * @param type NodeType
     * @param height height of the node
     * @param width width of the node
     * @param name
     */
    constructor(
        type: NodeType,
        height: number,
        width: number,
        name?: string,
    ) {
        super(name ?? type.toString());
        this.type = type;
        this.originalHeight = this.height = height;
        this.originalWidth = this.width = width;
    }
}
