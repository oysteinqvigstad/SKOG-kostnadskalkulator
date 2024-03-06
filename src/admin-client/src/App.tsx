import { createEditor } from "./rete/editor";
import { useRete } from "rete-react-plugin";
import Container from 'react-bootstrap/Container';
import {Card, Col, Form, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";
import {useEffect} from "react";




export default function App() {
  const [ref, functions] = useRete(createEditor);

  useEffect(()=> {
    document.addEventListener('keydown', (e) => {
        if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            functions?.save();
        }
        if (e.key === 'Delete') {
            e.preventDefault();
            console.log("Delete");
            functions?.deleteSelected();
        }
        if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            functions?.viewControllers.resetView();
        }
        if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            console.log("focus")
            functions?.viewControllers.focusSelectedNode();
        }
    });
  },
     [functions] );

  return (
      <div className="App">

          <Container style={{maxWidth: '100%'}}>
              <Row>
                  <Col>
                      <Navbar className="bg-body-tertiary">
                          <Navbar.Brand>
                                Rete
                          </Navbar.Brand>
                          <Nav className="me-auto">
                              <NavDropdown title={"File"} id={"file-dropdown"}>
                                  <NavDropdown.Item onClick={() => {
                                      functions?.save()
                                  }}>Save</NavDropdown.Item>
                                  <NavDropdown.Item onClick={() => {
                                      functions?.load()
                                  }}>Load</NavDropdown.Item>
                                  <NavDropdown.Item onClick={() => {
                                      functions?.clear()
                                  }}>Clear</NavDropdown.Item>
                              </NavDropdown>
                              <NavDropdown title={"View"} id={"view-dropdown"}>
                                  <NavDropdown.Item onClick={() => {
                                      functions?.viewControllers.resetView();
                                  }}>Reset</NavDropdown.Item>
                              </NavDropdown>
                              <NavDropdown title={"Test"} id={"file-dropdown"}>
                                  <NavDropdown.Item onClick={() => {
                                      functions?.testJSON()
                                  }}>Test JSON</NavDropdown.Item>
                              </NavDropdown>
                          </Nav>
                      </Navbar>
                  </Col>
              </Row>
              <Row>
                  <Col style={{padding: 0}}>
                      <div ref={ref} style={{height: "100vh", width: "80vw"}}></div>
                  </Col>
                  <Col style={{ padding: 0}}>
                      <Card style={{ height: '100%'}} className="mb-3">
                          <Card.Title>
                                Properties
                          </Card.Title>
                          <Card.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Node name</Form.Label>
                                        <Form.Control type="text" placeholder="Node name" />
                                    </Form.Group>
                                </Form>
                          </Card.Body>
                      </Card>
                  </Col>
              </Row>
          </Container>

      </div>
  );
}
