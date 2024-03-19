
import {Schemes} from "./nodes/types";
import {NodeEditor} from "rete";
import {AreaPlugin} from "rete-area-plugin";
import {DataflowEngine} from "rete-engine";
import {AreaExtra} from "./editorClass";
import {GraphSerializer} from "./graphSerializer";
import {ModuleInput} from "./nodes/moduleSystem/moduleInput";
import {ModuleOutput} from "./nodes/moduleSystem/moduleOutput";
import {NodeFactory} from "./nodeFactory";


/**
 * Object with two functions.
 * Apply: inserts graph into an existing editor
 * Exec: Executes the module graph using data matching key value pairs of graph inputs
 */
export type Module<S extends Schemes> = {
    apply: (editor: NodeEditor<S>) => Promise<void>;
    exec: (data: Record<string, any>) => Promise<any>;
};



/**
 * Holds module data.
 * Provides methods for loading data of a module through the use of a serializer
 */
export class ModuleManager {

    private moduleData: {[key in string]:any} = {}


    constructor() {}

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

    public removeModuleData(name: string) : boolean {
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

    getModuleData(name: string) :  any | undefined {
        if(!this.hasModule(name)) {
            return undefined
        }
        return this.moduleData[name];
    }

    public getAllModuleData() {
        const modules = []
        for(const name in this.moduleData) {
            modules.push({name: name, data: this.moduleData[name]})
        }
        return modules
    }

    public overwriteModuleData(modules: {name: string, data: any}[]) {
        this.moduleData = {};
        for (const {name, data} of modules) {
            this.moduleData[name] = data;
        }
    }



    public getModuleNames() : string[] {
        return Object.keys(this.moduleData);
    }

    public hasModule(moduleName: string) : boolean {
        return moduleName in this.moduleData
    }



    /**
     * Returns object with functions apply and exec:
     * apply:
     * @param path
     */
    public getModule = (path: string): null | Module<Schemes> => {
        if (!this.hasModule(path)) return null;

        return {
            apply: (editor: NodeEditor<Schemes>) => { return this.loadToEditor(path, editor) },
            exec: async (inputData: Record<string, any>) => {
                const engine = new DataflowEngine<Schemes>();
                const editor = new NodeEditor<Schemes>();

                editor.use(engine);

                await this.loadToEditor(path, editor);

                return this.execute(inputData, editor, engine);
            }
        };
    };


    private loadToEditor(moduleName: string, editor: NodeEditor<Schemes>, factory?: NodeFactory) {
        return new Promise<void>((resolve, reject)=>{
            const data = this.moduleData[moduleName];
            if(!data) {
                reject()
            }
            const serializer = new GraphSerializer(editor, factory ?? new NodeFactory(this))
            serializer.importNodes(data).catch(()=>{reject()}).then(()=>{
                resolve();
            });
        })
    }

    /**
     * Injects inputs into module graph and retrieves values of outputs
     * @param inputs
     * @param editor
     * @param engine
     * @private
     */
    private async execute(
        inputs: Record<string, any>,
        editor: NodeEditor<Schemes>,
        engine: DataflowEngine<Schemes>
    ) {
        const nodes = editor.getNodes();

        this.injectInputs(nodes, inputs);

        return this.retrieveOutputs(nodes, engine);
    }


    /**
     * Injects input values from ModuleNode into inputs in module graph
     * @param moduleGraph
     * @param inputData
     * @private
     */
    private injectInputs(moduleGraph: Schemes["Node"][], inputData: Record<string, any>) {
        const inputNodes = moduleGraph.filter(
            (node): node is ModuleInput => node instanceof ModuleInput
        );

        inputNodes.forEach((node) => {
            const key = node.controls.c.get('inputName');
            if (key) {
                node.value = inputData[key] && inputData[key][0];
            }
        });
    }


    /**
     * Retrieves outputs in module graph, returning an object of key value pairs for the combined outputs
     * @param moduleGraph
     * @param engine
     * @private
     */
    private async retrieveOutputs(moduleGraph: Schemes["Node"][], engine: DataflowEngine<Schemes>) {
        const moduleOutputs = moduleGraph.filter(
            (node): node is ModuleOutput => node instanceof ModuleOutput
        );
        const moduleOutputKeyWithValues = await Promise.all(
            moduleOutputs.map(async (outNode) => {
                const data = await engine.fetchInputs(outNode.id);

                return [outNode.controls.c.get('outputName') || "", data.value[0]] as const;
            })
        );

        return Object.fromEntries(moduleOutputKeyWithValues);
    }

    /**
     * Retrieves names of module input and output nodes
     * @param editor
     */
    public static getPorts(editor: NodeEditor<Schemes>) {
        const nodes = editor.getNodes();

        const inputNames = nodes
            .filter((n): n is ModuleInput => n instanceof ModuleInput)
            .map((n) => n.controls.c.get('inputName') as string);
        const outputNames = nodes
            .filter((n): n is ModuleOutput => n instanceof ModuleOutput)
            .map((n) => n.controls.c.get('outputName') as string);

        return {
            inputs: inputNames,
            outputs: outputNames
        };
    }

}

export interface Context {
    editor: NodeEditor<Schemes>
    area: AreaPlugin<Schemes, AreaExtra>
    engine: DataflowEngine<Schemes>
    signalChange: ()=>void
}