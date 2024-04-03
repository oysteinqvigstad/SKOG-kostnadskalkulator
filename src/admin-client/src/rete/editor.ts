import {NodeEditor} from "rete";
import {Schemes, ReteNode} from "./nodes/types";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {Presets, ReactArea2D, ReactPlugin} from "rete-react-plugin";
import {DataflowEngine} from "rete-engine";
import {Presets as ScopesPresets, ScopesPlugin} from "rete-scopes-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {createParseNodeGraph} from "./adapters";
import {createRoot} from "react-dom/client";
import {NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {ItemDefinition} from "rete-context-menu-plugin/_types/presets/classic/types";
import {ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {ModuleManager} from "./moduleManager";
import {GraphSerializer} from "./graphSerializer";
import {NodeFactory} from "./nodeFactory";
import {canCreateConnection} from "./sockets";


export type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra;

export interface EditorContext {
    editor: NodeEditor<Schemes>,
    area: AreaPlugin<Schemes,  AreaExtra>,
    connection: ConnectionPlugin<Schemes, AreaExtra>,
    render: ReactPlugin<Schemes, AreaExtra>,
    engine: DataflowEngine<Schemes>,
    scopes: ScopesPlugin<Schemes>,
    arrange: AutoArrangePlugin<Schemes>
}


export interface EditorDataPackage {
    main: any,
    modules: {name: string, data: any}[]
}


export class Editor {

    private context: EditorContext;
    private readonly factory: NodeFactory;
    private selectedNode: string | undefined;
    private onChangeCalls: {id: string, call: (nodes?: ParseNode[])=>void}[] = []
    private loading = false;
    private readonly moduleManager: ModuleManager;
    private serializer: GraphSerializer;
    private stashedMain: any | undefined;
    private currentModule = "main";

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

        this.moduleManager = new ModuleManager();

        this.factory = new NodeFactory(
            this.moduleManager,
            (id: string)=>{ this.context.area.update('node', id)},
            this.updateDataFlow.bind(this),
            this.removeNodeConnections.bind(this),
            this.signalOnChange.bind(this)
        );

        this.setUpEditor();
        this.setUpDataflowEngine();
        this.setUpArea();
        this.setUpConnection();
        this.setUpRendering();
        this.setUpScopes();
        this.setUpAutoArrange();

        this.serializer = new GraphSerializer(
            this.context.editor,
            this.factory,
            this.context.area
        )

        AreaExtensions.zoomAt(this.context.area, this.context.editor.getNodes()).then(() => {});
    }

    public loadMainGraph() {
        if(this.currentModule === "main") { return }
        this.currentModule = 'main';
        this.importNodes(this.stashedMain).then(()=>{
            this.resetView();
        });
    }

    public loadModule(name: string) {
        if(this.currentModule === name || !this.moduleManager.hasModule(name)) { return }
        if(this.currentModule === 'main') { this.stashedMain = this.exportNodes() }
        this.currentModule = name;
        this.importNodes(this.moduleManager.getModuleData(name)).then(()=>{
            this.resetView();
        })
    }

    public saveCurrentModule() {
        if(this.currentModule === 'main' || !this.moduleManager.hasModule(this.currentModule)) { return }
        this.moduleManager.setModuleData(this.currentModule, this.exportNodes());
    }

    public getModuleNames = ()=>{return this.moduleManager.getModuleNames()}

    public addNewModule(name?: string) {
        if(name === 'main') { return }
        if(this.currentModule === 'main') {
            this.stashedMain = this.exportNodes()
        }
        this.context.editor.clear();
        this.currentModule = name || ""
        this.moduleManager.addModuleData(name || "");
        this.loadModule(name || "")
    }

    public getCurrentModuleName() {
        return this.currentModule;
    }








    /**
     * Causes an update of values throughout the tree structure
     */
    private updateDataFlow() {
        this.context.engine.reset();
        this.context.editor
            .getNodes()
            .forEach(async (node) => {
                await this.context.engine.fetch(node.id).catch(() => {});
            });
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
        if(!this.loading && this.currentModule === 'main') {
            const nodes = this.exportAsParseTree()
            this.onChangeCalls.forEach(({call})=>{
                call(nodes)
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
        this.serializer.importNodes(data)
            .catch(()=>{this.loading = false;})
            .then(()=>{this.loading = false;});
    }

    public exportNodes() {
        return this.serializer.exportNodes();
    }

    public exportWithModules() : EditorDataPackage {
        this.loadMainGraph();
        return {
            main: this.exportNodes(),
            modules: this.moduleManager.getAllModuleData()
        }
    }

    public importWithModules(data: EditorDataPackage) {
        this.importNodes(data.main);
        this.currentModule = 'main';
        this.moduleManager.overwriteModuleData(data.modules);
    }


    /**
     * Exports the current data structure as its equivalent ParseNode structure
     */
    public exportAsParseTree() {
        if(this.currentModule !== 'main') { //TODO: logic for exporting parse tree of main only
            const tempEditor = new NodeEditor<Schemes>();
        }
        return createParseNodeGraph(this.context.editor);
    }


    /**
     * Removes all nodes from the current canvas
     */
    public clearNodes() {
        this.context.editor.clear().then(()=>{
            this.moduleManager.overwriteModuleData([])
            }
        );
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
                return c.source === nodeID || c.target === nodeID
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
        let node: ReteNode | undefined;
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
                return [node.toString(), ()=>{return this.factory.createNode(node) as ReteNode}]
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
            NodeType.Number,
            NodeType.Min,
            NodeType.Max,
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
            NodeType.Display,
            NodeType.BarDisplay,
            NodeType.PreviewDisplay
        ])


        return new ContextMenuPlugin<Schemes>({
            items: ContextMenuPresets.classic.setup([
                ["Math", mathNodes],
                ["Inputs", inputNodes],
                ["Displays", displayNodes],
                ["Module", moduleNodes],
                ["Output", ()=>{ return this.factory.createNode(NodeType.Output) as ReteNode}]
            ])
        });
    }






    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // SETUP FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private setUpEditor() {
        this.context.editor.use(this.context.area);
        this.context.editor.use(this.context.engine);

        this.context.editor.addPipe((context) => {
            if(context.type === "connectioncreate" && !canCreateConnection(this.context.editor, context.data)) {
                return;
            }
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
                        return data.payload.controlContainer
                    },
                    node() {
                        // Custom node goes here
                        return Presets.classic.Node;
                    },
                    socket(context) {
                        return context.payload.component;
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
                console.log("selected:", context.data.id);
            }
            if (context.type === "nodetranslated") {
                const node = this.context.editor.getNode(context.data.id);
                if(node) {
                    [node.yTranslation, node.xTranslation] = [context.data.position.y, context.data.position.x]
                }
            }
            return context;
        })

    }

    private setUpDataflowEngine() {

    }

}