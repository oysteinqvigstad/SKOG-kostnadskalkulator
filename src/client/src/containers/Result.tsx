import {Card, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {ResultListItem} from "../types/FieldData";
import {UnitType} from "../types/UnitTypes";
import React from "react";
import {ResultGauge} from "../components/ResultGauge";
import '../App.css'

export function Result(props: {
    title: string,
    productivity: number,
    listItems: ResultListItem[]
}) {
    return (
        <Card>
            <Card.Header>
                {props.title}
            </Card.Header>
            <ListGroup className="list-group-flush">
                    <ResultFigure productivity={props.productivity} />
                <ResultLines listItems={props.listItems} />
            </ListGroup>
        </Card>
    )
}

function ResultFigure({productivity}: {productivity: number}) {
   return (
       <ListGroupItem>
           <Container>
               <Row className="position-relative">
                   <Container className="d-flex position-absolute ps-0">
                       {"Produktivitet"}
                   </Container>
                   <Container>
                       <ResultGauge productivity={productivity}/>
                   </Container>
                   <Container className="d-flex position-absolute justify-content-center" style={{top: '88%'}}>
                       {UnitType.CUBIC_M_PR_G15}
                   </Container>
               </Row>
           </Container>
       </ListGroupItem>
   )
}

function ResultLines({listItems}: {listItems: ResultListItem[]}) {
    return (
        <>
            {listItems.map(({text, value, unit}) => {
                return (
                    <ListGroupItem>
                        <Row className="g-0">
                            <Col xs={8}>{text}</Col>
                            <Col className="text-end" style={{fontWeight: 500}}>{value}</Col>
                            <Col className="text-start ps-2">{unit}</Col>
                        </Row>
                    </ListGroupItem>
                )
            })}
        </>
    )
}