import React from "react";
import {Col, Row, Tab, Tabs} from "react-bootstrap";
import {staticFieldDescriptions} from "../data/staticFieldDescriptions";
import {InputField} from "../containers/InputField";

export function ParametersWithTabs() {

    const menuItems: string[] = [
        "Bestand",
        "Kjøreforhold",
        "Maskin",
        "Tillegg"
    ]

    const [key, setKey] = React.useState(menuItems[0]);




    const tabs = menuItems.map((title, index) => {
        return (
            <Tab eventKey={title} title={title}>
                <Row>
                    {staticFieldDescriptions
                        .filter((data) => data.page === index+1)
                        .map((data) => (
                            <Col md={12} lg={6}>
                                <InputField fieldData={data} />
                            </Col>
                        ))
                    }
                </Row>
            </Tab>
        )
    })




    return (
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k ?? "")}
                className={"mb-3"}
            >
                {tabs}
            </Tabs>
    )
}