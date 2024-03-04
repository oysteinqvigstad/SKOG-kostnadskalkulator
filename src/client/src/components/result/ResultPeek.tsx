import {useAppSelector} from "../../state/hooks";
import React from "react";
import {ResultRowBoxes} from "./ResultRowBoxes";
import {selectResults} from "../../state/treeSelectors";

export function ResultPeek() {
    const results = useAppSelector(selectResults)
    return (
        <>
            {results && results.map((result) => <ResultRowBoxes result={result} />)}
        </>
    )
}