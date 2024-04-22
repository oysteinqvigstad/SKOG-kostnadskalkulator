import {NodeControl} from "../../nodeControl";
import {GraphDisplayGroupData, GraphDisplayNodeControlData} from "./graphDisplayNodeControlData";
import {ResultGraph} from "@skogkalk/common/dist/src/visual/ResultGraph";
import {getNodeByID} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectDisplayArrangements, selectTreeState, selectUnits, store} from "../../../../state/store";
import {GraphDisplayNode as ParseGraphDisplayNode} from "@skogkalk/common/src/parseTree"
import {Provider} from "react-redux";
import {Drag} from "rete-react-plugin";
import React, {useEffect} from "react";
import {Accordion, Button, Col, FloatingLabel, Form, FormSelect, Row} from "react-bootstrap";
import {TextInputField} from "../../../../components/input/textInputField";
import Container from "react-bootstrap/Container";
import parse from "html-react-parser";


export function GraphDisplayGroupControlContainer(
    props: { data: NodeControl<GraphDisplayGroupData> }
) {
    return <Provider store={store}>
        <GraphDisplayGroupControlContents data={props.data}/>
    </Provider>
}

export function GraphDisplayGroupControlContents(
    props : { data: NodeControl<GraphDisplayGroupData> }
) {
    const units = useAppSelector(selectUnits);


    return <>
        <Drag.NoDrag>
            <Container>
                <Row >
                    <Col xs={6}>
                        <TextInputField
                            value={props.data.get('name')}
                            onChange={(value)=>{
                                props.data.set({name: value})
                            }}
                            inputHint={"Name"}
                        />
                    </Col>
                    <Col xs={4}>
                        <FloatingLabel
                            label={"Unit"}
                            onPointerDown={(e)=>{e.stopPropagation()}}
                            onDoubleClick={e=>{e.stopPropagation()}}
                        >
                            <FormSelect
                                className={"field"}
                                aria-label="Default select example"
                                value={props.data.getData().unit}
                                onChange={(e)=> {
                                    props.data.set({unit: e.currentTarget.value})
                                }}

                            >
                                <option value={undefined} >...</option>
                                {units.map(unit=>{
                                    return <option key={unit.id} value={unit.unit.name}>{parse(unit.unit.name)}</option>
                                })
                                }
                            </FormSelect>
                        </FloatingLabel>
                    </Col>
                    <Col xs={2}>
                        <Button
                            onClick={()=>{
                                props.data.set({shouldDelete: true})
                            }}
                        >Delete</Button>
                    </Col>
                </Row>
            </Container>
        </Drag.NoDrag>
    </>
}




export function GraphDisplayNodeControlContainer(
    props: { data: NodeControl<GraphDisplayNodeControlData> }
) {
    return <Provider store={store}>
        <Drag.NoDrag>
            <GraphDisplayNodeControlContainerContent data={props.data}/>
        </Drag.NoDrag>
    </Provider>
}


function GraphDisplayNodeControlContainerContent(
    props: { data: NodeControl<GraphDisplayNodeControlData> }
) {
    const treeState = useAppSelector(selectTreeState);
    const inputFieldShow = props.data.get('inputFieldShow');
    const nodeData = getNodeByID(treeState.tree, props.data.get('nodeID')) as ParseGraphDisplayNode;
    const displayArrangements = useAppSelector(selectDisplayArrangements)
    const inputFields = treeState.tree?.inputs;


    useEffect(() => {
        props.data.set({arrangement: displayArrangements[props.data.get('nodeID')]})
    }, [displayArrangements, props.data]);

    useEffect(()=>{
        const inputs = inputFields?.map((input)=>{
            return {
                name: input.name,
                page: input.pageName,
                id: input.id,
                show: false,
            };

        })
        if(!inputs) { return }
        const displayNodeInputIDs = [...inputFieldShow];

        for(const input of inputs) {
            const show = displayNodeInputIDs.find(data=>data.id===input.id)?.show;
            input.show = show ?? true;
        }
        props.data.setNoUpdate({inputFieldShow: inputs});
    }, [inputFieldShow, inputFields, props.data])




    return<>

        {( treeState.tree && nodeData) &&  <ResultGraph
            treeState={treeState.tree}
            displayData={nodeData}
        /> }
        <Accordion defaultActiveKey="-1">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Toggle available inputs</Accordion.Header>
                <Accordion.Body>
                    {inputFieldShow.map((input, index)=>{
                        return <Form.Check
                            label={`${input.page} : ${input.name}`}
                            checked={input.show}
                            onChange={(e)=>{
                                const newFieldShow = [...inputFieldShow];
                                newFieldShow[index].show = e.currentTarget.checked;
                                props.data.set({inputFieldShow: newFieldShow})
                            }}
                        ></Form.Check>
                    })}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
        <Button onClick={()=>{
            props.data.set({shouldAddGroup: true})
        }}>Add result group</Button>
    </>
}










