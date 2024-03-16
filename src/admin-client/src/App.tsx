import {createEditor} from "./rete/editor";
import {useRete} from "rete-react-plugin";
import Container from 'react-bootstrap/Container';
import {Col, Row} from "react-bootstrap";
import {useCallback, useEffect, useRef} from "react";
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



export default function App() {
    const [reteRef, functions] = useRete(createEditor);
    const rootNode = useAppSelector(selectRootNode)
    const dispatch = useAppDispatch();

    // keeping a reference to the root node is necessary for breaking the dependency cycle
    // between the rete editor and the redux store, such that the returned rootNode does not
    // trigger updateTreeState()
    const refRootNode = useRef(rootNode)
    // keep the refence up to date
    useEffect(() => {
        refRootNode.current = rootNode;
    }, [rootNode]);


    // callback for updating the tree state in the redux store from rete
    const updateTreeState = useCallback(() => {
        const reteNodes = functions?.getCurrentTree();
        if(reteNodes && refRootNode.current) {
            dispatch(updateTree([refRootNode.current, ...reteNodes]));
        }
    }, [functions, dispatch, refRootNode])


    useEffect(()=> {
        // ensures that the tree state is updated when certain changes occur
        functions?.registerCallBack('store', updateTreeState)

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                functions?.save();
                if (localStorage) {
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

    }, [functions, dispatch, updateTreeState])




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

