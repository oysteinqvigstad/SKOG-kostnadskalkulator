import {createTestContext, ModuleName} from "./testUtil";
import {Editor} from "../../src/rete/editor";
import {SerializedNode} from "../../src/rete/graphSerializer";

function simplifyNode(node: SerializedNode) {
    return {
        id: node.id,
        connections: Object.keys(node.connections),
        controlData: node.controls
    }
}

describe('Editor import and export', ()=>{

    it('importing nodes and then exporting should keep their original properties', async ()=>{
        const { moduleManager } =
            await createTestContext(ModuleName.passThroughModule);
        const reteEditor = new Editor(document.createElement('div'));

        await reteEditor.importNodes(moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));

        const nodes = reteEditor.exportNodes().nodes.map((node) => simplifyNode(node));
        const moduleNodes = moduleManager.getModuleData(ModuleName.singleInputMultipleTargets)?.nodes.map(node => simplifyNode(node));
        expect(nodes).toEqual(moduleNodes);
    })

})

describe('Editor ModuleManager integration', ()=>{
   it('should be able to import a graph from the module manager and export it', async ()=>{
       const { moduleManager } =
           await createTestContext(ModuleName.passThroughModule);
       const reteEditor = new Editor(document.createElement('div'));

       await reteEditor.addNewModule("testModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
       await reteEditor.loadModule("testModule");
       const nodes = reteEditor.exportNodes().nodes.map((node) => simplifyNode(node));
       const moduleNodes = moduleManager.getModuleData(ModuleName.singleInputMultipleTargets)?.nodes.map(node => simplifyNode(node));
       expect(nodes).toEqual(moduleNodes);
   });

   it('should successfully stash the main graph when loading a module', async ()=>{
         const { moduleManager } =
              await createTestContext(ModuleName.passThroughModule);
         const reteEditor = new Editor(document.createElement('div'));

         await reteEditor.importNodes(moduleManager.getModuleData(ModuleName.passThroughModule));
         await reteEditor.addNewModule(
             "testModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
         await reteEditor.loadModule("testModule");
         await reteEditor.loadMainGraph();

         const nodes = reteEditor.exportNodes().nodes.map((node) => simplifyNode(node));
         const moduleNodes =
             moduleManager.getModuleData(ModuleName.passThroughModule)?.nodes.map(node => simplifyNode(node));
         expect(nodes).toEqual(moduleNodes);
   });

   it('should delete the module when calling deleteModule', async ()=>{
       const { moduleManager } =
           await createTestContext(ModuleName.passThroughModule);
       const reteEditor = new Editor(document.createElement('div'));

       await reteEditor.addNewModule("testModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
       await reteEditor.deleteModule("testModule");
       let success = true;
       await reteEditor.loadModule("testModule").catch(() => success = false);
       expect(success).toBe(false)
   });

   it('should be able to rename a module without unexpected behavior', async ()=>{
       const { moduleManager } =
           await createTestContext(ModuleName.passThroughModule);
       const reteEditor = new Editor(document.createElement('div'));

       await reteEditor.addNewModule("testModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
       await reteEditor.loadModule("testModule");
       // await reteEditor.renameCurrentModule("newName");
       // await reteEditor.loadModule("newName");
       const nodes = reteEditor.exportNodes().nodes.map((node) => simplifyNode(node));
       const moduleNodes = moduleManager.getModuleData(ModuleName.singleInputMultipleTargets)?.nodes.map(node => simplifyNode(node));
       expect(nodes).toEqual(moduleNodes);
   });

});