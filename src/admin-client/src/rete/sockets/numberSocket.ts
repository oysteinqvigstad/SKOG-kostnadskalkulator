import {Presets} from "rete-react-plugin";
import {ClassicPreset} from "rete";
import {BaseSocket} from "./baseSocket";

export class NumberSocket extends BaseSocket {
    constructor() {
        super("number");
    }

    public readonly component = Presets.classic.Socket;

    public isCompatibleWith(socket: ClassicPreset.Socket) {
        return socket instanceof NumberSocket;
    }
}


