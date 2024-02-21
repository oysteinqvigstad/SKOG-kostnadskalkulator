import { createEditor } from "./rete/editor";
import { useRete } from "rete-react-plugin";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {Col} from "react-bootstrap";




export default function App() {
  const [ref, functions] = useRete(createEditor);

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
              </Col>
          </Container>
          <div ref={ref} style={{height: "100vh", width: "100vw"}}></div>
      </div>
  );
}
