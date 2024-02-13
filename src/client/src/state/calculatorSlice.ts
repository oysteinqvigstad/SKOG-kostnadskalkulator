import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CalculatorData} from "../types/CalculatorData";

interface CalculatorState {
    calculatorData: CalculatorData
}

const initialState : CalculatorState = {
    calculatorData: {
        id: -1,
        name: "",
        description: ""
    }
}

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