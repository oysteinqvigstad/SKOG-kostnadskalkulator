import {NodeType} from "../nodes/nodeMeta/node";


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