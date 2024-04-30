import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {VisualResult} from "../types/ResultListItem";
import {getNodeByID, OutputNode} from "@skogkalk/common/dist/src/parseTree";

export const selectTreeState = createSelector(
    (state: RootState) => state.tree.tree,
    (tree) => tree
)


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

export const selectInvalidFieldValuesByPage =(titles: string[]) => createSelector(
    [(state: RootState) => state.tree.tree, (state: RootState) => state.tree.inputFieldValues],
    (tree, inputFields) => {
        const nodesByPage = titles.map((title) => tree?.inputs.filter((node) => node.pageName === title) ?? [])
        return nodesByPage.map((nodes) => nodes.filter((node) => inputFields[node.id] === "").length)
    }
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
    (tree) => tree?.displayNodes.map((node) => {
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
)

export const selectURLQueries = (seperator: string) => createSelector(
    (state: RootState) => state.tree.tree,
    (tree) => {
        const pageNames = new Set(tree?.inputs.map((input) => input.pageName))
        return Array
            .from(pageNames)
            .map((pageName) => {
                const inputs = tree?.inputs.filter((input) => input.pageName === pageName)!
                const size = Math.max(...inputs.map((input) => input.ordering)) + 1
                const values = new Array<string>(size)
                inputs.forEach((input) => {
                    values[input.ordering] = input.value.toString()
                })
                return `${encodeURI(pageName)}=${values.join(seperator)}`
            }).join('&')
    }
)