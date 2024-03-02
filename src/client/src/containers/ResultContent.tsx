import React from "react";
import {Alert, Col, Row, Stack} from "react-bootstrap";
import {useAppSelector} from "../state/hooks";
import {selectCalculatorResult} from "../state/formSelectors";
import { ResultGraph } from "../components/result/ResultGraph";
import {ResultTable} from "../components/result/ResultTable";
import {ResultListItem} from "../types/ResultListItem";
import {UnitType} from "../types/UnitType";
import { ResultProductivityRadial } from "../components/result/ResultProductivityRadial";
import {ResultCost} from "../components/result/ResultCost";
import {ResultParameters} from "../components/result/ResultParameters";



/**
 * Result page for the harvester and load carrier
 */
export function ResultContent() {

    const {harvesterResult, loadCarrierResult, extraCostResult} = useAppSelector(selectCalculatorResult)

    // If the result is not ok, show an error message to user
    if(!harvesterResult.ok || !loadCarrierResult.ok || !extraCostResult.ok) {
        return (
            <Alert variant={"warning"}>
                {"Uventet feil oppsto ved kalkulasjon. "}
                <br />
                {"Vennligst kontroller opplysningene du oppga."}
            </Alert>
        )
    }


    const costLines: ResultListItem[] = [
        {
            text: "Hogstmaskin",
            value: harvesterResult.value.costPerTimberCubed,
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Lassbærer",
            value: loadCarrierResult.value.costPerTimberCubed,
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Oppstartskostnader",
            value: extraCostResult.value.oppstartskostnader,
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Flyttekostnader",
            value: extraCostResult.value.flyttekostnader,
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Etablere midlertidig bru",
            value: extraCostResult.value.etablereBru,
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Klopplegging",
            value: extraCostResult.value.klopplegging,
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Gravemaskinarbeid",
            value: extraCostResult.value.gravearbeid,
            unit: UnitType.COST_PER_CUBIC_M
        },
        {
            text: "Manuelt tilleggsarbeid",
            value: extraCostResult.value.manueltTilleggsarbeid,
            unit: UnitType.COST_PER_CUBIC_M
        },
    ]

    const costCategories = [
        costLines[0],
        costLines[1],
        {
            text: "Tillegg",
            value: costLines.slice(2).reduce((acc, cost) => acc + cost.value, 0),
            unit: UnitType.COST_PER_CUBIC_M
        }
    ]

    const productivity = [
        {
            text: "Hogstmaskin",
            value: harvesterResult.value.timberCubedPerG15Hour,
            percentage: harvesterResult.value.timberCubedPerG15Hour * 2,
            unit: UnitType.CUBIC_M_PR_G15
        },
        {
            text: "Lassbærer",
            value: loadCarrierResult.value.timberCubedPerG15Hour,
            percentage: loadCarrierResult.value.timberCubedPerG15Hour * 2,
            unit: UnitType.CUBIC_M_PR_G15
        }
    ]

    return (
            <Stack className={"mb-3"} gap={3}>
                <Row className={"row-gap-4"}>
                    <Col md={6} lg={4}>
                        <ResultProductivityRadial
                            productivityItems={productivity}
                        />
                    </Col>
                    <Col md={6} lg={4}>
                        <ResultCost
                            costCategories={costCategories}/>
                    </Col>
                    <Col md={{span: 6, order: 2}} lg={{span: 4, order: 1}}>
                        <ResultTable
                            costItems={costLines}
                        />
                    </Col>
                    <Col md={{span: 6, order: 3}} lg={{span: 8, order: 2}} className={"d-none d-md-block"}>
                        <ResultParameters />
                    </Col>
                    <Col md={{span: 6, order: 1}} lg={{span: 4, order: 3}}>
                        <ResultGraph />
                    </Col>
                </Row>
            </Stack>
    )
}