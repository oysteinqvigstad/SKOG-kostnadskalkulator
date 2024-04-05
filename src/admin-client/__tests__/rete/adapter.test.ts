import {NodeFactory} from "../../src/rete/nodeFactory";
import {ModuleManager} from "../../src/rete/moduleManager";
import {getNodeByID, NodeType, treeStateFromData} from "@skogkalk/common/dist/src/parseTree";
import {NumberNode} from "../../src/rete/nodes/mathNodes/numberNode";
import {BinaryNode} from "../../src/rete/nodes/mathNodes/binaryNode";
import {ClassicPreset, NodeEditor} from "rete";
import {Schemes} from "../../src/rete/nodes/types";
import {DataflowEngine} from "rete-engine";
import {
    createParseNodeGraph,
    expandModule,
    resolveIncomingModuleConnections
} from "../../src/rete/adapters";
import {GraphSerializer} from "../../src/rete/graphSerializer";
import {ModuleInput} from "../../src/rete/nodes/moduleNodes/moduleInput";
import {ModuleOutput} from "../../src/rete/nodes/moduleNodes/moduleOutput";
import {ModuleNode} from "../../src/rete/nodes/moduleNodes/moduleNode";
import {OutputNode} from "../../src/rete/nodes/IONodes/outputNode/outputNode";



describe("treeStateFromData()", ()=>{
    it('Should handle simple math nodes', async ()=>{
        const factory = new NodeFactory(new ModuleManager);
        const left = factory.createNode(NodeType.Number) as NumberNode;
        left.controls.c.set({value: 5});
        const right = factory.createNode(NodeType.Number) as NumberNode;
        right.controls.c.set({value: 3});
        const add = factory.createNode(NodeType.Add) as BinaryNode;

        const editor = new NodeEditor<Schemes>();
        const engine = new DataflowEngine<Schemes>();
        editor.use(engine);

        await editor.addNode(left);
        await editor.addNode(right);
        await editor.addNode(add);

        await editor.addConnection(new ClassicPreset.Connection(left, 'out', add, 'left'));
        await editor.addConnection(new ClassicPreset.Connection(right, 'out', add, 'right'));
        const result = await engine.fetch(add.id);
        expect(result.out.value).toEqual(8);

        const parseTree = createParseNodeGraph(editor);
        const treeState = treeStateFromData(parseTree);
        expect(getNodeByID(treeState, add.id)?.value).toEqual(8);
    });
})



describe('flattenGraph', ()=>{
    const passThroughModule = "passThrough";
    const deadEndModule = "deadEnd";
    const singleInputMultipleTargetsModule = "multipleTargets";

    const createContext = async (module: "passThrough" | "deadEnd" | "multipleTargets")=> {
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
        moduleManager.addModuleData(deadEndModule, serializer.exportNodes());

        // passThroughModule: moduleInput -> moduleOutput
        const inToOutConnection = new ClassicPreset.Connection(inNode, "out", outNode, "value");
        await editor.addConnection(inToOutConnection);
        moduleManager.addModuleData(passThroughModule, serializer.exportNodes());

        // multipleTargets: moduleInput -> 2x addNode -> moduleOutput
        await editor.removeConnection(inToOutConnection.id);
        const addNode = factory.createNode(NodeType.Add) as BinaryNode;
        await editor.addNode(addNode);
        await editor.addConnection(new ClassicPreset.Connection(inNode, "out", addNode, "left"));
        await editor.addConnection(new ClassicPreset.Connection(inNode, "out", addNode, "right"));
        await editor.addConnection(new ClassicPreset.Connection(addNode, "out", outNode, "value"));
        moduleManager.addModuleData(singleInputMultipleTargetsModule, serializer.exportNodes());

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
            moduleNode: moduleNode
        }
    }

    it('should resolve connections going through a module with connected in out nodes', async ()=>{
        const { factory, editor, engine, outputID, moduleNode } = await createContext(passThroughModule);

        const result = await engine.fetch(outputID);
        // Checks that the value has successfully passed through the module to outputNode
        expect(result.out.value).toEqual(5);

        const resolvedConnections = resolveIncomingModuleConnections(
            moduleNode,
            editor.getConnections()
        );
        // Checks that the connection going into the module has been redirected directly to outputNode
        // numberNode -> Module( ModuleInput -> ModuleOutput ) -> outputNode
        // becomes:
        // numberNode -> outputNode
        expect(resolvedConnections[0]?.target).toEqual(outputID);
    });

    it("Should discard connections that don't resolve to a node in the module or a node connected to a module output", async ()=>{
        const { factory, editor, engine, outputID, moduleNode } = await createContext(deadEndModule);
        const result = await engine.fetch(outputID);
        // Checks that the output node defaults to 0 as the number 5 does not pass through the module
        expect(result.out.value).toEqual(0);

        const resolvedConnections = resolveIncomingModuleConnections(
            moduleNode,
            editor.getConnections()
        );
        // Checks that the connection going into the module has been discarded
        // numberNode -> Module( ModuleInput -/> ModuleOutput ) -> outputNode
        // becomes:
        // numberNode -/> outputNode
        expect(resolvedConnections.length).toEqual(0);
    })

    it('Should handle multiple connections from a moduleInput to multiple nodes', async ()=>{
        const { factory, editor, engine, outputID, moduleNode } = await createContext(singleInputMultipleTargetsModule);
        const result = await engine.fetch(outputID);
        // Checks that the value has successfully passed through the module to outputNode and has been doubled
        // by the Add node.
        expect(result.out.value).toEqual(10);

        const resolvedConnections = resolveIncomingModuleConnections(
            moduleNode,
            editor.getConnections()
        );
        // Checks that the connection going into the module has been redirected to both addNodes
        // numberNode -> Module( ModuleInput -> 2x AddNode -> ModuleOutput ) -> outputNode
        // becomes:
        //             /-> left AddNode  -\
        // numberNode-|                    |-> outputNode
        //             \-> right AddNode -/
        expect(resolvedConnections.length).toEqual(2);
    });
})






