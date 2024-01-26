import {Card, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {ListItem, UnitType} from "../constants/FieldData";
import React from "react";
import {ResultGauge} from "../components/ResultGauge";

export function Result(props: {
    title: string,
    productivity: number,
    listItems: ListItem[]
}) {
    return (
        <Card>
            <Card.Header>{props.title}</Card.Header>

            <ListGroup className="list-group-flush">
            <ListGroupItem>
            <Container>
                <Row className="position-relative">
                    Produktivitet
                    <div className="item-base">
                        <ResultGauge productivity={props.productivity}/>
                    </div>
                    <div className="item-overlay">{UnitType.CUBIC_M_PR_G15}</div>
                </Row>
            </Container>
            </ListGroupItem>
                {props.listItems.map(({text, value, unit}) => {
                    return (
                        <ListGroupItem>
                            <Row>
                                <Col xs={5}>{text}</Col>
                                <Col xs={4} className="text-end">{value.toFixed(2)}</Col>
                                <Col xs={3} className="text-start">{unit}</Col>
                            </Row>
                        </ListGroupItem>
                    )
                })}
            </ListGroup>
        </Card>

    )
}
