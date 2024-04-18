import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {staticFieldDescriptions} from "../data/staticFieldDescriptions";

/**
 * `FormState` is an interface that is used to define the form state.
 */
interface FormState {
    page: number
    parameterPage: number
    validated: boolean
    hideAdvanced: boolean
    fields: {
        [key: string]: string
    }
}

/**
 * `initialState` is an object that is used to define the initial state of the form slice.
 */
const initialState: FormState = {
    page: 0, // the input fields that are visible on the input page
    parameterPage: 1, // The input field card that is visible on the result page
    validated: false,
    hideAdvanced: false,
    fields: {}
}

/**
 * `formSlice` is a slice that is used to define the form state and the actions that can be used to modify the form state.
 */
export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setField: (state, action: PayloadAction<{title: string, value: string}>) => {
            state.fields[action.payload.title] = action.payload.value
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setValidated: (state, action: PayloadAction<boolean>) => {
            state.validated = action.payload
        },
        setParameterPage: (state, action: PayloadAction<number>) => {
            state.parameterPage = action.payload
        },
        resetAllFields: (state) => {
            staticFieldDescriptions.forEach((fieldData) => {
                if (fieldData.default) {
                    state.fields[fieldData.title] = fieldData.default
                }
            })
        },
        toggleHideAdvanced: (state) => {
            state.hideAdvanced = !state.hideAdvanced
        }
    }
})

export const { setField, setPage, setValidated, setParameterPage, resetAllFields, toggleHideAdvanced } = formSlice.actions
export default formSlice.reducer