import { ClassicPreset, GetSchemes, NodeEditor } from "rete";

import { DataflowEngine, DataflowNode } from "rete-engine";
import {ModuleInput} from "./moduleInput";
import {ModuleOutput} from "./moduleOutput";

export type Schemes = GetSchemes<ClassicPreset.Node & DataflowNode, any>;


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
 * Manager of modules. Constructs a way to retrieve Module objects.
 */
export class Modules<Schema extends Schemes> {
    constructor(
        // some function to check if a module exists
        private has: (path: string) => boolean,
        // function for importing a graph from some data source to editor
        private graph: (path: string, editor: NodeEditor<Schema>) => Promise<void>
    ) {}


    /**
     * Returns object with functions apply and exec:
     * apply:
     * @param path
     */
    public findModule = (path: string): null | Module<Schema> => {
        if (!this.has(path)) return null;

        return {
            apply: (editor: NodeEditor<Schema>) => this.graph(path, editor),
            exec: async (inputData: Record<string, any>) => {
                const engine = new DataflowEngine<Schema>();
                const editor = new NodeEditor<Schema>();

                editor.use(engine);

                await this.graph(path, editor);

                return this.execute(inputData, editor, engine);
            }
        };
    };

    /**
     * Injects inputs into module graph and retrieves values of outputs
     * @param inputs
     * @param editor
     * @param engine
     * @private
     */
    private async execute(
        inputs: Record<string, any>,
        editor: NodeEditor<Schema>,
        engine: DataflowEngine<Schema>
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
    private injectInputs(moduleGraph: Schema["Node"][], inputData: Record<string, any>) {
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
    private async retrieveOutputs(moduleGraph: Schema["Node"][], engine: DataflowEngine<Schema>) {
        const moduleOutputs = moduleGraph.filter(
            (node): node is ModuleOutput => node instanceof ModuleOutput
        );
        const moduleOutputKeyWithValues = await Promise.all(
            moduleOutputs.map(async (outNode) => {
                const data = await engine.fetchInputs(outNode.id);

                return [outNode.controls.c.get('value') || "", data.value[0]] as const;
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
