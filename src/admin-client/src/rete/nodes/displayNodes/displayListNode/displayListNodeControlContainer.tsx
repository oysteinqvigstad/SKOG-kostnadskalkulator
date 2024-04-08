import React, {useEffect, useState} from "react";
import {getNodeByID, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectTreeState, store} from "../../../../state/store";
import {Provider} from "react-redux";
import Container from "react-bootstrap/Container";
import {TextInputField} from "../../../../components/input/textInputField";
import {DisplayPreviewNode as ParseDisplayNode} from "@skogkalk/common/dist/src/parseTree"
import {NodeControl} from "../../nodeControl";
import {DisplayListNodeData} from "./displayListNodeControlData";
import {ResultList} from "@skogkalk/common/dist/src/visual/ResultList";
import {TextEditor} from "../../../../components/input/textEditor";
import { Drag } from "rete-react-plugin";

export function DisplayListNodeControlContainer(
    props: { data: NodeControl<DisplayListNodeData> }
) {
    return <Provider store={store}>
        <DisplayListNodeContent data={props.data}/>
    </Provider>
}

function DisplayListNodeContent(
    props: { data: NodeControl<DisplayListNodeData> }
) {
    const treeState = useAppSelector(selectTreeState)
    const nodeID = props.data.get('nodeID');
    const [displayNode, setDisplayNode] = useState(getNodeByID(treeState.tree, nodeID) as ParseDisplayNode | undefined);
    useEffect(() => {
        if (treeState.tree) {
            setDisplayNode(getNodeByID(treeState.tree, props.data.get('nodeID')) as ParseDisplayNode);
        }
    }, [treeState.tree, nodeID, displayNode, props.data])

    const defaults: ParseDisplayNode = {
        id: "",
        value: 0,
        type: NodeType.ListDisplay,
        inputOrdering: [],
        name: "",
        unit: "",
        inputs: [],
    }


    return <>
        <Drag.NoDrag>
            <Container>
                <ResultList
                    displayData={displayNode ?? defaults}
                    treeState={treeState.tree}
                />
                <TextInputField
                    inputHint={"Name"}
                    value={props.data.get('name')}
                    onChange={(value) => {
                        props.data.set({name: value});
                    }}/>
                <TextInputField
                    inputHint={"Unit"}
                    value={props.data.get('unit')}
                    onChange={(value) => {
                        props.data.set({unit: value})
                    }}
                />
                <TextEditor
                    value={props.data.get("infoText") || ""}
                    onSave={(value) => {
                        props.data.set({infoText: value})
                    }}/>
            </Container>
        </Drag.NoDrag>
    </>
}