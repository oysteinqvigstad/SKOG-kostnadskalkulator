import {getNodeByID, setInputValue, treeStateFromData} from "../src/parseTree";
import {testTree} from "../src/parseTree/testTree";
import {getInputByName, getOutputByName} from "../src/parseTree/treeState";



describe('parsing of data into TreeState object', () => {

    const treeState = treeStateFromData(testTree);

    it('treeStateFromData should create a deep copy', () => {
        expect(treeState.subTrees).toEqual(testTree);
        expect(treeState.subTrees).not.toBe(testTree);
    })

    it('should correctly locate outputs', () => {
        const outputNames = treeState.outputs.map(node=> {return node.name});

        expect(outputNames).toContain("Rektangelareal");
        expect(outputNames).toContain("Rektangelomkrets");
        expect(outputNames).toContain("Sirkelomkrets");
        expect(outputNames).toContain("Sirkelareal");
        expect(outputNames.length).toEqual(4);
    })

    it('should correctly locate inputs', () => {
        const inputNames = treeState.inputs.map(node=> {
            return node.name;
        })
        expect(inputNames).toContain("radius");
        expect(inputNames).toContain("bredde");
        expect(inputNames).toContain("høyde");
        expect(inputNames).toContain("enhet");
        expect(inputNames.length).toEqual(4);

    })
})


describe('calculation', () => {
    let treeState = treeStateFromData(testTree);
    it('Should correctly evaluate outputs based on inputs', () => {
        const rectangleAreaOutput = getOutputByName(treeState, "Rektangelareal");
        const rektangelOmkrets = getOutputByName(treeState, "Rektangelomkrets");
        const circleArea = getOutputByName(treeState, "Sirkelareal");
        const circleCircumference = getOutputByName(treeState, "Sirkelomkrets");

        const breddeInput = getInputByName(treeState, "bredde");
        const hoydeInput = getInputByName(treeState, "høyde");
        const radiusInput = getInputByName(treeState, "radius", "Sirkel");
        const unitInput = getInputByName(treeState, "enhet");

        const treeState2 = setInputValue(treeState!, hoydeInput!.id, 5);
        const treeState3 = setInputValue(treeState2!, breddeInput!.id, 5);

        expect(getNodeByID(treeState3!, rectangleAreaOutput!.id)!.value).toEqual(25);
        expect(getNodeByID(treeState3!, rektangelOmkrets!.id)!.value).toEqual(20);

        const treeState4 = setInputValue(treeState3!, radiusInput!.id, 5);
        expect(getNodeByID(treeState4!, circleCircumference!.id)!.value.toFixed(2)).toEqual("31.42");
        expect(getNodeByID(treeState4!, circleArea!.id)!.value.toFixed(2)).toEqual("78.54");

        const treeState5 = setInputValue(treeState4!, unitInput!.id, 0.001);
        expect(getNodeByID(treeState5!, circleArea!.id)!.value.toFixed(8)).toEqual("0.00007854");
    })
})

