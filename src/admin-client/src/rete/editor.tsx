import {createRoot} from "react-dom/client";
import {ClassicPreset, NodeEditor} from "rete";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {Presets, ReactArea2D, ReactPlugin} from "rete-react-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {Presets as ScopesPresets, ScopesPlugin} from "rete-scopes-plugin";
import {DataflowEngine} from "rete-engine";
import {
    DropdownValues,
    DropdownValuesControl
} from "./customControls/dropdownValues";
import {Schemes} from "./nodes/types";
import {exportGraph, importGraph} from "./serialization";
import {createJSONGraph} from "./adapters";
import {calculateNode, getNodeByID, NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {NumberNode} from "./nodes/numberNode";
import {BinaryNode} from "./nodes/binaryNode";
import {NaryNode} from "./nodes/naryNode";
import {InputNode} from "./nodes/inputNode";
import {DropdownSelection, DropdownSelectionControl} from "./customControls/dropdownSelection";
import {OutputNode} from "./nodes/outputNode";
import {LabelNode} from "./nodes/labelNode";




type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra;


/**
 * Processes the graph to update the engine with the latest values.
 * process() is called when the value of a node controller changes.
 * NB: Make sure process is not called before the graph is done loading,
 * as engine.reset() being called will cause cancellation errors to be raised
 * if a fetch() call is in progress.
 * @param engine engine
 * @param editor editor
 */
export function process (engine: DataflowEngine<Schemes>, editor: NodeEditor<Schemes>) {
    return function () {
        engine.reset();
        editor
            .getNodes()
            .forEach((node) => {
                engine.fetch(node.id).catch(() => {});
            });
    }
}


/**
 * Loads a graph from the browser's local storage.
 * If the file does not exist, the function will reject.
 * @param fileName name of the file to load
 * @param editor editor
 * @param engine engine
 * @param area area
 */
async function  loadGraphFromLocalStorage(
    fileName: string,
    editor: NodeEditor<Schemes>,
    engine: DataflowEngine<Schemes>,
    area: AreaPlugin<Schemes, AreaExtra>,
) : Promise<void> {
    return new Promise((resolve, reject) => {
        if(!localStorage) {
            reject("Local storage not available");
        }
        const graph = localStorage.getItem(fileName);
        if(graph) {
            importGraph(JSON.parse(graph), editor, engine, area)
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    reject("Failed to load graph from existing file");
                });
        } else {
            reject("No graph found");
        }
    });
}


/**
 * Saves the current graph to the browser's local storage.
 * @param fileName name of the file to save
 * @param onOverwriteVerification function to call to verify if the user wants to overwrite the file
 * @param editor editor
 */
async function saveGraphToLocalStorage(
    fileName: string,
    onOverwriteVerification: ()=>boolean = ()=>true,
    editor: NodeEditor<Schemes>
): Promise<void> {
    return new Promise((resolve, reject) => {
        exportGraph(editor)
            .catch((e) => console.log("error", e))
            .then((data) => {
                    if (localStorage) {
                        if(localStorage.getItem(fileName) &&
                            !onOverwriteVerification()) {
                            reject();
                        } else {
                            localStorage.setItem(fileName, JSON.stringify(data));
                            resolve();
                        }
                    } else {
                        reject("Local storage not available");
                    }
                }
            );
    });
}


/**
 * Creates a context menu for use with the area plugin. Allows the user to create
 * new nodes with the set schemes.
 * @param editor
 * @param area
 * @param onInputChange
 */
function createContextMenu(
    editor: NodeEditor<Schemes>,
    area: AreaPlugin<Schemes, AreaExtra>,
    onInputChange: () => void
) : ContextMenuPlugin<Schemes> {
    // NB: For a node to be copyable, it must implement clone() in a way
    // that does not require 'this' to be valid in its context.
    const updateNodeRender =
        (c:  ClassicPreset.InputControl<"number", number> | ClassicPreset.InputControl<"text", string>) => { area.update("control", c.id) }
    return new ContextMenuPlugin<Schemes>({
        items: ContextMenuPresets.classic.setup(
            [["Math",
                [["Number", () => new NumberNode(0, onInputChange)],
                ["Add", () => new BinaryNode(NodeType.Add, updateNodeRender)],
                ["Sub", () => new BinaryNode(NodeType.Sub, updateNodeRender)],
                ["Mul", () => new BinaryNode(NodeType.Mul, updateNodeRender)],
                ["Pow", () => new BinaryNode(NodeType.Pow, updateNodeRender)],
                ["Div", () => new BinaryNode(NodeType.Div, updateNodeRender)],
                ["Sum", () => new NaryNode(NodeType.Sum, updateNodeRender)],
                ["Prod", () => new NaryNode(NodeType.Prod, updateNodeRender)]]],
            ["Input", () => new InputNode(0, onInputChange)],
                ["Output", () => new OutputNode(updateNodeRender)],
                ["Label", ()=> new LabelNode(onInputChange)]
        ])
    });
}




/**
 * Creates a new editor and returns a promise with an object containing functions to
 * control the editor.
 * @param container HTML element to contain the editor
 * @returns Promise with an object containing functions destroy(), load(), save(), clear() and testJSON()
 */
export async function createEditor(container: HTMLElement) {
    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
    const arrange = new AutoArrangePlugin<Schemes>();
    const engine = new DataflowEngine<Schemes>();
    const scopes = new ScopesPlugin<Schemes>();

    let selectedNode: string = "";

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl()
    });

    render.addPreset(
        Presets.classic.setup({
            customize: {
                control(data) {
                    if (data.payload instanceof DropdownValuesControl) {
                        const updateFunc = data.payload.onElementUpdate;
                        const initialState = data.payload.initialState;
                        return () => {return <DropdownValues onUpdate={updateFunc} initialState={initialState}/>}
                    }
                    if(data.payload instanceof DropdownSelectionControl) {
                        const onSelection = data.payload.onSelection;
                        const id = data.payload.id;
                        const initialState = data.payload.initialState;
                        return () => {return <DropdownSelection onSelection={
                            (input) => {
                                onSelection(input);
                                area.update("control", id)
                            }
                        } inputAlternatives={initialState}/>}
                    }

                    if (data.payload instanceof ClassicPreset.InputControl) {
                        return Presets.classic.Control;
                    }
                    return null;
                }
            }
        })
    );




    // context menu can be customized here by adding a Customize object inside
    // object passed to setup(), with customize : { ... }
    render.addPreset(Presets.contextMenu.setup({delay:10}));



    connection.addPreset(ConnectionPresets.classic.setup());
    arrange.addPreset(ArrangePresets.classic.setup());

    editor.use(area);
    editor.use(engine);

    scopes.addPreset(ScopesPresets.classic.setup());


    area.use(connection);
    area.use(createContextMenu(editor, area, process(engine, editor)));
    area.use(render);

    area.use(scopes);

    area.use(arrange);


    // For testing purposes
    let currentJSONTree: ParseNode | undefined;

    editor.addPipe((context) => {
        if (["connectioncreated", "connectionremoved"].includes(context.type)) {
            process(engine, editor)();
        }
        return context;
    });

    area.addPipe((context)=> {
        if(context.type === "nodepicked") {
            currentJSONTree = createJSONGraph(editor);
            selectedNode = context.data.id;
            const nodeResult = getNodeByID(context.data.id, currentJSONTree);
            if(!nodeResult) {
                console.log("Node not in tree due to multiple roots");
            } else {
                console.log(`Calculated value for node ${context.data.id} is: ${calculateNode(nodeResult)}`);
            }
        }
        return context;
    })

    area.addPipe((context) => {



        return context;
    });



    area.addPipe((context) => {
        if (context.type === "nodetranslated") {
            const x = context.data.position.x;
            const y = context.data.position.y;
            const node = editor.getNode(context.data.id);
            node.yTranslation = y;
            node.xTranslation = x;
        }
        return context;
    });


    AreaExtensions.zoomAt(area, editor.getNodes()).then(() => {});




    return {
        destroy: () => area.destroy(),
        load: async (
            onLoading: ()=>void = ()=>{},
            onLoaded: ()=>void = ()=>{},
            onUnsavedProgress: ()=>void = ()=>{},
            onPotentialOverwrite: ()=>void = ()=>{},
            onFailedToLoad: ()=>void = ()=>{}
        ) => {
            engine.reset();
            onLoading();
            await editor.clear();

            loadGraphFromLocalStorage("graph", editor, engine, area)
                .then(async () => {
                    onLoaded();
                })
                .catch(() => {onFailedToLoad()});
        },
        save: () => {
            saveGraphToLocalStorage(
                "graph",
                ()=>{return window.confirm("Overwrite existing graph?");},
                editor
            )
                .then(() => {
                    console.log("Saved");
                })
                .catch(() => {
                    console.log("Failed to save");
                });
        },
        clear: () =>  {

            editor.clear();
        },
        testJSON: () => {
            currentJSONTree = createJSONGraph(editor);
            console.log(JSON.stringify(currentJSONTree, null, 2));
        },
        deleteSelected: async () => {
            const connections = editor.getConnections().filter(c => {
                return c.source === selectedNode || c.target === selectedNode
            })

            for (const connection of connections) {
                await editor.removeConnection(connection.id)
            }
            await editor.removeNode(selectedNode)
            editor.removeNode(selectedNode).then(()=>{});
        },
        viewControllers: {
            resetView: () => {
                AreaExtensions.zoomAt(area, editor.getNodes()).then(() => {});
            },
            focusSelectedNode: () => {
                AreaExtensions.zoomAt(area, [editor.getNode(selectedNode)]).then(() => {});
            },
            zoomIn: () => {
            }
        }
    };
}
