import {ModuleManager} from "./moduleManager";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ModuleOutput} from "./nodes/moduleSystem/moduleOutput";
import {ModuleNode} from "./nodes/moduleSystem/moduleNode";
import {ModuleInput} from "./nodes/moduleSystem/moduleInput";
import {OutputNode} from "./nodes/outputNode";
import {NumberNode} from "./nodes/numberNode";
import {NumberInputNode} from "./nodes/numberInputNode";
import {DropdownInputNode} from "./nodes/dropdownInputNode";
import {DisplayPieNode} from "./nodes/displayPieNode";
import {DisplayBarNode} from "./nodes/displayBarNode";
import {BinaryNode} from "./nodes/binaryNode";
import {NaryNode} from "./nodes/naryNode";


export class NodeFactory {
    constructor(
        private moduleManager: ModuleManager,
        private updateNodeRendering: (id: string)=>void = ()=>{},
        private updateDataFlow: ()=>void = ()=>{},
        private removeNodeConnections: (id: string)=>Promise<void> = ()=>Promise.resolve(),
        private signalOnChange: () => void = ()=>{}
    ) {}

    public create(type: NodeType, id?: string) {
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
            case NodeType.Add: return new BinaryNode(NodeType.Add, this.updateNodeRendering, id);
            case NodeType.Sub: return new BinaryNode(NodeType.Sub, this.updateNodeRendering, id);
            case NodeType.Mul: return new BinaryNode(NodeType.Mul, this.updateNodeRendering, id);
            case NodeType.Pow: return new BinaryNode(NodeType.Pow, this.updateNodeRendering, id);
            case NodeType.Div: return new BinaryNode(NodeType.Div, this.updateNodeRendering, id);
            case NodeType.Sum: return new NaryNode(NodeType.Sum, this.updateNodeRendering, id);
            case NodeType.Prod: return new NaryNode(NodeType.Prod, this.updateNodeRendering, id);
            default: return undefined;
        }
    }
}