import React from "react";
import {Alert, Stack} from "react-bootstrap";
import {ResultCard} from "../components/result/ResultCard";
import {UnitType} from "../types/UnitType";
import {useAppSelector} from "../state/hooks";
import {selectCalculatorResult} from "../state/formSelectors";
import {ShareResultButton} from "../components/ShareResultButton";
import { ResultGraph } from "../components/result/ResultGraph";
import {ResultProductivity} from "../components/result/ResultProductivity";
import {ResultCost} from "../components/result/ResultCost";



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
                <ResultCard
                    title="Hogstmaskin"
                    productivity={harvesterResult.value.timberCubedPerG15Hour}
                    listItems={[
                        {
                            text: "Kostnad",
                            value: harvesterResult.value.costPerTimberCubed.toFixed(0),
                            unit: UnitType.COST_PER_CUBIC_M
                        }
                    ]}
                />
                <ResultCard
                    title="Lassbærer"
                    productivity={loadCarrierResult.value.timberCubedPerG15Hour}
                    listItems={[
                        {
                            text: "Kostnad",
                            value: loadCarrierResult.value.costPerTimberCubed.toFixed(0),
                            unit: UnitType.COST_PER_CUBIC_M
                        }
                    ]}
                />
                <ResultProductivity />
                <ResultCost />
                <ResultGraph />
                <ShareResultButton />
            </Stack>
    )
}