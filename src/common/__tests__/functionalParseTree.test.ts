import {NodeType} from "../src/parseTree";
import {getNodeByID, setInputValue, treeStateFromData} from "../src/parseTree/formula/parseTreeFunctional";
import {InputType} from "../src/parseTree/nodes/nodeMeta/input";

const testTree1 = [
    {
        id: "1",
        type: NodeType.Output,
        value: 5,
        description: "output node",
        child: {
            id: "2",
            type: NodeType.Add,
            value: 5,
            description: "a math node",
            left: {
                id: "3",
                type: NodeType.Number,
                value: 3,
                description: "left input of add"
            },
            right: {
                id: "4",
                type: NodeType.Number,
                value: 2,
                description: "right input of add"
            }
        }
    }
]

const testTree2 = [
    {
        id: "2",
        type: NodeType.Add,
        value: 5,
        description: "a math node",
        left: {
            id: "3",
            type: NodeType.Number,
            value: 3,
            description: "left input of add"
        },
        right: {
            id: "4",
            type: NodeType.Number,
            value: 2,
            description: "right input of add"
        }
    },
    {
        id: "156",
        type: NodeType.Output,
        value: 10,
        description: "output node",
        child: {
            id: "1232545",
            type: NodeType.Add,
            value: 10,
            description: "a math node",
            left: {
                id: "1512454",
                type: NodeType.Input,
                inputType: InputType.Float,
                legalValues: [
                    {range: {min: 0, max: null}}
                ],
                displayMeta: {
                    displayGroup: "lassbærer",
                    ordering: 1,
                    infoText: "kjørelengde på basvei i en retning"
                },
                value: 5,
                description: "kjørelengde basvei"
            },
            right: {
                id: "141515",
                type: NodeType.Reference,
                value: 5,
                referenceID: "2",
                description: "reference"
            }
        }
    }
]


describe('Initialization of tree object', () => {
    it('ParseTree constructor should throw on invalid data', () => {
        expect( () => {
            treeStateFromData({} as any)
        }).toThrow();
    })
    it('ParseTree constructor should successfully initialize', () => {
        expect(treeStateFromData(testTree1).outputs).toEqual([testTree1[0]])
    })
    it('should successfully construct tree from JSON string', () => {
        expect(treeStateFromData(JSON.stringify(testTree1))).toEqual(treeStateFromData(testTree1));
    })
})

describe('calculation', () => {
    it('Should successfully evaluate a formula', () => {
        const treeState = treeStateFromData(testTree1);
        const output = treeState.outputs[0];
        expect(output.value).toEqual(5);
    });
    it('Should evaluate formulas with reference nodes', () => {
        const treeState = treeStateFromData(testTree2);
        expect(treeState.outputs[0].value).toEqual(10);
    })
})

describe('node retrieval', () => {
    it('should find nodes in all sub trees', () => {
        const treeState = treeStateFromData(testTree2);
        expect(getNodeByID(treeState, "2")).toEqual(testTree2[0])
        const expected = testTree2[1].child
        expect(getNodeByID(treeState, "1232545")).toEqual(expected)
    })
})

describe('input setting', () => {
    it('should set input value', () => {
        const treeState = treeStateFromData(testTree2);
        const input = treeState.inputs[0];
        const originalOutputValue = treeState.outputs[0].value;
        const newTreeState = setInputValue(treeState, input.id, 10);

        expect(newTreeState!.inputs[0].value).toEqual(10);
        expect(newTreeState!.outputs[0].value).toEqual(originalOutputValue + 5);
    })
})

describe('should not mutate original tree', () => {
    it('should not mutate original tree', () => {
        const treeState = treeStateFromData(testTree2);
        const treeStateClone = treeStateFromData(treeState.subTrees);
        expect(treeState).not.toBe(treeStateClone);
    })
})