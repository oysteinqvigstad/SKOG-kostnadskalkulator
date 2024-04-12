import React from "react";
import {DisplayPreviewNode, getNodeByID, OutputNode as ParseOutputNode, TreeState} from "../parseTree";
import {ResultRowBoxes} from "./ResultRowBoxes";

export function ResultPreview(props: {
    treeState: TreeState | undefined,
    displayData: DisplayPreviewNode,
}) {
    // Retrieve the results from the tree state
    const nodes = props.displayData.inputOrdering.map((value)=>{
        const node = getNodeByID(props.treeState!, value.outputID) as ParseOutputNode;
        return { color: node.color, ordering: value.ordering, label: value.outputLabel, value: node.value, unit: props.displayData.unit }
    }).sort((a, b)=>(a.ordering ?? 0) - (b.ordering??0));

    // extract the labels, values and colors from the nodes
    const items = nodes.map(({label, color, value}) => { return {label, color, value} })
    // extract the unit from the display data
    const unit = props.displayData.unit

    return <ResultRowBoxes result={items} unit={unit} />
}
