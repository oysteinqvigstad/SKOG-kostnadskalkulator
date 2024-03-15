import {ClassicPreset} from "rete";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";


export class NodeControl<T extends {}> extends ClassicPreset.Control{
    constructor(
        private data: T,
        public options: {
            onUpdate: (data: T) => void,
            minimized: boolean
        },
        public type: NodeType,
    ) {
        super();
    }

    public update() : void {
        this.options?.onUpdate?.(this.data);
    }

    public set(data: Partial<T>) : void {
        for (const key in this.data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                (this.data as any)[key] = data[key];
            }
        }
        this.update();
    }

    public setNoUpdate(data: Partial<T>) : void {
        for (const key in this.data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                (this.data as any)[key] = data[key];
            }
        }
    }

    public get<K extends keyof T>(key: K) : Readonly<T[K]> {
        return (this.data as any)[key];
    }

    public getData() : Readonly<T> {
        return this.data;
    }
}


type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

/**
 * Adds extra metadata properties to the Rete.js Node class.
 */
export abstract class BaseNode<
    Inputs extends Record<string, ClassicPreset.Socket>,
    Outputs extends Record<string, ClassicPreset.Socket>,
    Controls extends Record<string, NodeControl<any>>
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
     * @param id
     */
    protected constructor(
        type: NodeType,
        height: number,
        width: number,
        name?: string,
        id?: string,
    ) {
        super(name ?? type.toString());
        this.type = type;
        this.originalHeight = this.height = height;
        this.originalWidth = this.width = width;
        if(id) {
            this.id = id;
        }
    }

    abstract data( inputs: Record<KeysOfType<Inputs, any>, any[]>) : Record<KeysOfType<Outputs, any>, any>;
    abstract toParseNode() : ParseNode;
    protected abstract updateNodeRendering(nodeID: string) : void;
    protected abstract updateDataFlow() : void;
}
