import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "./store";

// `useAppDispatch` is used for dispatching an action.
// This hook includes the thunk middleware types. In short, it avoids
// problems when forgetting to include import of `AppDispatch`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

// `useAppSelector` is used for retrieving data from the store.
// This hook infers the expected parameter type for (state: Rootstate)
export const useAppSelector = useSelector.withTypes<RootState>()