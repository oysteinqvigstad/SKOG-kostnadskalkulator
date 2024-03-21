import {Comparison} from "@skogkalk/common/dist/src/parseTree";

export interface ChooseNodeControlData {
    comparisonCount: number
}

export interface ChooseNodeComparisonData {
    lh: number;
    rh: number;
    comparison: Comparison;
}