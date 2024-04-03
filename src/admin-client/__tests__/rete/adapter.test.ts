import {NodeFactory} from "../../src/rete/nodeFactory";
import {ModuleManager} from "../../src/rete/moduleManager";
import {getNodeByID, NodeType, treeStateFromData} from "@skogkalk/common/dist/src/parseTree";
import {NumberNode} from "../../src/rete/nodes/mathNodes/numberNode";
import {BinaryNode} from "../../src/rete/nodes/mathNodes/binaryNode";
import {ClassicPreset, NodeEditor} from "rete";
import {Schemes} from "../../src/rete/nodes/types";
import {DataflowEngine} from "rete-engine";
import {createParseNodeGraph} from "../../src/rete/adapters";

describe("Basic graph to parseTree", ()=>{
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
    })

})




