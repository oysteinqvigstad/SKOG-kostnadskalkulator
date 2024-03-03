import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "./store";

export const selectInputNodes = createSelector(
    (state: RootState) => state.tree.tree,
    (tree) => tree?.inputs
)

export const selectOutputNodes = createSelector(
    (state: RootState) => state.tree.tree,
    (tree) => tree?.outputs
)

export const selectInputFieldValue = (id: string) => createSelector(
    (state: RootState) => state.tree.inputFieldValues,
    (inputFields) => inputFields[id]
)

export const selectPageTitles = createSelector(
    (state: RootState) => state.tree.tree,
    (tree) => {
        const pages = [...(tree?.rootNode.pages ?? [])]
        pages?.sort((a, b) => {
            return (a.ordering ?? 0) - (b.ordering ?? 0)
        })
        return pages?.map((page) => page.pageName)
    }
)

export const selectDisplayNodes = createSelector(
    (state: RootState) => state.tree.tree,
    (tree) => tree?.displayNodes

)