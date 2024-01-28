import React from "react";
import {Button, Stack} from "react-bootstrap";
import {Result} from "../containers/Result";
import {UnitType} from "../types/UnitTypes";
import {Calculation, loadCarrierCalculator, logHarvesterCostCalculator} from "../calculator/calculator";

export function ResultPage(props: {setPageNumber: (e: React.MouseEvent, n: number) => void}) {
    // WARNING: Uses Static test data, not actual results!!!!
    const [logHarvesterResult, loadCarrierResult, logHarvesterMidDimension] = staticTestData()

    return (
            <Stack gap={3}>
                <Result
                    title="Hogstmaskin"
                    productivity={logHarvesterResult.timberCubedPerG15Hour}
                    listItems={[
                        {
                            text: "Kostnad",
                            value: logHarvesterResult.costPerTimberCubed.toFixed(0),
                            unit: UnitType.COST_PER_CUBIC_M
                        },
                        {
                            text: "Middeldimensjon",
                            value: logHarvesterMidDimension.toFixed(3),
                            unit: UnitType.CUBIC_M_PR_TREE
                        }
                    ]}
                />
                <Result
                    title="Lassbærer"
                    productivity={loadCarrierResult.timberCubedPerG15Hour}
                    listItems={[
                        {
                            text: "Kostnad",
                            value: loadCarrierResult.costPerTimberCubed.toFixed(0),
                            unit: UnitType.COST_PER_CUBIC_M
                        }
                    ]}
                />
                <div className="d-grid">
                    <Button onClick={e => props.setPageNumber(e, 0)}>Tilbake</Button>
                </div>
            </Stack>
    )
}




function staticTestData(): [Calculation, Calculation, number] {
    const terrainData = {
        drivingDistance: 200,
        drivingConditions: 3,
        incline: 2
    }
    const treeData = {
        sellableTimberVolume: 25,
        timberTrees: 100,
        clearanceTrees: 150
    }

    const roadData = {
        drivingDistance: 500,
        drivingConditions: 3,
        incline: 2
    }

    const logHarvesterResult = logHarvesterCostCalculator(1680, treeData, terrainData)
    const loadCarrierResult = loadCarrierCalculator(1220, terrainData, roadData, treeData, 20, 5)
    const midDimension = treeData.sellableTimberVolume / treeData.timberTrees

    if(!logHarvesterResult.ok || !loadCarrierResult.ok) {
        throw new Error("Result not ok")
    }
    return [logHarvesterResult.value, loadCarrierResult.value, midDimension]

}
