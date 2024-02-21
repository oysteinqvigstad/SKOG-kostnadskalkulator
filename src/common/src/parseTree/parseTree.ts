
/**
 * Basis for an N-ary parse tree.
 */
export interface ParseNode {
    id: string
    operation: NodeType
    value: number
    description: string
    left?: ParseNode
    right?: ParseNode
    inputs?: ParseNode[]
}

export enum NodeType {
    Input = "Input",
    Number = "Number",
    Add = "Add",
    Sub = "Sub",
    Mul = "Mul",
    Pow = "Pow",
    Sum = "Sum",
    Prod = "Prod",
    Div = "Div",
}

export function getBinaryOperation(type: NodeType): (l:number, r:number) => number {
    switch(type) {
        case NodeType.Add : return (l,r)=>l+r;
        case NodeType.Mul : return (l, r) => l*r;
        case NodeType.Div : return (l, r) => l/r;
        case NodeType.Sub : return (l, r) => l-r;
        case NodeType.Pow : return (l,r)=> l**r;
        default: throw new Error("Invalid node type");
    }
}

export function getNaryOperation(type: NodeType) : (arr:number[])=>number {
    switch(type) {
        case NodeType.Prod: return (arr)=>{return arr.reduce((a,b)=>a*b)};
        case NodeType.Sum: return (arr)=>{return arr.reduce((a,b)=>a+b)};
        default: throw new Error("Invalid node type");
    }
}


/**
 * calculateNode calculates the value at the provided node by traversing the tree and calculating
 * the value of all children. Any missing children will be interpreted as 0.
 *
 * @param node ParseNode to be calculated
 * @returns the value of the ParseNode.
 */
export function calculateNode(node: ParseNode | undefined): number {
    if(!node) {return 0}

    switch(node.operation) {
        case NodeType.Input: return node.value;
        case NodeType.Number: return node.value;
        case NodeType.Add: return calculateNode(node.left) + calculateNode(node.right);
        case NodeType.Sub: return calculateNode(node.left) - calculateNode(node.right);
        case NodeType.Mul: return calculateNode(node.left) * calculateNode(node.right);
        case NodeType.Div: return calculateNode(node.left) / calculateNode(node.right);
        case NodeType.Sum: return node.inputs!.map(calculateNode).reduce((a, b)=> {return a + b}) ?? 0
        case NodeType.Prod: return node.inputs!.map(calculateNode).reduce((a, b)=> {return a * b}) ?? 0
        default: return 0;
    }
}


/**
 * getNodeByID traverses the children of the provided node, attempting to find a node
 * with the provided ID.
 *
 * @param id ID of the node to find
 * @param node Entrypoint for the search. Can be a root-node or any other node in a ParseNode tree.
 * @returns A reference to the ParseNode object with a matching id or undefined
 */
export function getNodeByID(id: string, node: ParseNode | undefined) : ParseNode | undefined {
    if(node?.id === id || node === undefined) {
        return node;
    }
    if(node.inputs) {
        for(let n of node.inputs) {
            let result = getNodeByID(id, n);
            if (result !== undefined) {
                return result;
            }
        }
    }
    return getNodeByID(id, node.left) ?? getNodeByID(id, node.right);
}