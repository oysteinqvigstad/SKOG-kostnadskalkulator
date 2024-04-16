import React from "react";
import {getNodeByID} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectTreeState, store} from "../../../../state/store";
import {Provider} from "react-redux";
import Container from "react-bootstrap/Container";
import {TextInputField} from "../../../../components/input/textInputField";
import {DisplayPreviewNode as ParseDisplayNode} from "@skogkalk/common/dist/src/parseTree"
import {NodeControl} from "../../nodeControl";
import {DisplayPreviewNodeData} from "./displayPreviewNodeControlData";
import {ResultPreview} from "@skogkalk/common/dist/src/visual/ResultPreview";
import {Card} from "react-bootstrap";
import {TextEditor} from "../../../../components/input/textEditor";
import { Drag } from "rete-react-plugin";

export function DisplayPreviewNodeControlContainer(
    props: { data: NodeControl<DisplayPreviewNodeData> }
) {
    return <Provider store={store}>
        <DisplayPreviewNodeContent data={props.data}/>
    </Provider>
}

function DisplayPreviewNodeContent(
    props: { data: NodeControl<DisplayPreviewNodeData> }
) {
    const treeState = useAppSelector(selectTreeState)
    const nodeData = getNodeByID(treeState.tree, props.data.get('nodeID')) as ParseDisplayNode


    return <>
        <Drag.NoDrag>
            <Container>
                {nodeData &&
                    <Card>
                        <Card.Body>
                            <ResultPreview
                                displayData={nodeData}
                                treeState={treeState.tree}
                            />
                        </Card.Body>
                    </Card>
                }
                <TextInputField
                    inputHint={"Unit"}
                    value={props.data.get('unit')}
                    onChange={(value) => {
                        props.data.set({unit: value})
                    }}
                />
                <TextEditor
                    value={props.data.get("infoText") || ""}
                    buttonText={"Edit Info text"}
                    onSave={(value) => {
                        props.data.set({infoText: value})
                    }}/>
            </Container>
        </Drag.NoDrag>
    </>
}