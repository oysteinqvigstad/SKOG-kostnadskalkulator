import {Modules} from "./modules";
import {Schemes} from "../types";
import {exportGraph, importGraph} from "../../serialization";
import {NodeEditor} from "rete";
import {AreaPlugin} from "rete-area-plugin";
import {DataflowEngine} from "rete-engine";
import {AreaExtra} from "../../editor";


export class ModuleManager {
    private moduleData: {[key in string]:any} = {
        root: { nodes: [] }
    }
    private currentModule: string = "root"
    private modules: Modules<Schemes>

    constructor(
        private editorContext: Context
    ) {
        this.modules = new Modules<Schemes>(
            (name: string) => {
                return name in this.moduleData
            },
            async (name: string) => {
                return new Promise<void>((resolve, reject)=>{
                    const data = this.moduleData[name];
                    if(!data) {
                        reject()
                    }

                    importGraph(
                        data,
                        this.editorContext.editor,
                        this.editorContext.engine,
                        this.editorContext.area,
                        this.editorContext.signalChange
                    );
                    resolve();
                })
            }
        )
    }

    public addModuleData(name: string, data?: { nodes: any[], connections: any[]}) : boolean {
        if(name in this.moduleData) {
            return false
        }

        this.moduleData[name] = data ?? { nodes: [] }
        return true;
    }

    public setModuleData(name: string, data: { nodes: any[] }) {
        this.moduleData[name] = data;
    }

    public saveModuleState() {
        this.moduleData[this.currentModule] = {
            nodes: exportGraph(this.editorContext.editor)
        }
    }

    public getModuleNames() : string[] {
        return Object.keys(this.moduleData);
    }

    public removeModuleData(name: string) : boolean {
        if(name === "root") {return false}
        let newModuleObject: {[key in string]: any} = {};
        let wasRemoved = false;
        for (const key in this.moduleData) {
            if(key !== name) {
                newModuleObject[key] = this.moduleData[key]
            } else {
                wasRemoved = true;
            }
        }
        this.moduleData = newModuleObject;
        return wasRemoved;
    }

    public loadModule(name: string) {
        const module = this.modules.findModule(name);
        module?.apply(this.editorContext.editor);
    }

    public getModule(name: string) {
        return this.modules.findModule(name);
    }

    public getRootModule() {
        return this.modules.findModule("root");
    }
}

export interface Context {
    editor: NodeEditor<Schemes>
    area: AreaPlugin<Schemes, AreaExtra>
    engine: DataflowEngine<Schemes>
    signalChange: ()=>void
}