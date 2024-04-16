import {Card, Row, Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {PagesWindow} from "../pagesWindow";
import {PageEditor} from "../pageEditor";
import {UnitsWindow} from "../unitsWindow";

export function SidePanel() {
    return (
        <Card style={{height: '100%'}} className="mb-3">
            <Card.Title>
                Properties
            </Card.Title>
            <Card.Body>
                <Tabs>
                    <Tab eventKey="Pages" title="Pages">
                        <Container fluid={true} style={{height: "80vh", justifyContent: ""}}>
                            <Row style={{height: "50%"}}>
                                <PagesWindow/>
                            </Row>
                            <Row style={{height: "50%"}}>
                                <PageEditor/>
                            </Row>
                        </Container>
                    </Tab>
                    <Tab eventKey="Inputs" title="Inputs">
                        <div>
                            WIP
                        </div>
                    </Tab>
                    <Tab eventKey="Units" title="Units">
                        <Container fluid={true} style={{height: "80vh", justifyContent: ""}}>
                            <UnitsWindow/>
                        </Container>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    )
}