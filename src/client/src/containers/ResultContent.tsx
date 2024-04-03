import React from "react";
import {Col, Row, Stack} from "react-bootstrap";
import {ResultParameters} from "../components/result/ResultParameters";
import {ResultCard} from "../components/result/ResultCard";
import {FcBullish, FcFinePrint, FcIdea, FcSalesPerformance} from "react-icons/fc";



/**
 * Result page for the harvester and load carrier
 */
export function ResultContent() {




    // TODO: remove after testing
    // let pieData: DisplayPieNode | undefined
    // let treeCopy: TreeState | undefined
    // if (treeState?.displayNodes[0]) {
    //     treeCopy = treeStateFromData(treeState.subTrees)
    //     pieData = {...treeState.displayNodes[0], unit: "", pieType: "pie"}
    //
    // }


    return (
            <Stack className={"mb-3"} gap={3}>
                <Row className={"row-gap-4"}>
                    <Col md={{span: 12, order: 1}} lg={{span: 8, order: 1}} className={"d-none d-md-block"}>
                        <ResultParameters />
                    </Col>
                    <Col xs={{span: 12, order: 4}} md={{span: 6, order: 4}} lg={{span: 4, order: 2}}>
                        <ResultCard
                            icon={<FcIdea/>}
                            title={"Innsikt i kostnadsdrivere"}
                            children={<></>}
                        />
                    </Col>
                    <Col xs={{span: 12, order: 1}} md={{span: 6, order: 2}} lg={{span: 4, order: 3}}>
                         <ResultCard
                             icon={<FcBullish />}
                             title={"Produktivitet"}
                             children={<></>}
                         />
                    </Col>
                    <Col xs={{span: 12, order: 2}} md={{span: 6, order: 3}} lg={{span: 4, order: 4}}>
                        <ResultCard
                            icon={<FcSalesPerformance />}
                            title={"Kostnad"}
                            children={<></>}
                        />
                    </Col>
                    <Col xs={{span: 12, order: 3}} md={{span: 6, order: 5}} lg={{span: 4, order: 5}}>
                        <ResultCard
                            icon={<FcFinePrint/>}
                            title={"Kostnadsoverslag"}
                            children={<></>}
                        />
                    </Col>
                </Row>
            </Stack>
    )
}