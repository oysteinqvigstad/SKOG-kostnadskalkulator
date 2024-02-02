import { configureStore } from '@reduxjs/toolkit'
import formReducer from "./formSlice";

/**
 * `store` is a store that is used to define the Redux store.
 */
export const store = configureStore({
    reducer: {
        form: formReducer
    }
})

// types that our hooks use, don't use these directly in components
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch