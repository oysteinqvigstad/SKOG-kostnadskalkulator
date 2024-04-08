import {FcFinePrint} from "react-icons/fc";
import React from "react";
import {ResultCard} from "./ResultCard";
import {DisplayListNode, getNodeByID, TreeState} from "../parseTree";
import {OutputNode as ParseOutputNode} from "../parseTree";
import {Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";



export function ResultList(props: {
    treeState: TreeState | undefined,
    displayData: DisplayListNode,
}) {
    const nodes = props.displayData.inputOrdering.map((value)=>{
        const node = getNodeByID(props.treeState!, value.outputID) as ParseOutputNode;
        return { color: node.color, ordering: value.ordering, label: value.outputLabel, value: node.value, unit: props.displayData.unit }
    }).sort((a, b)=>(a.ordering ?? 0) - (b.ordering??0));

    const children = (
        <ListGroup className="list-group-flush mt-3">
            {nodes.map(({label, value}) => <ListItem label={label} value={value} unit={props.displayData.unit} />)}
        </ListGroup>
    )

    return (
        <ResultCard
            icon={<FcFinePrint/>}
            title={props.displayData.name}
            children={children}
        />
    )
}

function ListItem(props: {
    label: string,
    value: number,
    unit: string
}) {
    return (
        <ListGroupItem>
            <Row className="g-0" style={{fontSize: '0.9em'}}>
                <Col xs={7}>{props.label}</Col>
                <Col className="text-end" style={{fontWeight: 500}}>{Math.round(props.value)}</Col>
                <Col className="text-start ps-2">{props.unit}</Col>
            </Row>
        </ListGroupItem>
    )
}
