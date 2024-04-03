import {ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {Editor} from "./editor";

/**
 * Creates a new editor and returns a promise with an object containing functions to
 * control the editor.
 * @param container HTML element to contain the editor
 * @returns Promise with an object containing functions destroy(), load(), save(), clear() and testJSON()
 */
export async function createEditor(container: HTMLElement) {

    const editor = new Editor(container);

    return {
        destroy: ()=> {editor.destroyArea()},
        load: async (
            onLoading: ()=>void = ()=>{},
            onLoaded: ()=>void = ()=>{},
            onUnsavedProgress: ()=>void = ()=>{},
            onPotentialOverwrite: ()=>void = ()=>{},
            onFailedToLoad: ()=>void = ()=>{}
        ) => {
            if(localStorage) {
                const data = localStorage.getItem('graph');
                if(data) {
                    editor.importWithModules(JSON.parse(data));
                }
            }
        },
        save: () => {
            if(localStorage) {
                localStorage.setItem('graph', JSON.stringify(editor.exportWithModules()));
            }
        },
        clear: () =>  {
            editor.clearNodes();
        },
        import: (data: any) => {
            editor.importWithModules(data);
        },
        export: () => {
            return {
                graph: editor.exportWithModules(),
                parseNodes: editor.exportAsParseTree() ?? []
            }
        },
        testJSON: () => {
            console.log(editor.exportAsParseTree())
        },
        deleteSelected: async () => {
            editor.deleteSelected().then();
        },
        registerCallBack: (id: string, newCallback: (nodes?: ParseNode[]) => void) => {
            editor.registerOnChangeCallback({id: id, call: newCallback})
        },
        viewControllers: {
            resetView: () => {
                editor.resetView();
            },
            focusSelectedNode: () => {
                editor.focusViewOnSelectedNode();
            },
        },
        getCurrentTree: ()=> {
            return editor.exportAsParseTree();
        },
        editor: editor
    } as ReteFunctions;
}


export interface ReteFunctions {
    destroy: () => void,
    load: (onLoading?: () => void, onLoaded?: () => void, onUnsavedProgress?: () => void, onPotentialOverwrite?: () => void, onFailedToLoad?: () => void) => Promise<void>,
    save: () => void,
    clear: () => void,
    import: (data: any) => void,
    export: () => {graph: any, parseNodes: ParseNode[]},
    testJSON: () => ParseNode[] | undefined,
    deleteSelected: () => void,
    registerCallBack: (id: string, newCallback: (nodes?: ParseNode[]) => void) => void,
    viewControllers: {
        resetView: () => void,
        focusSelectedNode: () => void
    },
    getCurrentTree: () => ParseNode[] | undefined,
    editor: Editor
}