import {ClassicPreset, NodeEditor} from "rete";
import {Connection, ConnProps, Schemes, SkogNode} from "./nodes/types";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {Presets, ReactPlugin} from "rete-react-plugin";
import {DataflowEngine} from "rete-engine";
import {Presets as ScopesPresets, ScopesPlugin} from "rete-scopes-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {createJSONGraph} from "./adapters";
import {createRoot} from "react-dom/client";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ItemDefinition} from "rete-context-menu-plugin/_types/presets/classic/types";
import {ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {
    DisplayPieNodeControlContainer
} from "./customControls/displayNodeControls/pieDisplayNode/displayPieNodeControlContainer";
import {NumberInputControlContainer} from "./customControls/inputNodeControls/number/numberInputControlContainer";
import {DropdownInputControlContainer} from "./customControls/inputNodeControls/dropdown/dropdownInputControlContainer";
import {OutputNodeControlContainer} from "./customControls/outputNodeControls/outputNodeControlContainer";
import {NumberControlComponent} from "./customControls/numberControl/numberControlComponent";
import {AreaExtra, process} from "./editor";
import {ModuleManager} from "./nodes/moduleSystem/moduleManager";
import {ModuleOutput} from "./nodes/moduleSystem/moduleOutput";
import {ModuleNode} from "./nodes/moduleSystem/moduleNode";
import {ModuleInput} from "./nodes/moduleSystem/moduleInput";
import {OutputNode} from "./nodes/outputNode";
import {NumberNode} from "./nodes/numberNode";
import {NumberInputNode} from "./nodes/numberInputNode";
import {DropdownInputNode} from "./nodes/dropdownInputNode";
import {DisplayPieNode} from "./nodes/displayPieNode";
import {BinaryNode} from "./nodes/binaryNode";
import {NaryNode} from "./nodes/naryNode";
import {NodeControl} from "./nodes/baseNode";




export interface EditorContext {
    editor: NodeEditor<Schemes>,
    area: AreaPlugin<Schemes,  AreaExtra>,
    connection: ConnectionPlugin<Schemes, AreaExtra>,
    render: ReactPlugin<Schemes, AreaExtra>,
    engine: DataflowEngine<Schemes>,
    scopes: ScopesPlugin<Schemes>,
    arrange: AutoArrangePlugin<Schemes>
}




export class Editor {

    private context: EditorContext;
    private selectedNode: string | undefined;
    private onChangeCalls: {id: string, call: ()=>void}[] = []
    private loading = false;
    public readonly moduleManager: ModuleManager;

    public destroyArea = () => {this.context.area.destroy()}




    constructor (
        container: HTMLElement
    ) {
        this.context = {
            editor: new NodeEditor<Schemes>(),
            area: new AreaPlugin<Schemes, AreaExtra>(container),
            engine: new DataflowEngine<Schemes>(),
            connection: new ConnectionPlugin<Schemes, AreaExtra>(),
            render: new ReactPlugin<Schemes, AreaExtra>({ createRoot }),
            arrange:  new AutoArrangePlugin<Schemes>(),
            scopes: new ScopesPlugin<Schemes>()
        };

        this.moduleManager = new ModuleManager({
            editor: this.context.editor,
            area: this.context.area,
            engine: this.context.engine,
            signalChange: this.signalOnChange
        });

        this.setUpEditor();
        this.setUpDataflowEngine();
        this.setUpArea();
        this.setUpConnection();
        this.setUpRendering();
        this.setUpScopes();
        this.setUpAutoArrange();

        AreaExtensions.zoomAt(this.context.area, this.context.editor.getNodes()).then(() => {});
    }




    /**
     * Causes an update of values throughout the tree structure
     */
    private updateDataFlow: () => void = ()=>{process(this.context.engine, this.context.editor)()}


    /**
     * Updates the react rendering of a node
     * @param id id of node
     */
    private updateNodeRendering: (id: string)=>void = (id: string)=>{
        this.context.area.update('node', id).then();
    }


    /**
     * Registers a function that is called whenever a node needs to be synchronized with
     * redux store for the purpose of previewing a ParseNode tree
     * @param entry
     */
    public registerOnChangeCallback(entry: {id: string, call: ()=>void}) {
        if(this.onChangeCalls.find(({id})=>{return id === entry.id})) {
            return
        }
        this.onChangeCalls.push(entry);
    }


    /**
     * Removes a function from callbacks
     * @param entryID id initially provided on registering the function
     */
    public unregisterOnChangeCallback(entryID: string) {
        this.onChangeCalls = this.onChangeCalls.filter(({id})=>{
            return id !== entryID
        })
    }


    /**
     * Invokes all callbacks if not in the process of loading a file.
     */
    private signalOnChange = ()=>{
        if(!this.loading) {
            this.onChangeCalls.forEach(({call})=>{
                call()
            })
        }
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // DATA SERIALIZATION AND UTILITIES
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Loads data previously created through exportNodes() back into the editor.
     * @param data nodes
     */
    public async importNodes(data: any) {
        this.loading = true;
        this.context.engine.reset();
        await this.context.editor.clear();
        this.nodesFromData(data)
            .catch(()=>{this.loading = false;})
            .then(()=>{this.loading = false;});
    }


    private async nodesFromData(data: any){
        return new Promise<void>(async (resolve, reject) => {

            if(!data) {
                reject();
                return;
            }

            let totalConnections: ConnProps[]  = [];

            for await (const { id, controls, type, xy , connections} of data.nodes) {
                let node = this.createNode(type, id);

                if(!node) {
                    reject("Invalid node type found in file");
                } else {
                    node.id = id;
                    node.controls.c.set(controls.c.data);
                    node.xTranslation = xy[0];
                    node.yTranslation = xy[1];

                    totalConnections.push(...connections);
                    await this.context.editor.addNode(node);
                    await this.context.area.translate(node.id, { x: node.xTranslation, y: node.yTranslation });
                }
            }

            for await (const connection of totalConnections) {
                this.context.editor.addConnection(connection)
                    .catch((e) => console.log(e))
                    .then(() => {});
            }

            resolve();
        });
    }


    /**
     * Exports node structure as a data structure that can later be read with importNodes()
     */
    public async exportNodes() : Promise<any> {

        const data: any = { nodes: [] };
        const nodes = this.context.editor.getNodes() as SkogNode[];
        const connections = this.context.editor.getConnections() as Connection<NumberNode, BinaryNode>[];

        for (const node of nodes) {
            const inputsEntries = Object.entries(node.inputs).map(([key, input]) => {
                return [key, input && this.serializePort(input)];
            });
            const outputsEntries = Object.entries(node.outputs).map(([key, output]) => {
                return [key, output && this.serializePort(output)];
            });
            const controlsEntries = Object.entries(node.controls).map(
                ([key, control]) => {
                    return [key, control && this.serializeControl(control)];
                }
            );

            data.nodes.push({
                id: node.id,
                label: node.label,
                xy: [node.xTranslation, node.yTranslation],
                type: node.type,
                outputs: Object.fromEntries(outputsEntries),
                inputs: Object.fromEntries(inputsEntries),
                controls: Object.fromEntries(controlsEntries),
                connections: []
            });

            data.nodes.map((node: any) => {
                for(const connection of connections){
                    if(
                        connection.source === node.id &&
                        node.connections.find((e:any)=>e.id === connection.id) === undefined
                    ) {

                        node.connections.push(this.serializeConnection(connection));
                    }
                }
                return node;
            });
        }
        return data;
    }

    private serializePort(
        port:
            | ClassicPreset.Input<ClassicPreset.Socket>
            | ClassicPreset.Output<ClassicPreset.Socket>
    ) {
        return {
            id: port.id,
            label: port.label,
            socket: {
                name: port.socket.name
            }
        };
    }

    private serializeControl(control: ClassicPreset.Control) {
        if (control instanceof ClassicPreset.InputControl) {
            return {
                __type: "ClassicPreset.InputControl" as const,
                id: control.id,
                readonly: control.readonly,
                type: control.type,
                value: control.value
            };
        }
        if (control instanceof NodeControl) {
            return {
                data: control.getData()
            }
        }
        return null;
    }

    private serializeConnection(
        connection: Connection<NumberNode, BinaryNode>
    ) {
        return {
            id: connection.id,
            source: connection.source,
            sourceOutput: connection.sourceOutput,
            target: connection.target,
            targetInput: connection.targetInput
        };
    }


    /**
     * Exports the current data structure as its equivalent ParseNode structure
     */
    public exportAsParseTree() {
        return createJSONGraph(this.context.editor);
    }


    /**
     * Removes all nodes from the current canvas
     */
    public clearNodes() {
        this.context.editor.clear().then();
    }


    /**
     * Deletes the currently selected node on the canvas
     */
    public async deleteSelected() {
        if(this.selectedNode && ( this.context.editor.getNode(this.selectedNode)) ) {
            await this.removeNodeConnections(this.selectedNode);
            this.context.editor.removeNode(this.selectedNode).then(()=>{});
        }
    }


    private async removeNodeConnections(nodeID: string) {
        if( this.context.editor.getNode(nodeID) ) {
            const connections = this.context.editor.getConnections().filter(c => {
                return c.source === this.selectedNode || c.target === this.selectedNode
            })
            for (const connection of connections) {
                await this.context.editor.removeConnection(connection.id)
            }
        }
    }





    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // VIEW MANIPULATION
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Brings all nodes on the canvas into view
     */
    public resetView () {
        AreaExtensions.zoomAt(this.context.area, this.context.editor.getNodes()).then(() => {});
    }

    /**
     * Focuses the view on the currently selected node, as indicated by a highlight
     */
    public focusViewOnSelectedNode() {
        let node: SkogNode | undefined;
        if(this.selectedNode && (node = this.context.editor.getNode(this.selectedNode)) ) {
            AreaExtensions.zoomAt(this.context.area, [node]).catch(()=>{}).then(() => {});
        }
    }



    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // NODE CREATION
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a menu with nodes the user can create
     * @private
     */
    private createContextMenu() {
        const nodeTypesToDefinition : (nodeTypes: NodeType[])=>ItemDefinition<Schemes>[] = (types) =>{
            return types.map(node=>{
                return [node.toString(), ()=>{return this.createNode(node) as SkogNode}]
            })
        }
        const mathNodes = nodeTypesToDefinition ([
            NodeType.Add,
            NodeType.Div,
            NodeType.Mul,
            NodeType.Sub,
            NodeType.Prod,
            NodeType.Pow,
            NodeType.Sum,
            NodeType.Number
        ])
        const inputNodes = nodeTypesToDefinition ([
            NodeType.DropdownInput,
            NodeType.NumberInput
        ])
        const moduleNodes = nodeTypesToDefinition ([
            NodeType.Module,
            NodeType.ModuleInput,
            NodeType.ModuleOutput
        ])
        const displayNodes = nodeTypesToDefinition ( [
            NodeType.Display
        ])

        return new ContextMenuPlugin<Schemes>({
            items: ContextMenuPresets.classic.setup([
                ["Math", mathNodes],
                ["Inputs", inputNodes],
                ["Displays", displayNodes],
                ["Module", moduleNodes]
            ])
        });
    }

    /**
     * Constructs a node based on type
     * @param type
     * @param id
     * @private
     */
    private createNode(type: NodeType, id?: string) : SkogNode | undefined {
        const updateNodeRender = this.updateNodeRendering;
        const onValueUpdate = this.updateDataFlow;
        const removeConnections = this.removeNodeConnections;
        const updateStore = this.signalOnChange;
        switch(type) {
            case NodeType.ModuleOutput: return new ModuleOutput(updateNodeRender, onValueUpdate);
            case NodeType.Module: return new ModuleNode(this.moduleManager, removeConnections, updateNodeRender, onValueUpdate);
            case NodeType.ModuleInput: return new ModuleInput(updateNodeRender, onValueUpdate )
            case NodeType.Output: return new OutputNode(updateNodeRender, onValueUpdate, id);
            case NodeType.Number: return new NumberNode(0, updateNodeRender, onValueUpdate, id);
            case NodeType.NumberInput: return new NumberInputNode(updateNodeRender, onValueUpdate, updateStore, id);
            case NodeType.DropdownInput: return new DropdownInputNode(updateNodeRender, onValueUpdate, updateStore, id);
            case NodeType.Display: return new DisplayPieNode(updateNodeRender, updateStore, id)
            case NodeType.Add: return new BinaryNode(NodeType.Add, updateNodeRender, id);
            case NodeType.Sub: return new BinaryNode(NodeType.Sub, updateNodeRender, id);
            case NodeType.Mul: return new BinaryNode(NodeType.Mul, updateNodeRender, id);
            case NodeType.Pow: return new BinaryNode(NodeType.Pow, updateNodeRender, id);
            case NodeType.Div: return new BinaryNode(NodeType.Div, updateNodeRender, id);
            case NodeType.Sum: return new NaryNode(NodeType.Sum, updateNodeRender, id);
            case NodeType.Prod: return new NaryNode(NodeType.Prod, updateNodeRender, id);
            default: return undefined;
        }
    }






    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // SETUP FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private setUpEditor() {
        this.context.editor.use(this.context.area);
        this.context.editor.use(this.context.engine);

        this.context.editor.addPipe((context) => {
            if (["connectioncreated", "connectionremoved", "noderemoved"].includes(context.type)) {
                this.updateDataFlow();
                this.signalOnChange();
            }
            return context;
        });
    }

    private setUpConnection() {
        this.context.connection.addPreset(ConnectionPresets.classic.setup());
    }

    private setUpRendering() {
        this.context.render.addPreset(Presets.contextMenu.setup({delay:10}));
        this.context.render.addPreset(
            Presets.classic.setup({
                customize: {
                    control(data) {
                        switch(data.payload.type) {
                            case NodeType.Display: return DisplayPieNodeControlContainer
                            case NodeType.NumberInput: return NumberInputControlContainer
                            case NodeType.DropdownInput: return DropdownInputControlContainer
                            case NodeType.Output: return OutputNodeControlContainer
                        }
                        return NumberControlComponent;
                    },
                    node() {
                        // Custom node goes here
                        return Presets.classic.Node;
                    }
                }
            })
        );
    }

    private setUpScopes() {
        this.context.scopes.addPreset(ScopesPresets.classic.setup());
    }

    private setUpAutoArrange() {
        this.context.arrange.addPreset(ArrangePresets.classic.setup());
    }


    private setUpArea() {
        this.context.area.use(this.context.connection);
        this.context.area.use(this.createContextMenu());
        this.context.area.use(this.context.render);
        this.context.area.use(this.context.scopes);
        this.context.area.use(this.context.arrange);

        AreaExtensions.selectableNodes(this.context.area, AreaExtensions.selector(), {
            accumulating: AreaExtensions.accumulateOnCtrl()
        });

        this.context.area.addPipe((context)=> {
            if(context.type === "nodepicked") {
                this.selectedNode = context.data.id;
            }
            if (context.type === "nodetranslated") {
                const node = this.context.editor.getNode(context.data.id);
                if(node) {
                    [node.yTranslation, node.xTranslation] = [context.data.position.x, context.data.position.y]
                }
            }
            return context;
        })

    }

    private setUpDataflowEngine() {

    }

}