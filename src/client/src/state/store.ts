import { configureStore } from '@reduxjs/toolkit'
import formReducer from "./formSlice";
import treeReducer from "./treeSlice"
import calculatorReducer from "./calculatorSlice";
import {apiService} from "./apiService";



/**
 * `store` is a store that is used to define the Redux store.
 */
export const store = configureStore({
    reducer: {
        form: formReducer,
        tree: treeReducer,
        calculator: calculatorReducer,
        [apiService.reducerPath]: apiService.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiService.middleware)
})

// importing auto generated hooks from the redux toolkit
export const { useGetCalculatorQuery, useAddCalculatorMutation } = apiService

// types that our hooks use, don't use these directly in components
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch