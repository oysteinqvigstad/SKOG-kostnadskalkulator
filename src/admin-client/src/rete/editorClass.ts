import {NodeEditor} from "rete";
import {Schemes, SkogNode} from "./nodes/types";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {Presets, ReactPlugin} from "rete-react-plugin";
import {DataflowEngine} from "rete-engine";
import {Presets as ScopesPresets, ScopesPlugin} from "rete-scopes-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {createJSONGraph} from "./adapters";
import {createRoot} from "react-dom/client";
import {exportGraph, importGraph} from "./serialization";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {getSkogNodeFromNodeType} from "./utility/utility";
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
    public asParseTree = ()=>{ return createJSONGraph(this.context.editor)}

    public dataController = {
        clear: this.clearGraph,
        set: this.loadGraph,
        get: this.getGraph
    }

    public viewController = {
        reset: this.resetView,
        focusSelected: this.focusViewOnSelectedNode
    }

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

        [
            this.setUpConnection,
            this.setUpRendering,
            this.setUpScopes,
            this.setUpAutoArrange,
            this.setUpArea,
            this.setUpDataflowEngine,
            this.setUpEditor
        ].forEach(init=>init())

        AreaExtensions.zoomAt(this.context.area, this.context.editor.getNodes()).then(() => {});
    }

    private updateDataFlow: () => void = ()=>{process(this.context.engine, this.context.editor)}
    private updateNodeRendering: (id: string)=>void = (id: string)=>{
        this.context.area.update('node', id).then();
    }

    public registerOnChangeCallback(entry: {id: string, call: ()=>void}) {
        this.onChangeCalls.push(entry);
    }

    public unregisterOnChangeCallback(entryID: string) {
        this.onChangeCalls = this.onChangeCalls.filter(({id})=>{
            return id !== entryID
        })
    }

    private signalOnChange = ()=>{
        this.onChangeCalls.forEach(({call})=>{
            call()
        })
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // DATA SERIALIZATION AND UTILITIES
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    private loadGraph(data: any) {
        importGraph(
            data,
            this.context.editor,
            this.context.engine,
            this.context.area,
            this.signalOnChange
        )
    }

    private getGraph() {
        return exportGraph(this.context.editor)
    }

    private clearGraph() {
        this.context.editor.clear().then();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // VIEW MANIPULATION
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    private resetView () {
        AreaExtensions.zoomAt(this.context.area, this.context.editor.getNodes()).then(() => {});
    }

    private focusViewOnSelectedNode() {
        let node: SkogNode | undefined;
        if(this.selectedNode && (node = this.context.editor.getNode(this.selectedNode)) ) {
            AreaExtensions.zoomAt(this.context.area, [node]).catch(()=>{}).then(() => {});
        }
    }



    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // NODE CREATION
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    private createContextMenu() {
        const createNode = (type: NodeType) => { return getSkogNodeFromNodeType(
            type,
            this.updateDataFlow,
            this.updateNodeRendering,
            this.signalOnChange
        ) as SkogNode }
        const nodeTypesToDefinition : (nodeTypes: NodeType[])=>ItemDefinition<Schemes>[] = (types) =>{
            return types.map(node=>{
                return [node.toString(), ()=>{return createNode(node)}]
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // SETUP FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private setUpEditor() {
        this.context.editor.use(this.context.area);
        this.context.editor.use(this.context.engine);

        this.context.editor.addPipe((context) => {
            if (["connectioncreated", "connectionremoved"].includes(context.type)) {
                this.updateDataFlow()
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