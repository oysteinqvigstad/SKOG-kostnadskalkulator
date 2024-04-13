import {DisplayBarNode, DisplayListNode, DisplayNode, DisplayPieNode, NodeType, TreeState} from "../parseTree";
import {ResultBar} from "./ResultBar";
import {ResultPie} from "./ResultPie";
import {ResultList} from "./ResultList";
import React from "react";

export function ResultComponent(props: {
    treeState: TreeState
    displayData: DisplayNode
}) {
    switch (props.displayData.type) {
        case NodeType.BarDisplay:
            return <ResultBar displayData={props.displayData as DisplayBarNode} treeState={props.treeState} />
        case NodeType.Display:
            return <ResultPie displayData={props.displayData as DisplayPieNode} treeState={props.treeState} />
        case NodeType.ListDisplay:
            return <ResultList displayData={props.displayData as DisplayListNode} treeState={props.treeState} />
        default:
            return <></>
        }
}