import {ModuleManager} from "../../../src/rete/moduleManager";
import {NodeFactory} from "../../../src/rete/nodeFactory";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {BinaryNode} from "../../../src/rete/nodes/mathNodes/binaryNode";
import {ClassicPreset, NodeEditor} from "rete";
import {DataflowEngine} from "rete-engine";
import {Schemes} from "../../../src/rete/nodes/types";
import {NumberNode} from "../../../src/rete/nodes/mathNodes/numberNode";

describe('binaryNode', ()=>{
    const factory = new NodeFactory(new ModuleManager());
    it('should output a valid parse node', ()=>{
        const binaryNode = factory.createNode(NodeType.Add) as BinaryNode;
        expect(binaryNode).toBeInstanceOf(BinaryNode);
        const parseNode = binaryNode.toParseNode();
        expect(parseNode).toHaveProperty('type');
        expect(parseNode).toHaveProperty('value');
        expect(parseNode).toHaveProperty('id');
    });

    it('should properly serialize and deserialize controls', ()=>{
        const binaryNode = factory.createNode(NodeType.Add) as BinaryNode;
        binaryNode.controls.c.set({value: 5});
        const serializedControls = binaryNode.serializeControls();
        const newBinaryNode = factory.createNode(NodeType.Add) as BinaryNode;
        newBinaryNode.deserializeControls(serializedControls);
        expect(newBinaryNode.controls.c.getData()).toEqual(binaryNode.controls.c.getData());
    });

    it('should output the sum of its inputs for NodeType.Add', async ()=>{
        const {engine, binaryNode} = await binaryNodeMathTestSetup(NodeType.Add, 3, 5);
        const result = await engine.fetch(binaryNode.id);
        expect(result.out.value).toEqual(8);
    });

    it('should output the difference of its inputs for NodeType.Sub', async ()=>{
        const {engine, binaryNode} = await binaryNodeMathTestSetup(NodeType.Sub, 3, 5);
        const result = await engine.fetch(binaryNode.id);
        expect(result.out.value).toEqual(-2);
    });

    it('should output the product of its inputs for NodeType.Mul', async ()=>{
        const {engine, binaryNode} = await binaryNodeMathTestSetup(NodeType.Mul, 3, 5);
        const result = await engine.fetch(binaryNode.id);
        expect(result.out.value).toEqual(15);
    });

    it('should output the quotient of its inputs for NodeType.Div', async ()=>{
        const {engine, binaryNode} = await binaryNodeMathTestSetup(NodeType.Div, 10, 5);
        const result = await engine.fetch(binaryNode.id);
        expect(result.out.value).toEqual(2);
    });

    it('should output its left hand raised to its right hand for NodeType.Pow', async ()=>{
        const {engine, binaryNode} = await binaryNodeMathTestSetup(NodeType.Pow, 3, 5);
        const result = await engine.fetch(binaryNode.id);
        expect(result.out.value).toEqual(243);
    });
});

async function binaryNodeMathTestSetup(binaryNodeType: NodeType, input1Value: number, input2Value: number) {
    const factory = new NodeFactory(new ModuleManager());
    const binaryNode = factory.createNode(binaryNodeType) as BinaryNode;
    const left = factory.createNode(NodeType.Number) as NumberNode;
    left.controls.c.set({value: input1Value});
    const right = factory.createNode(NodeType.Number) as NumberNode;
    right.controls.c.set({value: input2Value});

    const editor = new NodeEditor<Schemes>();
    const engine = new DataflowEngine<Schemes>();
    editor.use(engine);
    await editor.addNode(left);
    await editor.addNode(right);
    await editor.addNode(binaryNode);
    await editor.addConnection(new ClassicPreset.Connection(left, 'out', binaryNode, 'left'));
    await editor.addConnection(new ClassicPreset.Connection(right, 'out', binaryNode, 'right'));
    return {engine, binaryNode};
}