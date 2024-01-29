import React from "react";
import {Button, Stack} from "react-bootstrap";
import {Result} from "../containers/Result";
import {UnitType} from "../types/UnitTypes";
import {Calculation, loadCarrierCalculator, logHarvesterCostCalculator} from "../calculator/calculator";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setPage} from "../state/formSlice";
import {selectHarvesterData} from "../state/formSelectors";




export function ResultPage() {
    const dispatch = useAppDispatch()

    const harvesterData = useAppSelector(selectHarvesterData)
    const harvesterResult = logHarvesterCostCalculator(harvesterData.harvesterCost, harvesterData.treeData, harvesterData.terrainData)

    if(!harvesterResult.ok) {
        throw new Error("Result not ok")
    }

    // WARNING: Uses Static test data, not actual results!!!!
    const loadCarrierResult = staticTestData()


    return (
            <Stack gap={3}>
                <Result
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
                    <Button onClick={() => dispatch(setPage(0))}>Tilbake</Button>
                </div>
            </Stack>
    )
}




function staticTestData(): Calculation {
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

    // const logHarvesterResult = logHarvesterCostCalculator(1680, treeData, terrainData)
    const loadCarrierResult = loadCarrierCalculator(1220, terrainData, roadData, treeData, 20, 5)
    // const midDimension = treeData.sellableTimberVolume / treeData.timberTrees

    if(/* !logHarvesterResult.ok || */ !loadCarrierResult.ok) {
        throw new Error("Result not ok")
    }
    return loadCarrierResult.value

}
