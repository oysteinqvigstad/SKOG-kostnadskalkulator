import {DisplayPieNodeData} from "./displayPieNodeControlData";
import React from "react";
import {ResultPie} from "../../../../sharedWithClient/resultPie";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectTreeState, store} from "../../../../state/store";
import {NodeControl} from "../../../nodes/baseNode";
import {Provider} from "react-redux";


export function DisplayPieNodeControlContainer(
    props: { data: NodeControl<DisplayPieNodeData> }
) {
    return <Provider store={store}>
        <DisplayPieNodeContent data={props.data}/>
    </Provider>
}

function DisplayPieNodeContent(
    props: { data: NodeControl<DisplayPieNodeData>}
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