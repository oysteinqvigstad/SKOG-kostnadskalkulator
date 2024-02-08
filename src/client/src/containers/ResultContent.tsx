import React from "react";
import {Alert, Button, OverlayTrigger, Stack, Tooltip} from "react-bootstrap";
import {ResultCard} from "../components/ResultCard";
import {UnitType} from "../types/UnitType";
import {loadCarrierCalculator, logHarvesterCostCalculator} from "../calculator/calculator";
import {useAppSelector} from "../state/hooks";
import {selectHarvesterData, selectLoadCarrierData} from "../state/formSelectors";
import {Share} from "react-bootstrap-icons";


/**
 * Result page for the harvester and load carrier
 */
export function ResultContent() {
    const fields = useAppSelector((state) => state.form.fields)

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


    const copyToClipboard = async () => {
        try {
            const queries = Object.entries(fields).map(([key, value]) => {
                return `${key}=${value}`
            }).join("&")
            const url = `${window.location.origin}/resultat?${queries}`
            await navigator.clipboard.writeText(url);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
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
                <OverlayTrigger
                    overlay={<Tooltip>Link kopiert til utklippstavle</Tooltip>}
                    placement={"top"}
                    delay={{show: 250, hide: 400}}
                >
                    <Button onClick={() => copyToClipboard()}>{"Lagre/del resultat"}<Share className={"ms-2"} /></Button>
                </OverlayTrigger>
            </Stack>
    )
}