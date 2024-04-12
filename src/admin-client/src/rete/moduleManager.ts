import {Schemes} from "./nodes/types";
import {NodeEditor} from "rete";
import {DataflowEngine} from "rete-engine";
import {GraphSerializer, SerializedGraph, SerializedNode} from "./graphSerializer";
import {ModuleInput} from "./nodes/moduleNodes/moduleInput";
import {ModuleOutput} from "./nodes/moduleNodes/moduleOutput";
import {NodeFactory} from "./nodeFactory";


export interface ModuleEntry {
    name: string,
    data: SerializedGraph
}


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

    private moduleData: ModuleEntry[] = []

    private matchOnName(name: string) {
        return this.moduleData.find(entry=>entry.name === name);
    }

    public addModuleData(name: string, data?: { nodes: SerializedNode[]}) : boolean {
        const match = this.matchOnName(name);
        if(match !== undefined) return false;

        this.moduleData.push({name: name, data: data || { nodes: []} })
        return true;
    }

    public renameModule(originalName: string, newName: string) {
        this.moduleData.forEach(entry=>{
            if(entry.name===originalName) {
                entry.name = newName;
            }
        })
    }

    public setModuleData(name: string, data: { nodes: SerializedNode[] }) {
        const match = this.matchOnName(name);
        if(match !== undefined) {
            match.data = data;
        }
    }

    public removeModule(name: string) {
        this.moduleData = this.moduleData.filter(entry=>entry.name !== name);
    }

    getModuleData(name: string) :  { nodes: SerializedNode[] } | undefined {
        return this.matchOnName(name)?.data;
    }

    public getAllModuleData() : ModuleEntry[] {
        return this.moduleData;
    }

    public overwriteModuleData(modules: ModuleEntry[]) {
        this.moduleData = modules;
    }



    public getModuleNames() : string[] {
        return this.moduleData.map(entry=>entry.name);
    }

    public hasModule(moduleName: string) : boolean {
        return this.matchOnName(moduleName) !== undefined;
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
            const data = this.matchOnName(moduleName)?.data;
            if(!data) {
                reject(); return;
            }
            const serializer = new GraphSerializer(editor, factory ?? new NodeFactory(this))
            serializer.importNodes(data).catch(()=>{reject(); return;}).then(()=>{
                resolve(); return;
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
                node.value = inputData[key] && inputData[key][0].value;
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
                return [outNode.controls.c.get('outputName') || "", data.value?.[0].value] as const;
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
