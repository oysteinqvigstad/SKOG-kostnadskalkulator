import type {ParseNode} from "../nodes/parseNode";
import {isOutputNode, type OutputNode} from "../nodes/outputNode";
import {type InputNode, isInputNode} from "../nodes/inputNode";
import {calculateNode} from "../traversal/calculation";


export class ParseTree {

    private subTrees: ParseNode[] = []
    private inputs: InputNode[] = []
    private outputs: OutputNode[] = []
    private nodeLookup: Map<string, number> = new Map<string, number> // maps node id to the index of its subtree
    private defaultInputValues: Map<string, number> = new Map<string, number>



    constructor(data: any | string) {
        if(typeof data === "string") {
            this.fromJSON(data);
        } else {
            this.fromData(data);
        }
        // construct subtrees
        this.fillNodeLookup();

        this.forEach((node, index) => {
            if(isInputNode(node)) {
                this.inputs.push(node);
            }
        })

        this.forEach((node, index) => {
            if(isOutputNode(node)) {
                this.outputs.push(node);
            }
        })

        this.inputs.forEach((input)=>{
            this.defaultInputValues.set(input.id, input.value);
        })
    }


    private fromJSON(jsonString: string) {
        const data = JSON.parse(jsonString);
        this.fromData(data);
    }

    private fromData(data: any) {
        if(Array.isArray(data)) {
            data.forEach((subTreeRoot)=> {
                if(this.isParseNode(subTreeRoot)) {
                    this.subTrees.push(subTreeRoot)
                }
            })
            this.forEach((node)=> {
                if(!this.isParseNode(node)){
                    throw new Error ("Tree contains an object not adhering to ParseNode structure");
                }
            })
        } else {
            throw new Error("Root of JSON is expected to be an array");
        }
    }


    private isParseNode(node: any): node is ParseNode {
        return (
            typeof node.id === 'string' &&
            typeof node.type === 'string' &&
            typeof node.value === 'number' &&
            typeof node.description === 'string' &&
            (node.left === undefined || typeof node.left === 'object') &&
            (node.right === undefined || typeof node.right === 'object') &&
            (node.child === undefined || typeof node.child === 'object') &&
            (node.inputs === undefined || Array.isArray(node.inputs))
        );
    }


    forEach(func: (node: ParseNode, treeIndex: number)=>void) {
        this.subTrees.forEach((node, treeIndex)=>{
            this.forEachNode(node, (node)=> {
                func(node, treeIndex);
            });
        })
    }


    getNodeValue(node: string | ParseNode) : number | undefined {
        const parseNode =
            (typeof node === "string") ? this.getNodeByID(node) : node;
        if(!parseNode) {
            return undefined
        }
        return calculateNode(parseNode);
    }


    getNodeByID(id: string) : ParseNode | undefined {
        let matchNode: ParseNode | undefined;
        const treeIndex = this.nodeLookup.get(id);

        if(treeIndex) {
            const node = this.subTrees[treeIndex];
            if(node) {
                this.forEachNode(node, (n)=>{
                    if(n.id === id) {
                        matchNode = node;
                    }
                })
            }
        }
        return matchNode;
    }

    getInputDefault(inputID: string) : number | undefined {
        return this.defaultInputValues.get(inputID);
    }

    getInputs() : InputNode[] {
        return this.inputs;
    }

    getOutputs() : OutputNode[] {
        return this.outputs;
    }


    private forEachNode(node: ParseNode, func: (node: ParseNode)=>void) {
        let nodes = [node];
        while(nodes.length != 0) {
            const currentNode = nodes.pop();

            if(currentNode) {
                func(currentNode);
            }

            if(currentNode?.left) {  nodes.push(currentNode.left); }
            if(currentNode?.right) { nodes.push(currentNode.right); }
            if(currentNode?.child) {  nodes.push(currentNode.child); }
            if(currentNode?.inputs) { nodes.push(...currentNode.inputs); }
        }
    }

    private fillNodeLookup() {
        this.forEach((node, index) => {
            this.nodeLookup.set(node.id, index);
        })
    }
}