import {NodeType, ParseNode} from "./parseNode";
import {ReferenceNode} from "./referenceNode";

export enum Comparison {
    GT = "GT",
    LT = "LT",
    EQ = "EQ",
    GE = "GE",
    LE = "LE",
}

export function compare(lh: number, rh: number, comparison: Comparison): boolean {
    switch(comparison) {
        case Comparison.GT:
            return lh > rh;
        case Comparison.LT:
            return lh < rh;
        case Comparison.EQ:
            return lh === rh;
        case Comparison.GE:
            return lh >= rh;
        case Comparison.LE:
            return lh <= rh;
    }
}

export interface ChooseNode extends ParseNode {
    type: NodeType.Choose
    inputs: (ParseNode | ReferenceNode)[]
    comparisons: {resultNodeID: string, comparison: Comparison, rh: number}[]
}