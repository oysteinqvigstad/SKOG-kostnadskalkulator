import * as React from "react";
import {ClassicPreset} from "rete";


export abstract class BaseSocket extends ClassicPreset.Socket {
    protected constructor(name: string) {
        super(name);
    }
    public abstract readonly component: (props: { data: any }) => React.JSX.Element;
    public abstract isCompatibleWith(socket: ClassicPreset.Socket): boolean;
}




