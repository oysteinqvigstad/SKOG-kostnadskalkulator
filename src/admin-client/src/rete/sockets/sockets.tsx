import * as React from "react";
import {ClassicPreset, NodeEditor} from "rete";
import styled from "styled-components";
import {Schemes} from "../nodes/types";


export abstract class BaseSocket extends ClassicPreset.Socket {
    protected constructor(name: string) {
        super(name);
    }

    public abstract isCompatibleWith(socket: ClassicPreset.Socket): boolean;
}

export class NumberSocket extends ClassicPreset.Socket {
    constructor() {
        super("number");
    }

    public isCompatibleWith(socket: ClassicPreset.Socket) {
        return socket instanceof NumberSocket;
    }
}

export class ResultSocket extends ClassicPreset.Socket {
    constructor() {
        super("result");
    }

    public isCompatibleWith(socket: ClassicPreset.Socket) {
        return socket instanceof ResultSocket;
    }
}


const Styles = styled.div`
  display: inline-block;
  cursor: pointer;
  border: 1px solid white;
  border-radius: 15px;
  width: ${25}px;
  height: ${25}px;
  vertical-align: middle;
  background: #ffbc46;
  z-index: 2;
  box-sizing: border-box;

  &:hover {
    border: 4px solid white;
  }
`;

export function ResultSocketComponent<T extends ClassicPreset.Socket>(props: {
    data: T;
}) {
    return <Styles title={props.data.name} />;
}

export function canCreateConnection(editor: NodeEditor<Schemes>, connection: Schemes["Connection"]) {
    const { source, target } = getConnectionSockets(editor, connection);

    return source && target && source.isCompatibleWith(target)
}





type Sockets = ResultSocket | NumberSocket;
type Input = ClassicPreset.Input<Sockets>;
type Output = ClassicPreset.Output<Sockets>;

export function getConnectionSockets(
    editor: NodeEditor<Schemes>,
    connection: Schemes["Connection"]
) {
    const source = editor.getNode(connection.source);
    const target = editor.getNode(connection.target);

    const output =
        source &&
        (source.outputs as Record<string, Input>)[connection.sourceOutput];
    const input =
        target && (target.inputs as Record<string, Output>)[connection.targetInput];

    return {
        source: output?.socket,
        target: input?.socket
    };
}