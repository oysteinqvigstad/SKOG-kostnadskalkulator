import {createEditor} from "./rete/editor";
import {useRete} from "rete-react-plugin";
import Container from 'react-bootstrap/Container';
import {Col, Row} from "react-bootstrap";
import {useEffect} from "react";
import {Provider} from "react-redux";
import {store, StoreState} from "./state/store";
import {useAppDispatch, useAppSelector} from "./state/hooks";
import {setTreeState, updateTree} from "./state/slices/treeState";
import {NavBar} from "./containers/navbar/NavBar";
import {setPagesState} from "./state/slices/pages";
import {setFormulaInfoState} from "./state/slices/formulaInfo";
import {selectRootNode} from "./state/selectors";
import {SidePanel} from "./containers/panels/SidePanel";
import {RetePanel} from "./containers/panels/RetePanel";
import {ParseNode} from "@skogkalk/common/dist/src/parseTree";



export default function App() {
    const [reteRef, functions] = useRete(createEditor);
    const rootNode = useAppSelector(selectRootNode)
    const dispatch = useAppDispatch();

    useEffect(() => {
        // ensures that the tree state is updated when certain changes occur
        functions?.registerCallBack('store', (nodes?: ParseNode[]) => {
            if(nodes && rootNode) {
                dispatch(updateTree([rootNode, ...nodes]));
            }
        })
    }, [functions, dispatch, rootNode]);


    useEffect(()=> {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                functions?.save();
                if (localStorage) {
                    localStorage.setItem('store', JSON.stringify(store.getState()));
                }
            }
            if (e.key === 'Delete') {
                functions?.deleteSelected();
            }
            if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
                functions?.viewControllers.resetView();
            }
            if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
                functions?.viewControllers.focusSelectedNode();
            }
            if (e.key === 'o' && (e.ctrlKey || e.metaKey)) {
                functions?.load();
                if (localStorage) {
                    const reduxState = localStorage.getItem('store');
                    if (reduxState) {
                        const state = JSON.parse(reduxState) as StoreState;
                        dispatch(setTreeState(state.treeState));
                        dispatch(setPagesState(state.pages));
                        dispatch(setFormulaInfoState(state.formulaInfo));
                    }
                }
            }
        }
        // register the event listener
        document.addEventListener('keydown', handleKeyDown);
        // return a cleanup function that removes the event listener when component is rerendered,
        // otherwise it can cause multiple event listener registrations and memory leaks
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }

    // }, [functions, dispatch, updateTreeState])
}, [functions, dispatch, rootNode])




  return (
      <Provider store={store}>
          <div className="App">
              <NavBar functions={functions} />
              <Container style={{maxWidth: '100%'}}>
                  <Row>
                      <Col style={{padding: 0}}>
                          <RetePanel reteRef={reteRef} />
                      </Col>
                      <Col style={{ padding: 0}}>
                          <SidePanel />
                      </Col>
                  </Row>
              </Container>
          </div>
      </Provider>
  );
}

