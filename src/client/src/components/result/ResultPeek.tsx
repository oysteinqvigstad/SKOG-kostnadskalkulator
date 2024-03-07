import {useAppSelector} from "../../state/hooks";
import React from "react";
import {ResultRowBoxes} from "./ResultRowBoxes";
import {selectResults} from "../../state/treeSelectors";
import {VisualResult} from "../../types/ResultListItem";

export function ResultPeek() {
    const results = useAppSelector(selectResults)
    const combined: VisualResult = {
        name: "",
        items: results?.flatMap((result) => result.items) ?? []
    }
    return (
        <>
            {combined && <ResultRowBoxes result={combined} />}
        </>
    )
}