import {Card, Col, Row, Stack, Tab, Tabs} from "react-bootstrap";
import {
    MdGridOn,
    MdOutlineViewAgenda,
    MdOutlineWindow,
} from "react-icons/md";
import {selectTreeState} from "../../state/store";
import {useAppSelector} from "../../state/hooks";
import {DisplayNode, NodeType} from "@skogkalk/common/dist/src/parseTree";
import React from "react";
import {DisplayArrangement} from "@skogkalk/common/dist/src/parseTree/nodes/displayNode";

export function DisplayArrangementSettings() {
    return (
        <>
            <p>
                {"Display tiles can be arranged by order and size for different screen sizes. Select the tab that corresponds with how many display tiles can fit in a given window."}
            </p>
            <Tabs>
                <Tab eventKey="Mobile" title={<MdOutlineViewAgenda size={25} />}>
                    <DisplayPreviewContainer widthMultiplier={12} />
                </Tab>

                <Tab eventKey="Tablet" title={<MdOutlineWindow size={25} />}>
                    <DisplayPreviewContainer widthMultiplier={6} />
                </Tab>

                <Tab eventKey="Desktop" title={<MdGridOn size={25} />}>
                    <DisplayPreviewContainer widthMultiplier={4} />
                </Tab>
            </Tabs>
        </>
    )
}


function DisplayPreviewContainer(props: {
    widthMultiplier: number
}) {
    const {tree} = useAppSelector(selectTreeState);

    const getWidth = (widthMultiplier: number) => {
        switch (widthMultiplier) {
            case 12: return "33%"
            case 6: return "66%"
            case 4: return "100%"
        }
    }

    return (
        <Stack className={"mb-3 mx-auto"} style={{width: getWidth(props.widthMultiplier)}} gap={3}>
            <Row className={"row-gap-2"}>
                {tree?.displayNodes
                    ?.filter(node => node.type !== NodeType.PreviewDisplay)
                    .map((node) => <DisplayPreviewTile node={node} widthMultiplier={props.widthMultiplier} />)
                }
            </Row>
        </Stack>
    )
}

function DisplayPreviewTile(props: {
    node: DisplayNode
    widthMultiplier: number
}) {

    const getArrangement = (widthMultiplier: number) => {
        switch (widthMultiplier) {
            case 12: return props.node.arrangement.xs
            case 6: return props.node.arrangement.md
            case 4: return props.node.arrangement.lg
        }
    }

    return (
        <Col className={"p-0"} xs={getArrangement(props.widthMultiplier)}>
            <Card>
                <div style={{fontSize: 12}}>
                    {props.node.type}
                </div>
                <div style={{fontSize: 14, fontWeight: 600}}>
                    {props.node.name}
                </div>
            </Card>
        </Col>
    )
}
