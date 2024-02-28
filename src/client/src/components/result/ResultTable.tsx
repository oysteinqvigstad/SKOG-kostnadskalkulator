import {Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {FcFinePrint} from "react-icons/fc";
import React from "react";
import {ResultListItem} from "../../types/ResultListItem";
import {ResultCard} from "./ResultCard";

export function ResultTable(props: {
    costItems: ResultListItem[]
}) {

    const children = (
        <ListGroup className="list-group-flush mt-3">
            <CostLines listItems={props.costItems}/>
        </ListGroup>
    )

    return (
        <ResultCard
            icon={<FcFinePrint/>}
            title={"Kostnadsoverslag"}
            children={children}
        />
    )
}

/**
 * The list of additional result lines for the harvester or load carrier
 * @param listItems - array of additional calculations to display
 */
function CostLines({listItems}: {listItems: ResultListItem[]}) {
    return (
        <>
            {listItems.map(({text, value, unit}) => {
                return (
                    <ListGroupItem>
                        <Row className="g-0" style={{fontSize: '0.9em'}}>
                            <Col xs={7}>{text}</Col>
                            <Col className="text-end" style={{fontWeight: 500}}>{Math.round(value)}</Col>
                            <Col className="text-start ps-2">{unit}</Col>
                        </Row>
                    </ListGroupItem>
                )
            })}
        </>
    )
}
