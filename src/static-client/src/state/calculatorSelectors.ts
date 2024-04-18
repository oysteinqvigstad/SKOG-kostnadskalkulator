import {createSelector} from "@reduxjs/toolkit";
import {CalculatorData} from "../types/CalculatorData";
import {RootState} from "./store";

/**
 * `selectCalculatorData` is a selector that is used to select the calculator data from the store.
 */
export const selectCalculatorData = createSelector(
    (state: RootState) => state.calculator.calculatorData,
    (calculatorData: CalculatorData)=> {
        return {
            id: calculatorData.id,
            name: calculatorData.name,
            description: calculatorData.description
        }
    }
)