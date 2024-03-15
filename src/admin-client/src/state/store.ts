import {configureStore} from '@reduxjs/toolkit';
import { pagesReducer } from "./slices/pages";
import {formulaInfoReducer} from "./slices/formulaInfo";
import {treeStateReducer} from "./slices/treeState";
import {apiService} from "./slices/apiService";

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
export const { useGetCalculatorsInfoQuery } = apiService

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectPages = (state: RootState) => state.pages.pages;
export const selectFormulaInfo = (state: RootState) => state.formulaInfo;
export const selectTreeState = (state: RootState) => state.treeState;

export const selectPageSelection = (state: RootState) => state.pages.selected;