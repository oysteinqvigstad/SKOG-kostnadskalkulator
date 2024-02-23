import { configureStore } from '@reduxjs/toolkit'
import formReducer from "./formSlice";
import calculatorReducer from "./calculatorSlice";
import {apiService} from "@skogkalk/common/dist/src/services/apiService";


/**
 * `store` is a store that is used to define the Redux store.
 */
export const store = configureStore({
    reducer: {
        form: formReducer,
        calculator: calculatorReducer,
        [apiService.reducerPath]: apiService.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiService.middleware)
})

// importing auto generated hooks from the redux toolkit
export const { useGetCalculatorsQuery, useAddCalculatorMutation } = apiService

// types that our hooks use, don't use these directly in components
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch