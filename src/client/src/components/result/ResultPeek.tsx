import {useAppSelector} from "../../state/hooks";
import React from "react";
import {selectDisplayNodes, selectTreeState} from "../../state/treeSelectors";
import {DisplayPreviewNode, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {MdKeyboardDoubleArrowUp} from "react-icons/md";
import {ResultPreview} from "@skogkalk/common/dist/src/visual/ResultPreview";

export function ResultPeek() {
    const treeState = useAppSelector(selectTreeState)
    const preview = useAppSelector(selectDisplayNodes)
        ?.filter(node => node.type === NodeType.PreviewDisplay)

    return (
        <>
            <MdKeyboardDoubleArrowUp size={25} className={"mt-0 mb-2"} color={"lightgray"} />
            {preview?.map(node => <ResultPreview displayData={node as DisplayPreviewNode} treeState={treeState} />)}
        </>
    )
}