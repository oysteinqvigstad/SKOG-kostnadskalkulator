import {NaryNode} from "../../../src/rete/nodes/mathNodes/naryNode";
import {ModuleManager} from "../../../src/rete/moduleManager";
import {NodeFactory} from "../../../src/rete/nodeFactory";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset, NodeEditor} from "rete";
import {Schemes} from "../../../src/rete/nodes/types";
import {DataflowEngine} from "rete-engine";
import {NumberNode} from "../../../src/rete/nodes/mathNodes/numberNode";

describe('naryNode', ()=>{
    const factory = new NodeFactory(new ModuleManager());
    it('should output a valid parse node', ()=>{
        const naryNode = factory.createNode(NodeType.Prod) as NaryNode;
        expect(naryNode).toBeInstanceOf(NaryNode);
        const parseNode = naryNode.toParseNode();
        expect(parseNode).toHaveProperty('type');
        expect(parseNode).toHaveProperty('value');
        expect(parseNode).toHaveProperty('id');
    })

    it('should properly serialize and deserialize controls', ()=>{
        const naryNode = factory.createNode(NodeType.Prod) as NaryNode;
        naryNode.controls.c.set({value: 5});
        const serializedControls = naryNode.serializeControls();
        const newNaryNode = factory.createNode(NodeType.Prod) as NaryNode;
        newNaryNode.deserializeControls(serializedControls);
        expect(newNaryNode.controls.c.getData()).toEqual(naryNode.controls.c.getData());
    })



    it('should output the product of its inputs for NodeType.Prod', async ()=>{
        const {engine, naryNode} = await naryNodeMathTestSetup(NodeType.Prod, 3, 5);
        const result = await engine.fetch(naryNode.id);
        expect(result.out.value).toEqual(15);
    });

    it('should output the sum of its inputs for NodeType.Sum', async ()=>{
        const {engine, naryNode} = await naryNodeMathTestSetup(NodeType.Sum, 3, 5);
        const result = await engine.fetch(naryNode.id);
        expect(result.out.value).toEqual(8);
    });

    it('should output the max of its inputs for NodeType.Max', async ()=>{
        const {engine, naryNode} = await naryNodeMathTestSetup(NodeType.Max, 3, 5);
        const result = await engine.fetch(naryNode.id);
        expect(result.out.value).toEqual(5);
    });

    it('should output the min of its inputs for NodeType.Min', async ()=>{
        const {engine, naryNode} = await naryNodeMathTestSetup(NodeType.Min, 3, 5);
        const result = await engine.fetch(naryNode.id);
        expect(result.out.value).toEqual(3);
    });

});


const naryNodeMathTestSetup = async (naryNodeType: NodeType, input1Value: number, input2Value: number) => {

    const factory = new NodeFactory(new ModuleManager());
    const editor = new NodeEditor<Schemes>();
    const engine = new DataflowEngine<Schemes>();
    editor.use(engine);
    const naryNode = factory.createNode(naryNodeType) as NaryNode;
    const input1 = factory.createNode(NodeType.Number) as NumberNode;
    const input2 = factory.createNode(NodeType.Number) as NumberNode;
    input1.controls.c.set({value: input1Value});
    input2.controls.c.set({value: input2Value});
    await editor.addNode(naryNode);
    await editor.addNode(input1);
    await editor.addNode(input2);
    await editor.addConnection(new ClassicPreset.Connection(input1, 'out', naryNode, 'input'));
    await editor.addConnection(new ClassicPreset.Connection(input2, 'out', naryNode, 'input'));
    return {editor, engine, naryNode};
}