import React from "react";
import {Alert, Stack} from "react-bootstrap";
import {ResultCard} from "../components/ResultCard";
import {UnitType} from "../types/UnitType";
import {loadCarrierCalculator, logHarvesterCostCalculator} from "../calculator/calculator";
import {useAppSelector} from "../state/hooks";
import {selectHarvesterData, selectLoadCarrierData} from "../state/formSelectors";
import {ShareResultButton} from "../components/ShareResultButton";



/**
 * Result page for the harvester and load carrier
 */
export function ResultContent() {

    // Get the data from the store and calculate the result
    const harvesterData = useAppSelector(selectHarvesterData)
    const harvesterResult = logHarvesterCostCalculator(
        harvesterData.harvesterCost,
        harvesterData.treeData,
        harvesterData.terrainData
    )

    // Get the data from the store and calculate the result
    const loadCarrierData = useAppSelector(selectLoadCarrierData)
    const loadCarrierResult = loadCarrierCalculator(
        loadCarrierData.carrierCost,
        loadCarrierData.terrainData,
        loadCarrierData.roadData,
        loadCarrierData.treeData,
        loadCarrierData.timerLoadSize,
        loadCarrierData.distinctAssortments
        )

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
                        },
                        {
                            text: "Middeldimensjon",
                            value: harvesterData.midDimension.toFixed(3),
                            unit: UnitType.CUBIC_M_PR_TREE
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
                <ShareResultButton />
            </Stack>
    )
}