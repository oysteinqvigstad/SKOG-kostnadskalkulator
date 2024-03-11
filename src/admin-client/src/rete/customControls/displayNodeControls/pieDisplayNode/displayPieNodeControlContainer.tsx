import {DisplayPieNodeData} from "./displayPieNodeControlData";
import React from "react";
import {ResultPie} from "../../../../sharedWithClient/resultPie";
import {getNodeByID, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectTreeState, store} from "../../../../state/store";
import {NodeControl} from "../../../nodes/baseNode";
import {Provider} from "react-redux";
import {isReferenceNode} from "@skogkalk/common/dist/src/parseTree/nodes/referenceNode";
import {isOutputNode} from "@skogkalk/common/dist/src/parseTree/nodes/outputNode";
import {OutputNode as ParseOutputNode} from "@skogkalk/common/src/parseTree"

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
    const inputs = getNodeByID(treeState.tree!, props.data.id)?.inputs
        ?.map(node=> {
            if(isReferenceNode(node) ) {
                const deref = getNodeByID(treeState.tree!, node.referenceID);
                if(isOutputNode(deref!)) {
                    return deref as ParseOutputNode;
                }
            } else {
                return node as ParseOutputNode;
            }
        }) as ParseOutputNode[] | undefined;

    return <>
        <ResultPie
            displayData={{
                id:"",
                name: props.data.data.name,
                inputs: inputs ?? [],
                unit: "",
                pieType: "donut",
                inputOrdering: props.data.data.inputs.map((input, index)=>{return {outputID: input.id, outputLabel: input.label, ordering: index}}),
                type: NodeType.Display,
                value: 0
            }}
            treeState={treeState.tree}
        />
    </>
}