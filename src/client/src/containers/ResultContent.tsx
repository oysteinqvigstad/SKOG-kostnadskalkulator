import React from "react";
import {Alert, Col, Row, Stack} from "react-bootstrap";
import {useAppSelector} from "../state/hooks";
import {selectCalculatorResult} from "../state/formSelectors";
import {ShareResultButton} from "../components/ShareResultButton";
import { ResultGraph } from "../components/result/ResultGraph";
import {ResultProductivity} from "../components/result/ResultProductivity";
import {ResultCost} from "../components/result/ResultCost";
import {ResultTable} from "../components/result/ResultTable";



/**
 * Result page for the harvester and load carrier
 */
export function ResultContent() {

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


    return (
            <Stack className={"mb-3"} gap={3}>
                <Row className={"pt-3"}>
                    <Col xs={12} className={"d-flex justify-content-end"}>
                        <ShareResultButton />
                    </Col>
                </Row>
                <Row className={"row-gap-4"}>
                    <Col md={6} lg={4}>
                        <ResultProductivity />
                    </Col>
                    <Col md={6} lg={4}>
                        <ResultCost />
                    </Col>
                    <Col md={{span: 6, order: 2}} lg={{span: 4, order: 1}}>
                        <ResultTable />
                    </Col>
                    <Col md={{span: 6, order: 1}} lg={{span: 12, order: 2}}>
                        <ResultGraph />
                    </Col>
                </Row>
            </Stack>
    )
}