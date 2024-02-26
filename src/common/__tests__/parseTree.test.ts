import {NodeType, ParseNode, ParseTree} from "../src/parseTree";


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
        value: 0,
        description: "output node",
        child: {
            id: "1232545",
            type: NodeType.Add,
            value: 0,
            description: "a math node",
            left: {
                id: "1512454",
                type: NodeType.Number,
                value: 3,
                description: "left input of add"
            },
            right: {
                id: "141515",
                type: NodeType.Reference,
                value: 0,
                referenceID: "2",
                description: "reference"
            }
        }
    }
]



describe('Initialization of ParseTree class', () => {
    it('ParseTree constructor should throw on invalid data', () => {
        expect( () => {
            new ParseTree({})
        }).toThrow();
    })
    it('ParseTree constructor should successfully initialize', () => {
        expect(new ParseTree(testTree1).getOutputs()).toEqual([testTree1[0]])
    })
    it('should successfully construct tree from JSON string', () => {
        expect(new ParseTree(JSON.stringify(testTree1))).toEqual(new ParseTree(testTree1));
    })
})

describe('calculation', () => {
    it('Should successfully evaluate a formula', () => {
        const tree = new ParseTree(testTree1);
        const output = tree.getOutputs()[0];
        expect(tree.getNodeValue(output)).toEqual(5);
    });
    it('Should evaluate formulas with reference nodes', async () => {
        const tree = new ParseTree(testTree2);
        const output = tree.getOutputs()[0];
        expect(tree.getNodeValue(output)).toEqual(8);
    })
})

describe('node retrieval', () => {
    it('should find nodes in all sub trees', () => {
        const tree = new ParseTree(testTree2);
        expect(tree.getNodeByID("2")).toEqual(testTree2[0])
        let expected = testTree2[1].child
        expect(tree.getNodeByID("1232545")).toEqual(expected)
    })
})