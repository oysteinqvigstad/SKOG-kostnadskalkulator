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

describe('Editor import and export', ()=> {

    it('importing nodes and then exporting should keep their original properties', async () => {
        const {moduleManager} =
            await createTestContext(ModuleName.passThroughModule);
        const reteEditor = new Editor(document.createElement('div'));

        await reteEditor.importNodes(moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));

        const nodes = (await reteEditor.exportMainGraph()).nodes.map((node) => simplifyNode(node));
        const moduleNodes = moduleManager.getModuleData(ModuleName.singleInputMultipleTargets)?.nodes.map(node => simplifyNode(node));
        expect(nodes).toEqual(moduleNodes);
    })

    it('should set moduleNames to the correct values when importing with modules', async () => {
        const { moduleManager} = await createTestContext(ModuleName.passThroughModule);
        const reteEditor = new Editor(document.createElement('did'));

        await reteEditor.importWithModules({
            main: { nodes: [] },
            modules: moduleManager.getAllModuleData()
        })
        const snapshot = reteEditor.getSnapshotRetriever()();
        expect(snapshot.moduleNames).toContain(ModuleName.passThroughModule);
        expect(snapshot.moduleNames).toContain(ModuleName.deadEndModule);
        expect(snapshot.moduleNames).toContain(ModuleName.nestedModule);
        expect(snapshot.moduleNames).toContain(ModuleName.singleInputMultipleTargets);
    });
});


describe('Editor ModuleManager integration', ()=>{

   it('should be able to import a graph from the module manager and export it', async ()=>{
       const { moduleManager } =
           await createTestContext(ModuleName.passThroughModule);
       const reteEditor = new Editor(document.createElement('div'));

       await reteEditor.addNewModule("testModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
       await reteEditor.loadModule("testModule");

       const nodes = (await reteEditor.exportCurrentGraph()).nodes.map((node) => simplifyNode(node));
       const moduleNodes = moduleManager.getModuleData(ModuleName.singleInputMultipleTargets)?.nodes.map(node => simplifyNode(node));
       expect(nodes).toEqual(moduleNodes);
       expect(reteEditor.currentModule).toBe("testModule");
       expect(reteEditor.getSnapshotRetriever()().moduleNames).toEqual(["testModule"]);
   });


   it('should successfully stash the main graph when loading a module', async ()=>{
         const { moduleManager } =
              await createTestContext(ModuleName.passThroughModule);
         const reteEditor = new Editor(document.createElement('div'));

         await reteEditor.importNodes(moduleManager.getModuleData(ModuleName.passThroughModule));
         await reteEditor.addNewModule(
             "someModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
         await reteEditor.addNewModule(
             "testModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
         await reteEditor.loadModule("testModule");

         await reteEditor.loadMainGraph();

         const nodes = (await reteEditor.exportCurrentGraph()).nodes.map((node) => simplifyNode(node));
         const moduleNodes =
             moduleManager.getModuleData(ModuleName.passThroughModule)?.nodes.map(node => simplifyNode(node));
         expect(nodes).toEqual(moduleNodes);
         expect(reteEditor.currentModule).toBe(undefined);
         expect(reteEditor.getSnapshotRetriever()().moduleNames).toEqual(["someModule", "testModule"]);
   });


   it('should delete the module when calling deleteModule', async ()=>{
       const { moduleManager } =
           await createTestContext(ModuleName.passThroughModule);
       const reteEditor = new Editor(document.createElement('div'));

       await reteEditor.addNewModule("testModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
       await expect(reteEditor.loadModule("testModule")).resolves.toEqual(undefined);
       await reteEditor.deleteModule("testModule");
       await expect(reteEditor.loadModule("testModule")).rejects.toEqual(new Error("No module with name testModule"));
   });

   it('should be able to rename a module without unexpected behavior', async ()=>{
       const { moduleManager } =
           await createTestContext(ModuleName.passThroughModule);
       const reteEditor = new Editor(document.createElement('div'));

       reteEditor.addNewModule("testModule", moduleManager.getModuleData(ModuleName.singleInputMultipleTargets));
       await reteEditor.loadModule("testModule");
       // await reteEditor.renameCurrentModule("newName");
       // await reteEditor.loadModule("newName");
       const result = await reteEditor.exportCurrentGraph();
       const nodes = result.nodes.map((node) => simplifyNode(node));
       const moduleNodes = moduleManager.getModuleData(ModuleName.singleInputMultipleTargets)?.nodes.map(node => simplifyNode(node));
       expect(nodes).toEqual(moduleNodes);
   });

});