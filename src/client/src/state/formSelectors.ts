import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {DrivingData, ForestType, TreeData} from "../calculator/calculator";
import {FieldNames} from "../types/FieldNames";

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
