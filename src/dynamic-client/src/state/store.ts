import { configureStore } from '@reduxjs/toolkit'
import treeReducer from "./treeSlice"
import {apiService} from "./apiService";



/**
 * `store` is a store that is used to define the Redux store.
 */
export const store = configureStore({
    reducer: {
        tree: treeReducer,
        [apiService.reducerPath]: apiService.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiService.middleware)
})

// importing auto generated hooks from the redux toolkit
export const { useGetCalculatorsInfoQuery, useGetCalculatorTreeQuery, useGetCalculatorsInfoIncludingUnpublishedQuery } = apiService

// types that our hooks use, don't use these directly in components
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch