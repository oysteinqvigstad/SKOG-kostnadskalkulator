import {useAppSelector} from "../../state/hooks";
import React from "react";
import {ResultRowBoxes} from "./ResultRowBoxes";
import {selectOutputNodes} from "../../state/treeSelectors";
import {ResultListItem} from "../../types/ResultListItem";

export function ResultPeek() {
    const nodes = useAppSelector(selectOutputNodes)
    const results = nodes?.map(({name, color, value, unit}) => (
        {
            text: name,
            color: color,
            value: value,
            unit: unit,
        } as ResultListItem
    ))

    console.log(results)

    return (
        <>
            {results && <ResultRowBoxes listItems={results}/>}
        </>
    )
}