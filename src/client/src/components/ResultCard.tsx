import {Card, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import React from "react";
import {ResultGauge} from "./ResultGauge";
import '../App.css'
import {ResultListItem} from "../types/ResultListItem";
import {UnitType} from "../types/UnitType";

/**
 * The result component for the result page, displaying the result of the calculations for the harvester or load carrier
 * @param props - title: string - the title of the result
 *              - productivity: number - the productivity of the harvester or load carrier
 *              - listItems: ResultListItem[] - the list of items to display in the result
 */
export function ResultCard(props: {
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

/**
 * The visual representation of the productivity of the harvester or load carrier, including a gauge and the unit
 * @param productivity - the productivity of the harvester or load carrier
 */
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

/**
 * The list of additional result lines for the harvester or load carrier
* @param listItems - array of additional calculations to display
 */
function ResultLines({listItems}: {listItems: ResultListItem[]}) {
    return (
        <>
            {listItems.map(({text, value, unit}) => {
                return (
                    <ListGroupItem>
                        <Row className="g-0">
                            <Col xs={7}>{text}</Col>
                            <Col className="text-end" style={{fontWeight: 500}}>{value}</Col>
                            <Col className="text-start ps-2">{unit}</Col>
                        </Row>
                    </ListGroupItem>
                )
            })}
        </>
    )
}