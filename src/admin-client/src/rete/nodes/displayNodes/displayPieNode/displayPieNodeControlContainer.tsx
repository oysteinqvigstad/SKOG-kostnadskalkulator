import {DisplayPieNodeData} from "./displayPieNodeControlData";
import React, {useEffect, useState} from "react";
import {getNodeByID, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectTreeState, store} from "../../../../state/store";
import {NodeControl} from "../../parseableBaseNode";
import {Provider} from "react-redux";
import {isReferenceNode} from "@skogkalk/common/dist/src/parseTree/nodes/referenceNode";
import {isOutputNode} from "@skogkalk/common/dist/src/parseTree/nodes/outputNode";
import {OutputNode as ParseOutputNode} from "@skogkalk/common/dist/src/parseTree"
import {ResultPie} from "@skogkalk/common/dist/src/visual/resultPie";
import Container from "react-bootstrap/Container";
import {TextInputField} from "../../../../components/input/textInputField";
import { DisplayPieNode as ParseDisplayNode} from "@skogkalk/common/dist/src/parseTree"

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
    const nodeID = props.data.get('nodeID');
    const [displayNode, setDisplayNode] = useState(getNodeByID(treeState.tree, nodeID) as ParseDisplayNode | undefined);
    useEffect(()=> {
        if(treeState.tree) {
            setDisplayNode(getNodeByID(treeState.tree, props.data.get('nodeID')) as ParseDisplayNode);
        }
    }, [treeState.tree, nodeID, displayNode])


    return <>
        <Container>
            <ResultPie
                displayData={displayNode? displayNode : {
                    id:"",
                    value: 0,
                    type: NodeType.Display,
                    inputOrdering: [],
                    name: "",
                    unit: "",
                    pieType: "donut",
                    inputs:[],

                }}
                treeState={treeState.tree}
            />
            <TextInputField
                inputHint={"Name"}
                value={props.data.get('name')}
                onChange={(value)=>{
                    props.data.set({name: value});
                }}/>
            <TextInputField
                inputHint={"Unit"}
                value={props.data.get('unit')}
                onChange={(value)=>{
                    props.data.set({unit: value});
                }}/>
        </Container>

    </>
}