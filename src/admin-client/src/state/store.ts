import {configureStore} from '@reduxjs/toolkit';
import {pagesReducer, PagesState} from "./slices/pages";
import {formulaInfoReducer, FormulaInfoState} from "./slices/formulaInfo";
import {TreeSliceState, treeStateReducer} from "./slices/treeState";

export interface StoreState {
    pages: PagesState,
    formulaInfo: FormulaInfoState,
    treeState: TreeSliceState
}

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

export const selectPageSelection = (state: RootState) => state.pages.selected;