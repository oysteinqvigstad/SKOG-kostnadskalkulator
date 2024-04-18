import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CalculatorData} from "../types/CalculatorData";

/**
 * `CalculatorState` is an interface that is used to define the calculator state.
 */
interface CalculatorState {
    calculatorData: CalculatorData
}

/**
 * `initialState` is an object that is used to define the initial state of the calculator slice.
 */
const initialState : CalculatorState = {
    calculatorData: {
        id: -1,
        name: "",
        description: ""
    }
}

/**
 * `calculatorSlice` is a slice that is used to define the calculator state and the actions that can be used to modify the calculator state.
 */
export const calculatorSlice = createSlice({
    name: "calculator",
    initialState,
    reducers: {
        setCalculatorData: (state, action: PayloadAction<CalculatorData>) => {
            state.calculatorData = action.payload
        },
    }
})

export const {setCalculatorData} = calculatorSlice.actions

export default calculatorSlice.reducer