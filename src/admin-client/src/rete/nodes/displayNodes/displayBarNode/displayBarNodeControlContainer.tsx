import React from "react";
import {getNodeByID} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectTreeState, store} from "../../../../state/store";
import {Provider} from "react-redux";
import Container from "react-bootstrap/Container";
import {TextInputField} from "../../../../components/input/textInputField";
import {DisplayBarNode as ParseDisplayNode} from "@skogkalk/common/dist/src/parseTree"
import {NumberInputField} from "../../../../components/input/numberInputField";
import {NodeControl} from "../../nodeControl";
import {DisplayBarNodeData} from "./displayBarNodeControlData";
import {TextEditor} from "../../../../components/input/textEditor";
import { Drag } from "rete-react-plugin";
import {ResultBar} from "@skogkalk/common/dist/src/visual/ResultBar";

export function DisplayBarNodeControlContainer(
    props: { data: NodeControl<DisplayBarNodeData> }
) {
    return <Provider store={store}>
        <DisplayBarNodeContent data={props.data}/>
    </Provider>
}

function DisplayBarNodeContent(
    props: { data: NodeControl<DisplayBarNodeData> }
) {
    const treeState = useAppSelector(selectTreeState)
    const nodeData = getNodeByID(treeState.tree, props.data.get('nodeID')) as ParseDisplayNode

    return <>
        <Drag.NoDrag>
            <Container>
                {nodeData &&
                    <ResultBar
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
                <NumberInputField
                    inputHint={"Max"}
                    value={props.data.get('max')}
                    onChange={(value) => {
                        props.data.set({max: value});
                    }}
                    onIllegalValue={() => {
                    }}
                    legalRanges={[]}
                />
                <TextEditor
                    value={props.data.get("infoText") || ""}
                    buttonText={"Edit Info Text"}
                    onSave={(value) => {
                        props.data.set({infoText: value})
                    }}/>
            </Container>
        </Drag.NoDrag>
    </>
}