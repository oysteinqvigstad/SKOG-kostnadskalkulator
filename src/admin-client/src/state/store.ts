import {configureStore} from '@reduxjs/toolkit';
import { pagesReducer } from "./slices/pages";
import {formulaInfoReducer} from "./slices/formulaInfo";
import {treeStateReducer, treeStateSlice} from "./slices/treeState";

export const store = configureStore({
    reducer: {
        pages: pagesReducer,
        formulaInfo: formulaInfoReducer,
        treeState: treeStateReducer
    }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectPages = (state: RootState) => state.pages.pages;
export const selectFormulaInfo = (state: RootState) => state.formulaInfo;
export const selectTreeState = (state: RootState) => state.treeState;