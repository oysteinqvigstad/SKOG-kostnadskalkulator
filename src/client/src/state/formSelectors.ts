import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {DrivingData, TreeData} from "../calculator/calculator";
import {FieldNames} from "../types/FieldData";

export const selectHarvesterData = createSelector(
    (state: RootState) => state.form.fields,
    (fields) => {
        return {
            harvesterCost: parseInt(fields[FieldNames.TIMEKOST_HOGSTMASKIN]),
            treeData: {
                sellableTimberVolume: parseInt(fields[FieldNames.VOLUM_PR_DEKAR]),
                timberTrees: parseInt(fields[FieldNames.TOMMERTREAR_PR_DEKAR]),
                clearanceTrees: parseInt(fields[FieldNames.RYDDETREAR_PR_DEKAR])
            } as TreeData,
            terrainData: {
                drivingDistance: parseInt(fields[FieldNames.RYDDETREAR_PR_DEKAR]),
                drivingConditions: parseInt(fields[FieldNames.OVERFLATESTRUKTUR_TERRENG]),
                incline: parseInt(fields[FieldNames.HELLING_HOGSTFELT])
            } as DrivingData,
            midDimension: parseInt(fields[FieldNames.VOLUM_PR_DEKAR]) / parseInt(fields[FieldNames.TOMMERTREAR_PR_DEKAR])
        }
    }
)

