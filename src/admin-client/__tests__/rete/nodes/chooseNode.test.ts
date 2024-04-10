import {ClassicPreset, NodeEditor} from "rete";
import {ModuleManager} from "../../../src/rete/moduleManager";
import {NodeFactory} from "../../../src/rete/nodeFactory";
import {Comparison, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {ChooseNode} from "../../../src/rete/nodes/controlNodes/chooseNode";
import {NumberNode} from "../../../src/rete/nodes/mathNodes/numberNode";
import {Schemes} from "../../../src/rete/nodes/types";
import {DataflowEngine} from "rete-engine";
import {NodeControl} from "../../../src/rete/nodes/nodeControl";
import {ChooseNodeComparisonData} from "../../../src/rete/nodes/controlNodes/ChooseNodeControlData";


describe('chooseNode', ()=>{
    const factory = new NodeFactory(new ModuleManager());
    it('should output a valid parse node', ()=>{
        const chooseNode = factory.createNode(NodeType.Choose) as ChooseNode;
        expect(chooseNode).toBeInstanceOf(ChooseNode);
        const parseNode = chooseNode.toParseNode();
        expect(parseNode).toHaveProperty('type');
        expect(parseNode).toHaveProperty('value');
        expect(parseNode).toHaveProperty('id');
    });

    it('should properly serialize and deserialize controls', ()=>{
        const chooseNode = factory.createNode(NodeType.Choose) as ChooseNode;
        chooseNode.controls.c.set({comparisonCount: 4});
        const serializedControls = chooseNode.serializeControls();
        const newChooseNode = factory.createNode(NodeType.Choose) as ChooseNode;
        newChooseNode.deserializeControls(serializedControls);
        expect(newChooseNode.controls.c.getData()).toEqual(chooseNode.controls.c.getData());
        expect(newChooseNode.inputs["input3"]).toBeDefined();
    });

    it('Should properly add controls for the number of comparisons', ()=>{
        const chooseNode = factory.createNode(NodeType.Choose) as ChooseNode;

        chooseNode.controls.c.set({comparisonCount: 3});
        expect(chooseNode.inputs["input0"]).toBeDefined();
        expect(chooseNode.inputs["input1"]).toBeDefined();
        expect(chooseNode.inputs["input2"]).toBeDefined();

        chooseNode.controls.c.set({comparisonCount: 1});
        expect(chooseNode.inputs["input0"]).toBeDefined();
        expect(chooseNode.inputs["input1"]).toBeUndefined();
    });

    it('should not set comparisonCount lower than 0', ()=>{
        const chooseNode = factory.createNode(NodeType.Choose) as ChooseNode;
        chooseNode.controls.c.set({comparisonCount: -1});
        expect(chooseNode.controls.c.getData().comparisonCount).toEqual(0);
    });

    it('should default to the left hand value if no comparisons are true', async ()=>{
        const {engine, chooseNode} = await chooseNodeMathTestSetup(
            {leftHand: 5, defaultNodeValue: 0},
            {comparison: Comparison.EQ, rightHand: 4, nodeValue: 10},
            {comparison: Comparison.EQ, rightHand: 6, nodeValue: 20},
        );
        const result = await engine.fetch(chooseNode.id);
        expect(result.out.value).toEqual(0);
    })

    it('should output the value of the first comparison that is true', async ()=>{
        const {engine, chooseNode} = await chooseNodeMathTestSetup(
            {leftHand: 5, defaultNodeValue: 0},
            {comparison: Comparison.EQ, rightHand: 5, nodeValue: 10},
            {comparison: Comparison.EQ, rightHand: 5, nodeValue: 20},
        );
        const result = await engine.fetch(chooseNode.id);
        expect(result.out.value).toEqual(10);
    });

});

async function chooseNodeMathTestSetup(
    {leftHand, defaultNodeValue}: {leftHand: number, defaultNodeValue: number},
    firstComparison: {comparison: Comparison, rightHand: number, nodeValue: number},
    secondComparison: {comparison: Comparison, rightHand: number, nodeValue: number},
) {
    const factory = new NodeFactory(new ModuleManager());
    const chooseNode = factory.createNode(NodeType.Choose) as ChooseNode;
    chooseNode.controls.c.set({comparisonCount: 2});
    (chooseNode.inputs["input0"]?.control as NodeControl<ChooseNodeComparisonData>)?.set({comparison: firstComparison.comparison, rh: firstComparison.rightHand});
    (chooseNode.inputs["input1"]?.control as NodeControl<ChooseNodeComparisonData>)?.set({comparison: secondComparison.comparison, rh: secondComparison.rightHand});

    const firstRightHand = factory.createNode(NodeType.Number) as NumberNode;
    firstRightHand.controls.c.set({value: firstComparison.nodeValue});
    const secondRightHand = factory.createNode(NodeType.Number) as NumberNode;
    secondRightHand.controls.c.set({value: secondComparison.nodeValue});


    const leftHandOfComparison = factory.createNode(NodeType.Number) as NumberNode;
    leftHandOfComparison.controls.c.set({value: leftHand});
    const defaultNode = factory.createNode(NodeType.Number) as NumberNode;
    defaultNode.controls.c.set({value: defaultNodeValue});



    const editor = new NodeEditor<Schemes>();
    const engine = new DataflowEngine<Schemes>();
    editor.use(engine);

    await editor.addNode(firstRightHand);
    await editor.addNode(secondRightHand);
    await editor.addNode(chooseNode);
    await editor.addNode(leftHandOfComparison);
    await editor.addNode(defaultNode);

    await editor.addConnection(new ClassicPreset.Connection(leftHandOfComparison, 'out', chooseNode, 'left'));
    await editor.addConnection(new ClassicPreset.Connection(firstRightHand, 'out', chooseNode, 'input0'));
    await editor.addConnection(new ClassicPreset.Connection(secondRightHand, 'out', chooseNode, 'input1'));
    await editor.addConnection(new ClassicPreset.Connection(defaultNode, 'out', chooseNode, 'right'));

    return {engine, chooseNode};
}