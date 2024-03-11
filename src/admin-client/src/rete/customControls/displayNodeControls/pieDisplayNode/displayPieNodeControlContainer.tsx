import {DisplayPieNodeControl} from "./displayPieNodeControl";
import React from "react";
import {ResultPie} from "../../../../sharedWithClient/resultPie";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectTreeState} from "../../../../state/store";


export function DisplayPieNodeControlContainer(
    props: { data: DisplayPieNodeControl }
) {
    const treeState = useAppSelector(selectTreeState)

    return <>
    <ResultPie
        displayData={{
            id:"",
            name: props.data.data.name,
            inputs: [

            ],
            unit: "",
            pieType: "donut",
            inputOrdering: [],
            type: NodeType.Display,
            value: 0
        }}
        treeState={treeState.tree}
    />
    </>
}