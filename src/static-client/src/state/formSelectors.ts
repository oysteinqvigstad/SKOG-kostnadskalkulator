import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {
    DrivingData, extraCostCalculator,
    ForestType,
    loadCarrierCalculator,
    logHarvesterCostCalculator,
    TreeData
} from "../calculator/calculator";
import {FieldNames} from "../types/FieldNames";
import {staticFieldDescriptions} from "../data/staticFieldDescriptions";
import {DropdownProperties, FieldType} from "../types/FieldData";

/**
 * `selectHarvesterData` is a selector that is used to select the harvester data from the form fields.
 */
export const selectHarvesterData = createSelector(
    (state: RootState) => state.form.fields,
    (fields) => {
        return {
            harvesterCost: parseInt(fields[FieldNames.TIMEKOST_HOGSTMASKIN]),
            treeData: {
                sellableTimberVolume: parseInt(fields[FieldNames.VOLUM_PR_DEKAR]),
                timberTrees: parseInt(fields[FieldNames.TOMMERTREAR_PR_DEKAR]),
                clearanceTrees: parseInt(fields[FieldNames.RYDDETREAR_PR_DEKAR]),
                forestType: parseInt(fields[FieldNames.SKOGTYPE]) as ForestType
            } as TreeData,
            terrainData: {
                drivingDistance: parseInt(fields[FieldNames.KJOREAVSTAND_TERRENG]),
                drivingConditions: parseInt(fields[FieldNames.OVERFLATESTRUKTUR_TERRENG]),
                incline: parseInt(fields[FieldNames.HELLING_HOGSTFELT])
            } as DrivingData,
            midDimension: parseInt(fields[FieldNames.VOLUM_PR_DEKAR]) / parseInt(fields[FieldNames.TOMMERTREAR_PR_DEKAR])
        }
    }
)

/**
 * `selectLoadCarrierData` is a selector that is used to select the load carrier data from the form fields.
 */
export const selectLoadCarrierData = createSelector(
    (state: RootState) => state.form.fields,
    (fields) => {
        return {
            carrierCost: parseInt(fields[FieldNames.TIMEKOST_LASSBEARER]),
            treeData: {
                sellableTimberVolume: parseInt(fields[FieldNames.VOLUM_PR_DEKAR]),
                timberTrees: parseInt(fields[FieldNames.TOMMERTREAR_PR_DEKAR]),
                clearanceTrees: parseInt(fields[FieldNames.RYDDETREAR_PR_DEKAR]),
                forestType: parseInt(fields[FieldNames.SKOGTYPE]) as ForestType
            } as TreeData,
            terrainData: {
                drivingDistance: parseInt(fields[FieldNames.KJOREAVSTAND_TERRENG]),
                drivingConditions: parseInt(fields[FieldNames.OVERFLATESTRUKTUR_TERRENG]),
                incline: parseInt(fields[FieldNames.HELLING_HOGSTFELT])
            } as DrivingData,
            roadData: {
                drivingDistance: parseInt(fields[FieldNames.KJOREAVSTAND_VEG]),
                drivingConditions: parseInt(fields[FieldNames.OVERFLATESTRUKTUR_TRAKTORVEG]),
                incline: parseInt(fields[FieldNames.HELLING_PAA_TRAKTORVEG])
            } as DrivingData,
            timerLoadSize: parseInt(fields[FieldNames.LASSTORRELSE]),
            distinctAssortments: parseInt(fields[FieldNames.ANTALL_SORTIMENT])
        }
    }
)
export const selectCalculatorResult = createSelector(
    (state: RootState) => state.form.fields,
    (fields) => {
        const {
            harvesterCost,
            treeData,
            terrainData,
            carrierCost,
            roadData,
            timberLoadSize,
            distinctAssortments
        } = structureData(fields)

        return {
            harvesterResult: logHarvesterCostCalculator(
                harvesterCost,
                treeData,
                terrainData
            ),
            loadCarrierResult: loadCarrierCalculator(
                carrierCost,
                terrainData,
                roadData,
                treeData,
                timberLoadSize,
                distinctAssortments
            ),
            extraCostResult: extraCostCalculator(
                parseInt(fields[FieldNames.VOLUM_PR_DEKAR]) * parseInt(fields[FieldNames.ANTALL_DEKAR]),
                parseInt(fields[FieldNames.OPPSTARTSKOSTNADER]),
                parseInt(fields[FieldNames.ENHETSPRIS_MASKINFLYTT]),
                parseInt(fields[FieldNames.ENHETSPRIS_BRO]),
                parseInt(fields[FieldNames.ENHETSPRIS_KLOPP]),
                parseInt(fields[FieldNames.TIMEKOST_GRAVEMASKIN]),
                parseInt(fields[FieldNames.MANUELT_TILLEGGSARBEID]),
                parseInt(fields[FieldNames.ANTALL_MASKINFLYTT]),
                parseInt(fields[FieldNames.ANTALL_BRUER]),
                parseInt(fields[FieldNames.KLOPPLEGGING]),
                parseInt(fields[FieldNames.TIMER_GRAVEMASKIN]),
                parseInt(fields[FieldNames.TIMER_TILLEGGSARBEID])
            )
        }
    }
)


export const selectCalculatorSeriesResult = (field: FieldNames, values: string[]) => createSelector(
    (state: RootState) => state.form.fields,
    (fields) => {
        return values.map((value) => {
            const newFields = {...fields, [field]: value}
            const {
                harvesterCost,
                treeData,
                terrainData,
                carrierCost,
                roadData,
                timberLoadSize,
                distinctAssortments
            } = structureData(newFields)

            return {
                harvesterResult: logHarvesterCostCalculator(
                    harvesterCost,
                    treeData,
                    terrainData
                ),
                loadCarrierResult: loadCarrierCalculator(
                    carrierCost,
                    terrainData,
                    roadData,
                    treeData,
                    timberLoadSize,
                    distinctAssortments
                ),

            }
        })
    }
)

export const selectGraphXaxis = (field: FieldNames) => createSelector(
    (state: RootState) => state.form.fields,
    (fields) => {
        const fieldData = staticFieldDescriptions.find((fieldData) => fieldData.title === field)

        switch (fieldData?.type) {
            case FieldType.NUMBERED_INPUT:
                const steps = 5
                const baseValue = parseInt(fields[field])
                const stepSize = Math.ceil(baseValue * 0.10)
                const range = []
                for (let i = -steps; i <= steps; i++) {
                    range.push((i * stepSize + baseValue).toString())
                }
                return {
                    labels: range,
                    values: range
                }
            case FieldType.DROPDOWN_INPUT:
                const options = (fieldData.properties as DropdownProperties).options
                return {
                    labels: Array.from(options.keys()),
                    values: Array.from(options.values())
                }
            default:
                return {
                    labels: [""],
                    values: [""]
                }

        }
    }
)

export const selectXasisText = (field: FieldNames) => createSelector(
    (state: RootState) => state.form.fields,
    (fields) => {
        const fieldData = staticFieldDescriptions.find((fieldData) => fieldData.title === field)
        switch (fieldData?.type) {
            case FieldType.NUMBERED_INPUT:
                return fields[field]
            case FieldType.DROPDOWN_INPUT:
                const options = (fieldData.properties as DropdownProperties).options.entries()
                return Array.from(options).find(([_, value]) => value === fields[field])?.[0] ?? ""
            default:
                return ""
        }
    }
)


const structureData = (fields: {[key: string]: string}) => {
    const harvesterCost = parseInt(fields[FieldNames.TIMEKOST_HOGSTMASKIN])
    const carrierCost = parseInt(fields[FieldNames.TIMEKOST_LASSBEARER])
    const treeData: TreeData = {
        sellableTimberVolume: parseInt(fields[FieldNames.VOLUM_PR_DEKAR]),
        timberTrees: parseInt(fields[FieldNames.TOMMERTREAR_PR_DEKAR]),
        clearanceTrees: parseInt(fields[FieldNames.RYDDETREAR_PR_DEKAR]),
        forestType: parseInt(fields[FieldNames.SKOGTYPE]) as ForestType
    }
    const terrainData: DrivingData = {
        drivingDistance: parseInt(fields[FieldNames.KJOREAVSTAND_TERRENG]),
        drivingConditions: parseInt(fields[FieldNames.OVERFLATESTRUKTUR_TERRENG]),
        incline: parseInt(fields[FieldNames.HELLING_HOGSTFELT])
    }
    const roadData: DrivingData = {
        drivingDistance: parseInt(fields[FieldNames.KJOREAVSTAND_VEG]),
        drivingConditions: parseInt(fields[FieldNames.OVERFLATESTRUKTUR_TRAKTORVEG]),
        incline: parseInt(fields[FieldNames.HELLING_PAA_TRAKTORVEG])
    }
    const timberLoadSize = parseInt(fields[FieldNames.LASSTORRELSE])
    const distinctAssortments = parseInt(fields[FieldNames.ANTALL_SORTIMENT])

    return {
        harvesterCost,
        carrierCost,
        treeData,
        terrainData,
        roadData,
        timberLoadSize,
        distinctAssortments
    }
}


