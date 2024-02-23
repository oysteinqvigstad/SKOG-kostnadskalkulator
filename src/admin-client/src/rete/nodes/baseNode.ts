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
    height: number;
    parent?: string;


    constructor(
        type: NodeType,
        height: number = 230,
        width: number = 180
    ) {
        super(type.toString());
        this.type = type;
        this.height = height;
        this.width = width;
    }
}
