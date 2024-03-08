import {configureStore} from '@reduxjs/toolkit';
import { pagesReducer } from "./slices/pages";
import {formulaInfoReducer} from "./slices/formulaInfo";

export const store = configureStore({
    reducer: {
        pages: pagesReducer,
        formulaInfo: formulaInfoReducer,
    }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectPages = (state: RootState) => state.pages.pages;
export const selectFormulaInfo = (state: RootState) => state.formulaInfo;