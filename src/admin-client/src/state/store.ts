import {configureStore} from '@reduxjs/toolkit';
import {apiService} from "./slices/apiService";
import {pagesReducer, PagesState} from "./slices/pages";
import {formulaInfoReducer, FormulaInfoState} from "./slices/formulaInfo";
import {TreeSliceState, treeStateReducer} from "./slices/treeState";
import {unitsReducer, UnitsState,} from "./slices/units";

export interface StoreState {
    pages: PagesState,
    units: UnitsState,
    formulaInfo: FormulaInfoState,
    treeState: TreeSliceState
}

export const store = configureStore({
    reducer: {
        pages: pagesReducer,
        units: unitsReducer,
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
export const selectUnits = (state: RootState) => state.units.units;
export const selectFormulaInfo = (state: RootState) => state.formulaInfo;
export const selectTreeState = (state: RootState) => state.treeState;

export const selectPageSelection = (state: RootState) => state.pages.selected;