import React from "react";
import {Col, Row, Stack} from "react-bootstrap";
import {ResultParameters} from "../components/result/ResultParameters";
import {useAppSelector} from "../state/hooks";
import {selectDisplayNodes, selectTreeState} from "../state/treeSelectors";
import {
    DisplayBarNode,
    DisplayListNode,
    DisplayNode,
    DisplayPieNode,
    GraphDisplayNode,
    NodeType
} from "@skogkalk/common/dist/src/parseTree";
import {ResultBar} from "@skogkalk/common/dist/src/visual/ResultBar";
import {ResultPie} from "@skogkalk/common/dist/src/visual/ResultPie";
import {ResultList} from "@skogkalk/common/dist/src/visual/ResultList";
import {ResultGraph} from "@skogkalk/common/dist/src/visual/ResultGraph";


/**
 * Render the panel for parameters and the results derived from the display nodes
 */
export function ResultContent() {
    const displayNodes = useAppSelector(selectDisplayNodes)

    return (
            <Stack className={"mb-3"} gap={3}>
                <Row className={"row-gap-4"}>
                    <Col md={{span: 12, order: -1}} lg={{span: 8, order: -1}} className={"d-none d-md-block"}>
                        <ResultParameters />
                    </Col>
                    {displayNodes
                        ?.filter(node => node.type !== NodeType.PreviewDisplay)
                        .map((node) => <ResultComponent displayNode={node} />)
                    }
                </Row>
            </Stack>
    )
}


/**
 * Render the result component based on the display node type
 */
function ResultComponent({displayNode}: {displayNode: DisplayNode}) {
    const treeState = useAppSelector(selectTreeState)

    /**
     * Determine the component to render based on the display node type
     */
    const component = (node: DisplayNode) => {
        switch (node.type) {
            case NodeType.BarDisplay:
                return <ResultBar displayData={node as DisplayBarNode} treeState={treeState} />
            case NodeType.Display:
                return <ResultPie displayData={node as DisplayPieNode} treeState={treeState} />
            case NodeType.ListDisplay:
                return <ResultList displayData={node as DisplayListNode} treeState={treeState} />
            case NodeType.GraphDisplay:
                return <ResultGraph displayData={node as GraphDisplayNode} treeState={treeState} />
            default:
                return <></>
        }
    }

    const {xs, md, lg} = displayNode.arrangement

    return (
        <Col xs={xs} md={md} lg={lg}>
            {component(displayNode)}
        </Col>
    )
}