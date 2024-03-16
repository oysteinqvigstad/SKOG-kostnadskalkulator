import {createEditor} from "./rete/editor";
import {useRete} from "rete-react-plugin";
import Container from 'react-bootstrap/Container';
import {Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Provider} from "react-redux";
import {PagesWindow} from "./containers/pagesWindow";
import {store, StoreState} from "./state/store";
import {useAppDispatch, useAppSelector} from "./state/hooks";
import {setTreeState, updateTree} from "./state/slices/treeState";
import {PageEditor} from "./containers/pageEditor";
import {NavBar} from "./containers/navbar/NavBar";
import {setPagesState} from "./state/slices/pages";
import {setFormulaInfoState} from "./state/slices/formulaInfo";
import {selectRootNode} from "./state/selectors";



export default function App() {
    const [change, setChange] = useState(0);
    const [ref, functions] = useRete(createEditor);
    const rootNode = useAppSelector(selectRootNode)
    const dispatch = useAppDispatch();

    function increment() {
        setChange(a => a + 1);
    }

    useEffect(()=> {
        document.addEventListener('keydown', (e) => {
            if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                functions?.save();
                if(localStorage) {
                    localStorage.setItem('store', JSON.stringify(store.getState()));
                }
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
            if (e.key === 'o' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                functions?.load();
                if(localStorage) {
                    const reduxState = localStorage.getItem('store');
                    if(reduxState) {
                        const state = JSON.parse(reduxState) as StoreState;
                        dispatch(setTreeState(state.treeState));
                        dispatch(setPagesState(state.pages));
                        dispatch(setFormulaInfoState(state.formulaInfo));
                    }
                }
            }
        });

        functions?.registerCallBack('store', ()=>{
            increment();
        })

    }, [functions] );

    useEffect(()=>{
        console.log(change);
        console.log(functions?.getCurrentTree())
        const reteNodes = functions?.getCurrentTree();
        if(reteNodes && rootNode) {
            dispatch(updateTree([rootNode, ...reteNodes]));
        }
    }, [change, functions])



  return (
      <Provider store={store}>
          <div className="App">
              <NavBar functions={functions} />
              <Container style={{maxWidth: '100%'}}>
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
                                  </Tabs>
                              </Card.Body>
                          </Card>
                      </Col>
                  </Row>
              </Container>

          </div>
      </Provider>
  );
}

