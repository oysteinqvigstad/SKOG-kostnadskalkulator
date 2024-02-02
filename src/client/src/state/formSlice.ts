import {createSlice, PayloadAction} from "@reduxjs/toolkit";

/**
 * `FormState` is an interface that is used to define the form state.
 */
interface FormState {
    page: number
    validated: boolean
    fields: {
        [key: string]: string
    }
}

/**
 * `initialState` is an object that is used to define the initial state of the form slice.
 */
const initialState: FormState = {
    page: 0,
    validated: false,
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
        }
    }
})

export const { setField, setPage, setValidated } = formSlice.actions
export default formSlice.reducer