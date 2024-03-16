import {configureStore} from '@reduxjs/toolkit';
import {apiService} from "./slices/apiService";
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
        treeState: treeStateReducer,
        [apiService.reducerPath]: apiService.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiService.middleware)
});

// importing auto generated hooks from the redux toolkit
export const { useGetCalculatorsInfoQuery, useAddCalculatorMutation, useGetCalculatorSchemaQuery } = apiService

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectPages = (state: RootState) => state.pages.pages;
export const selectFormulaInfo = (state: RootState) => state.formulaInfo;
export const selectTreeState = (state: RootState) => state.treeState;

export const selectPageSelection = (state: RootState) => state.pages.selected;