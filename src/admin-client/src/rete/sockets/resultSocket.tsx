import {ClassicPreset} from "rete";
import styled from "styled-components";
import * as React from "react";
import {BaseSocket} from "./baseSocket";

export class ResultSocket extends BaseSocket {
    constructor() {
        super("result");
    }

    public readonly component = ResultSocketComponent;

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

