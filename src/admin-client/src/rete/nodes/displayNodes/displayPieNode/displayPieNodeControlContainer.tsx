import {DisplayPieNodeData} from "./displayPieNodeControlData";
import React, {useEffect} from "react";
import {getNodeByID} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectDisplayArrangements, selectTreeState, store} from "../../../../state/store";
import {Provider} from "react-redux";
import {ResultPie} from "@skogkalk/common/dist/src/visual/ResultPie";
import Container from "react-bootstrap/Container";
import {TextInputField} from "../../../../components/input/textInputField";
import {DisplayPieNode as ParseDisplayNode} from "@skogkalk/common/dist/src/parseTree"
import {NodeControl} from "../../nodeControl";
import {TextEditor} from "../../../../components/input/textEditor";
import { Drag } from "rete-react-plugin";

export function DisplayPieNodeControlContainer(
    props: { data: NodeControl<DisplayPieNodeData> }
) {
    return <Provider store={store}>
        <DisplayPieNodeContent data={props.data}/>
    </Provider>
}

function DisplayPieNodeContent(
    props: { data: NodeControl<DisplayPieNodeData> }
) {
    const treeState = useAppSelector(selectTreeState)
    const nodeData = getNodeByID(treeState.tree, props.data.get('nodeID')) as ParseDisplayNode
    const displayArrangements = useAppSelector(selectDisplayArrangements)


    useEffect(() => {
        props.data.set({arrangement: displayArrangements[props.data.get('nodeID')]})
    }, [displayArrangements, props.data]);


    return <>
        <Drag.NoDrag>
            <Container>
                {nodeData &&
                    <ResultPie
                        displayData={nodeData}
                        treeState={treeState.tree}
                    />
                }
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
                        props.data.set({unit: value});
                    }}/>
                <TextEditor
                    value={props.data.get("infoText") || ""}
                    buttonText={"Edit Info text"}
                    onSave={(value: string) => {
                        props.data.set({infoText: value});
                    }}/>

            </Container>
        </Drag.NoDrag>
    </>
}