import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {VisualResult} from "../types/ResultListItem";
import {getNodeByID, OutputNode} from "@skogkalk/common/dist/src/parseTree";

export const selectInputNodes = createSelector(
    (state: RootState) => state.tree.tree,
    (tree) => tree?.inputs
)

export const selectActivePage = createSelector(
    (state: RootState) => state.tree,
    (tree) => tree.activePage
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

export const selectResults = createSelector(
    (state: RootState) => state.tree.tree,
    (tree) => {
        console.log(tree?.displayNodes)
        return tree?.displayNodes.map((node) => {
            return {
                name: node.name,
                items: node.inputOrdering.map((inputs) => {
                    const node = getNodeByID(tree, inputs.outputID) as OutputNode
                    return {
                        text: inputs.outputLabel,
                        value: node?.value,
                        unit: node?.unit,
                        color: node?.color,
                    }
                })
            } as VisualResult
        })
    }
)