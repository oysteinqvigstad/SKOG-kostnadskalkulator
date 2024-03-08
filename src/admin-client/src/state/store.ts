import {configureStore} from '@reduxjs/toolkit';
import { pagesReducer } from "./slices/pages";

export const store = configureStore({
    reducer: {
        pages: pagesReducer
    }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectPages = (state: RootState) => state.pages.pages;