import {createEditor} from "./rete/editor";
import {useRete} from "rete-react-plugin";
import Container from 'react-bootstrap/Container';
import {Card, Col, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Provider} from "react-redux";
import {PagesWindow} from "./containers/pagesWindow";
import {selectFormulaInfo, selectPages, selectTreeState, store} from "./state/store";
import {FormulaInfoContainer} from "./containers/formulaInfoContainer";
import {useAppDispatch, useAppSelector} from "./state/hooks";
import {updateTree} from "./state/slices/treeState";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";
import {RootNode} from "@skogkalk/common/dist/src/parseTree/nodes/rootNode";



export default function App() {
    const [change, setChange] = useState(0);
    const [ref, functions] = useRete(createEditor);
    const formulaInfo = useAppSelector(selectFormulaInfo);
    const pagesInfo = useAppSelector(selectPages)
    const dispatch = useAppDispatch();

    function increment() {
        setChange(a => a + 1);
    }

    useEffect(()=> {
    document.addEventListener('keydown', (e) => {
        if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            functions?.save();
        }
        if (e.key === 'Delete') {
            e.preventDefault();
            functions?.deleteSelected();
        }
        if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            functions?.viewControllers.resetView();
        }
        if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            functions?.viewControllers.focusSelectedNode();
        }
    });

    functions?.registerCallBack(()=>{
        increment();
    })

    },
     [functions] );

    useEffect(()=>{
        console.log(change);
        console.log(functions?.getCurrentTree())
        const data = functions?.getCurrentTree();
        if(data) {
            const version = formulaInfo.version;
            const root: RootNode =  {
                id: "0",
                type: NodeType.Root,
                value: 0,
                formulaName: formulaInfo.name,
                version: version.major * 1000000 + version.minor * 1000 + version.patch,
                pages: pagesInfo.map((page, index)=>{return {pageName: page.title, ordering: index }}),
                inputs:[]
            }
            data.push(root);
            dispatch(updateTree(data));
        }
    }, [change, functions])



  return (
      <Provider store={store}>
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
                                          try {
                                              const data = functions?.testJSON();
                                              if(data) {
                                                  const version = formulaInfo.version;
                                                  const root: RootNode =  {
                                                      id: "0",
                                                      type: NodeType.Root,
                                                      value: 0,
                                                      formulaName: formulaInfo.name,
                                                      version: version.major * 1000000 + version.minor * 1000 + version.patch,
                                                      pages: pagesInfo.map((page, index)=>{return {pageName: page.title, ordering: index }}),
                                                      inputs:[]
                                                  }
                                                  data.push(root);
                                                  dispatch(updateTree(data));
                                              }
                                          } catch(e) {
                                              console.log(e);
                                          }
                                      }}>Test JSON</NavDropdown.Item>
                                  </NavDropdown>
                                  <Navbar.Collapse className="justify-content-end">
                                      <Navbar.Text>
                                          <FormulaInfoContainer/>
                                      </Navbar.Text>

                                  </Navbar.Collapse>
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
                                  <PagesWindow/>
                              </Card.Body>
                          </Card>
                      </Col>
                  </Row>
              </Container>

          </div>
      </Provider>

  );
}
