import {Comparison} from "@skogkalk/common/dist/src/parseTree";

export interface ChooseNodeControlData {
    leftHandValue: number;
    comparisons: { resultNodeID: string; comparison: Comparison; rh: number; }[];
}

export interface ChooseNodeComparisonData {
    lh: number;
    rh: number;
    comparison: Comparison;
}