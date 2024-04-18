import {ClassicPreset, NodeEditor} from "rete";
import {Schemes} from "../../src/rete/nodes/types";
import {DataflowEngine} from "rete-engine";
import {ModuleManager} from "../../src/rete/moduleManager";
import {NodeFactory} from "../../src/rete/nodeFactory";
import {GraphSerializer} from "../../src/rete/graphSerializer";
import {ModuleInput} from "../../src/rete/nodes/moduleNodes/moduleInput";
import {ModuleOutput} from "../../src/rete/nodes/moduleNodes/moduleOutput";
import {BinaryNode} from "../../src/rete/nodes/mathNodes/binaryNode";
import {ModuleNode} from "../../src/rete/nodes/moduleNodes/moduleNode";
import {NumberNode} from "../../src/rete/nodes/mathNodes/numberNode";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {OutputNode} from "../../src/rete/nodes/IONodes/outputNode/outputNode";

export enum ModuleName {
    passThroughModule = "passThroughModule",
    deadEndModule = "deadEndModule",
    singleInputMultipleTargets = "singleInputMultipleTargets",
    nestedModule = "nestedModule"
}
export async function createTestContext (module: ModuleName) {
    const editor = new NodeEditor<Schemes>();
    const engine = new DataflowEngine<Schemes>();
    editor.use(engine);

    const moduleManager = new ModuleManager();
    const factory = new NodeFactory(moduleManager);
    const serializer = new GraphSerializer(editor, factory);

    // MODULE SETUP
    // deadEndModule: moduleInput -/> moduleOutput
    const inNode = factory.createNode(NodeType.ModuleInput) as ModuleInput;
    inNode.controls.c.set({inputName: "moduleInput"});
    const outNode = factory.createNode(NodeType.ModuleOutput) as ModuleOutput;
    outNode.controls.c.set({outputName: "moduleOutput"});
    await editor.addNode(inNode);
    await editor.addNode(outNode);
    moduleManager.addModuleData(ModuleName.deadEndModule, serializer.exportNodes());

    // passThroughModule: moduleInput -> moduleOutput
    const inToOutConnection = new ClassicPreset.Connection(inNode, "out", outNode, "value");
    await editor.addConnection(inToOutConnection);
    moduleManager.addModuleData(ModuleName.passThroughModule, serializer.exportNodes());

    // multipleTargets: moduleInput -> 2x addNode -> moduleOutput
    await editor.removeConnection(inToOutConnection.id);
    const addNode = factory.createNode(NodeType.Add) as BinaryNode;
    await editor.addNode(addNode);
    await editor.addConnection(new ClassicPreset.Connection(inNode, "out", addNode, "left"));
    await editor.addConnection(new ClassicPreset.Connection(inNode, "out", addNode, "right"));
    await editor.addConnection(new ClassicPreset.Connection(addNode, "out", outNode, "value"));
    moduleManager.addModuleData(ModuleName.singleInputMultipleTargets, serializer.exportNodes());

    await editor.clear();

    // NESTED MODULE SETUP
    const internalNode = factory.createNode(NodeType.Module) as ModuleNode;
    internalNode.controls.c.set({currentModule: ModuleName.singleInputMultipleTargets });
    await editor.addNode(inNode)
    await editor.addNode(outNode);
    await editor.addNode(internalNode);
    await internalNode.setModuleAndRefreshPorts();
    await editor.addConnection(new ClassicPreset.Connection(inNode, "out", internalNode, "moduleInput"));
    //@ts-ignore
    await editor.addConnection(new ClassicPreset.Connection(internalNode, "moduleOutput", outNode, "value"));
    moduleManager.addModuleData(ModuleName.nestedModule, serializer.exportNodes());

    await editor.clear();

    // TEST GRAPH SETUP
    const moduleNode = factory.createNode(NodeType.Module) as ModuleNode;
    await editor.addNode(moduleNode);
    moduleNode.controls.c.set({currentModule: module});
    await moduleNode.setModuleAndRefreshPorts();

    const numberNode = factory.createNode(NodeType.Number) as NumberNode;
    numberNode.controls.c.set({value: 5});
    const outputNode = factory.createNode(NodeType.Output) as OutputNode;


    await editor.addNode(numberNode);
    await editor.addNode(outputNode);
    await editor.addConnection(new ClassicPreset.Connection(numberNode, "out", moduleNode, "moduleInput"));
    await editor.addConnection(new ClassicPreset.Connection(moduleNode, "moduleOutput", outputNode, "result"));

    return {
        factory: factory,
        engine: engine,
        editor: editor,
        outputID: outputNode.id,
        moduleNode: moduleNode,
        moduleManager: moduleManager
    }
}
