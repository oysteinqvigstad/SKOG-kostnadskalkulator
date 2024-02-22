import { createEditor } from "./rete/editor";
import { useRete } from "rete-react-plugin";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {Col} from "react-bootstrap";
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

          <Container>
              <Col>
                  <Button size="lg" onClick={() => {
                      functions?.save()
                  }}>Save</Button>
                  <Button size="lg" onClick={() => {
                        functions?.load()
                  }}>Load</Button>
                  <Button size="lg" onClick={() => {
                      functions?.clear()
                  }}>Clear</Button>
                  <Button size="lg" onClick={()=>{functions?.testJSON()}}>Test JSON</Button>
                  <Button size="lg" onClick={()=>{functions?.viewControllers.resetView()}}>Reset View</Button>
              </Col>
          </Container>
          <div ref={ref} style={{height: "100vh", width: "100vw"}}></div>
      </div>
  );
}
