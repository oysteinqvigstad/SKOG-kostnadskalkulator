import {Comparison} from "@skogkalk/common/dist/src/parseTree";

export interface ChooseNodeControlData {
    comparisonCount: number
}

export interface ChooseNodeComparisonData {
    sourceID?: string,
    lh: number;
    rh: number;
    comparison: Comparison;
}