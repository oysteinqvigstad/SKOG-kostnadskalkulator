import {ModuleManager} from "../../../src/rete/moduleManager";
import {NodeFactory} from "../../../src/rete/nodeFactory";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {NumberNode} from "../../../src/rete/nodes/mathNodes/numberNode";
import {Schemes} from "../../../src/rete/nodes/types";
import {NodeEditor} from "rete";
import {DataflowEngine} from "rete-engine";

describe('numberNode', ()=>{
    it('should output a valid parse node', ()=>{
        const factory = new NodeFactory(new ModuleManager());
        const numberNode = factory.createNode(NodeType.Number) as NumberNode;
        expect(numberNode).toBeInstanceOf(NumberNode);
        const parseNode = numberNode.toParseNode();
        expect(parseNode).toHaveProperty('type');
        expect(parseNode).toHaveProperty('value');
        expect(parseNode).toHaveProperty('id');
    });

    it('should properly serialize and deserialize controls', ()=>{
        const factory = new NodeFactory(new ModuleManager());
        const numberNode = factory.createNode(NodeType.Number) as NumberNode;
        numberNode.controls.c.set({value: 5});
        const serializedControls = numberNode.serializeControls();
        const newNumberNode = factory.createNode(NodeType.Number) as NumberNode;
        newNumberNode.deserializeControls(serializedControls);
        expect(newNumberNode.controls.c.getData()).toEqual(numberNode.controls.c.getData());
    });

    it('should properly clone itself with its value', async ()=>{
        const factory = new NodeFactory(new ModuleManager());
        const numberNode = factory.createNode(NodeType.Number) as NumberNode;
        numberNode.controls.c.set({value: 5});
        const clone = numberNode.clone();
        expect(clone.controls.c.getData()).toEqual(numberNode.controls.c.getData());

        const editor = new NodeEditor<Schemes>();
        const engine = new DataflowEngine<Schemes>();
        editor.use(engine);
        await editor.addNode(clone);
        const result = await engine.fetch(clone.id);
        const secondClone = clone.clone();
        expect(secondClone.controls.c.getData()).toEqual(numberNode.controls.c.getData());
    });

    it('should output its value in data method', async ()=>{
        const factory = new NodeFactory(new ModuleManager());
        const numberNode = factory.createNode(NodeType.Number) as NumberNode;
        numberNode.controls.c.set({value: 5});
        const editor = new NodeEditor<Schemes>();
        const engine = new DataflowEngine<Schemes>();
        editor.use(engine);
        await editor.addNode(numberNode);
        const result = await engine.fetch(numberNode.id);
        expect(result?.out.value).toEqual(5);
    });

});