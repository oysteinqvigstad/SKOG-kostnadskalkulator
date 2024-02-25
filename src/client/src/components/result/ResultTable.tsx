import {Alert, Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {FcFinePrint} from "react-icons/fc";
import React from "react";
import {useAppSelector} from "../../state/hooks";
import {selectCalculatorResult} from "../../state/formSelectors";
import {ResultListItem} from "../../types/ResultListItem";
import {UnitType} from "../../types/UnitType";
import {ResultCard} from "./ResultCard";

export function ResultTable() {
    const {harvesterResult, loadCarrierResult} = useAppSelector(selectCalculatorResult)

    // If the result is not ok, show an error message to user
    if(!harvesterResult.ok || !loadCarrierResult.ok) {
        return (
            <Alert variant={"warning"}>
                {"Uventet feil oppsto ved kalkulasjon. "}
                <br />
                {"Vennligst kontroller opplysningene du oppga."}
            </Alert>
        )
    }

    const harvesterCost = Math.round(harvesterResult.value.costPerTimberCubed)
    const forwarderCost = Math.round(loadCarrierResult.value.costPerTimberCubed)

    const items: ResultListItem[] = [
        {
            text: "Hogstmaskin",
            value: harvesterCost.toFixed(),
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Lassbærer",
            value: forwarderCost.toFixed(),
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Oppstartskostnader",
            value: "0",
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Flyttekostnader",
            value: "0",
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Etablere midlertidig bru",
            value: "0",
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Klopplegging",
            value: "0",
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Gravemaskinarbeid",
            value: "0",
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Manuelt tilleggsarbeid",
            value: "0",
            unit: UnitType.COST_PER_CUBIC_M
        },
    ]

    const children = (
        <ListGroup className="list-group-flush mt-3">
            <CostLines listItems={items}/>
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
                            <Col className="text-end" style={{fontWeight: 500}}>{value}</Col>
                            <Col className="text-start ps-2">{unit}</Col>
                        </Row>
                    </ListGroupItem>
                )
            })}
        </>
    )
}
