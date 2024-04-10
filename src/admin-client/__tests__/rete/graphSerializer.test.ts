import {createTestContext, ModuleName} from "./testUtil";
import {GraphSerializer} from "../../src/rete/graphSerializer";

describe('GraphSerializer', ()=>{
    it('should serialize with new IDs when freshIDs is true', async ()=>{
        const { factory, editor, moduleManager } = await createTestContext(ModuleName.passThroughModule);
        await editor.clear();

        const serializer = new GraphSerializer(editor, factory);
        const moduleData = moduleManager.getModuleData(ModuleName.passThroughModule);
        await serializer.importNodes(moduleData);
        const serialized = serializer.exportNodes();
        expect(serialized.nodes.map(node=>node.id)).toEqual(moduleData?.nodes.map(node=>node.id));

        await editor.clear();

        await serializer.importNodes(moduleData, true);
        const newSerialized = serializer.exportNodes();

        expect(newSerialized.nodes.map(node=>node.id)).not.toEqual(serialized.nodes.map(node=>node.id));
    });



});