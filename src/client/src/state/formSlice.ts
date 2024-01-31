import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface FormState {
    page: number
    validated: boolean
    fields: {
        [key: string]: string
    }
}

const initialState: FormState = {
    page: 0,
    validated: false,
    fields: {}
}

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