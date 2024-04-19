import {ClassicPreset} from "rete";
import React from "react";

export class NodeControl<T extends {}> extends ClassicPreset.Control {
    constructor(
        private data: T,
        public options: {
            onUpdate: (data: Partial<T>) => void,
            minimized: boolean
        },
        public readonly controlContainer: (props: { data: NodeControl<T> }) => React.JSX.Element
    ) {
        super();
    }

    public update(): void {
        this.options?.onUpdate?.(this.data);
    }

    public set(data: Partial<T>): void {
        this.setNoUpdate(data);
        this.options?.onUpdate?.(data);
    }

    public setNoUpdate(data: Partial<T>): void {
        for (const key in data) {
            (this.data as any)[key] = data[key];
        }
    }

    public get<K extends keyof T>(key: K): Readonly<T[K]> {
        return (this.data as any)[key];
    }

    public getData(): Readonly<T> {
        return this.data;
    }
}