import {ClassicPreset, ClassicPreset as Classic, NodeEditor} from "rete";
import {Schemes} from "../types";
import {Module, Modules} from "./modules";
import {BaseNode, NodeControl} from "../baseNode";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {ModuleManager} from "./moduleManager";


export interface ModuleNodeControlData {
    currentModule: string,
    availableModules: string[]
}


export class ModuleNode extends BaseNode<
        Record<string, Classic.Socket>,
        Record<string, Classic.Socket>,
        { c: NodeControl<ModuleNodeControlData> }
    > {
    module: null | Module<Schemes> = null;

    constructor(
        private moduleManager: ModuleManager,
        private removeConnections: (nodeId: string) => Promise<void>,
        protected updateNodeRendering: (nodeId: string) => void,
        protected updateDataFlow: ()=>void,
        id?: string
    ) {
        super(NodeType.Module, 140, 180, "Module", id);

        const initialState : ModuleNodeControlData = {
            currentModule: "",
            availableModules: this.moduleManager.getModuleNames()
        }

        this.addControl(
            "c",
            new NodeControl(
                initialState,
                {
                    onUpdate: (data: Partial<ModuleNodeControlData>)=>{
                        if('currentModule' in data) {
                            this.setModuleAndRefreshPorts();
                            this.updateNodeRendering(this.id);
                            this.updateDataFlow();
                        }
                    },
                    minimized: false
                },
                this.type
            )
        );
        this.setModuleAndRefreshPorts();
    }

    async setModuleAndRefreshPorts() {
        this.module = this.moduleManager.getModule(this.controls.c.get('currentModule'));

        await this.removeConnections(this.id);
        if (this.module) {
            const editor = new NodeEditor<Schemes>();
            await this.module.apply(editor);

            const { inputs, outputs } = Modules.getPorts(editor);
            this.syncPortsWithModule(inputs, outputs);
        } else this.syncPortsWithModule([], []);
    }



    syncPortsWithModule(inputs: string[], outputs: string[]) {
        Object.keys(this.inputs).forEach((key: keyof typeof this.inputs) =>
            this.removeInput(key)
        );
        Object.keys(this.outputs).forEach((key: keyof typeof this.outputs) =>
            this.removeOutput(key)
        );

        inputs.forEach((key) => {
            this.addInput(key, new Classic.Input(new ClassicPreset.Socket("Number"), key));
        });
        outputs.forEach((key) => {
            this.addOutput(key, new Classic.Output(new ClassicPreset.Socket("Number"), key));
        });
        this.setHeightFromPorts();
    }

    setHeightFromPorts() {
        this.height =
            110 +
            25 * (Object.keys(this.inputs).length + Object.keys(this.outputs).length);
    }

    async data(inputs: Record<string, any>) {
        const data = await this.module?.exec(inputs);

        return data || {};
    }

    toParseNode() {
        //TODO: exporting subtree here: Challenge; subtrees
        throw new Error("Module node is not supposed to go in ParseTree")
        return {} as ParseNode
    }
}
