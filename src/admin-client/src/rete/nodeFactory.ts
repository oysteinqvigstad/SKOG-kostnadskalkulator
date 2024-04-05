import {ModuleManager} from "./moduleManager";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ModuleOutput} from "./nodes/moduleNodes/moduleOutput";
import {ModuleNode} from "./nodes/moduleNodes/moduleNode";
import {ModuleInput} from "./nodes/moduleNodes/moduleInput";
import {OutputNode} from "./nodes/IONodes/outputNode/outputNode";
import {NumberNode} from "./nodes/mathNodes/numberNode";
import {NumberInputNode} from "./nodes/IONodes/numberInputNode/numberInputNode";
import {DropdownInputNode} from "./nodes/IONodes/dropdownInputNode/dropdownInputNode";
import {DisplayPieNode} from "./nodes/displayNodes/displayPieNode/displayPieNode";
import {DisplayBarNode} from "./nodes/displayNodes/displayBarNode/displayBarNode";
import {BinaryNode} from "./nodes/mathNodes/binaryNode";
import {NaryNode} from "./nodes/mathNodes/naryNode";
import {ChooseNode} from "./nodes/controlNodes/chooseNode";
import {DisplayPreviewNode} from "./nodes/displayNodes/displayPreviewNode/displayPreviewNode";
import {DisplayListNode} from "./nodes/displayNodes/displayListNode/displayListNode";


export class NodeFactory {
    constructor(
        private moduleManager: ModuleManager,
        private updateNodeRendering: (id: string)=>void = ()=>{},
        private updateDataFlow: ()=>void = ()=>{},
        private removeNodeConnections: (id: string, connection?:{input?:string, output?:string})=>Promise<void> = ()=>Promise.resolve(),
        private signalOnChange: () => void = ()=>{}
    ) {}

    public createNode(type: NodeType, id?: string) {
        switch(type) {
            case NodeType.ModuleOutput: return new ModuleOutput(this.updateNodeRendering, this.updateDataFlow, "", id);
            case NodeType.Module: return new ModuleNode(this.moduleManager, this.removeNodeConnections, this.updateNodeRendering, this.updateDataFlow, id);
            case NodeType.ModuleInput: return new ModuleInput(this.updateNodeRendering, this.updateDataFlow, "", id)
            case NodeType.Output: return new OutputNode(this.updateNodeRendering, this.updateDataFlow, id);
            case NodeType.Number: return new NumberNode(0, this.updateNodeRendering, this.updateDataFlow, id);
            case NodeType.NumberInput: return new NumberInputNode(this.updateNodeRendering, this.updateDataFlow, this.signalOnChange, id);
            case NodeType.DropdownInput: return new DropdownInputNode(this.updateNodeRendering, this.updateDataFlow, this.signalOnChange, id);
            case NodeType.Display: return new DisplayPieNode(this.updateNodeRendering, this.signalOnChange, id);
            case NodeType.BarDisplay: return new DisplayBarNode(this.updateNodeRendering, this.signalOnChange, id);
            case NodeType.PreviewDisplay: return new DisplayPreviewNode(this.updateNodeRendering, this.signalOnChange, id);
            case NodeType.ListDisplay: return new DisplayListNode(this.updateNodeRendering, this.signalOnChange, id);
            case NodeType.Add: return new BinaryNode(NodeType.Add, this.updateNodeRendering, id);
            case NodeType.Sub: return new BinaryNode(NodeType.Sub, this.updateNodeRendering, id);
            case NodeType.Mul: return new BinaryNode(NodeType.Mul, this.updateNodeRendering, id);
            case NodeType.Pow: return new BinaryNode(NodeType.Pow, this.updateNodeRendering, id);
            case NodeType.Div: return new BinaryNode(NodeType.Div, this.updateNodeRendering, id);
            case NodeType.Sum: return new NaryNode(NodeType.Sum, this.updateNodeRendering, id);
            case NodeType.Prod: return new NaryNode(NodeType.Prod, this.updateNodeRendering, id);
            case NodeType.Min: return new NaryNode(NodeType.Min, this.updateNodeRendering, id);
            case NodeType.Max: return new NaryNode(NodeType.Max, this.updateNodeRendering, id);
            case NodeType.Choose: return new ChooseNode(this.updateNodeRendering, this.updateDataFlow, this.removeNodeConnections, id);
        }
        throw new Error("NodeFactory.createNode() was invoked with " + type + " which has no implementation in createNode().");
    }
}