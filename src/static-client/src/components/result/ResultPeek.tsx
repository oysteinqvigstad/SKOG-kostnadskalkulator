import {useAppSelector} from "../../state/hooks";
import {selectCalculatorResult} from "../../state/formSelectors";
import {Alert} from "react-bootstrap";
import {UnitType} from "../../types/UnitType";
import React from "react";
import {ResultRowBoxes} from "./ResultRowBoxes";

export function ResultPeek() {
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


    const costs = [
        {
            text: "Hogstmaskin",
            value: harvesterResult.value.costPerTimberCubed,
            unit: UnitType.COST_PER_CUBIC_M,
            color: "#008FFB"
        },
        {
            text: "Lassbærer",
            value: loadCarrierResult.value.costPerTimberCubed,
            unit: UnitType.COST_PER_CUBIC_M,
            color: "#00E396"

        },
        {
            text: "Tillegg",
            value: Object.values(extraCostResult.value).reduce((acc, curr) => acc + curr, 0),
            unit: UnitType.COST_PER_CUBIC_M,
            color: '#FEB019'
        }
    ]

    const productivity = [
        {
            text: "Hogstmaskin",
            value: harvesterResult.value.timberCubedPerG15Hour,
            percentage: harvesterResult.value.timberCubedPerG15Hour * 2,
            unit: UnitType.CUBIC_M_PR_G15,
            color: '#008FFB'
        },
        {
            text: "Lassbærer",
            value: loadCarrierResult.value.timberCubedPerG15Hour,
            percentage: loadCarrierResult.value.timberCubedPerG15Hour * 2,
            unit: UnitType.CUBIC_M_PR_G15,
            color: '#00E396'
        },
    ]


    return (
            <ResultRowBoxes listItems={[...costs, ...productivity]} />
    )
}