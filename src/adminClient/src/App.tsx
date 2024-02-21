import { createEditor } from "./rete/editor";
import { useRete } from "rete-react-plugin";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {Col, Modal, Overlay, Row, Spinner} from "react-bootstrap";
import React, {useEffect, useRef} from "react";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;


function LoadingModal(props:{loading: boolean, load: ()=>void}) {
    useEffect( ()=> {
        if(props.loading) {
            console.log("Loading");
            props.load();
        }
    },
        [props.loading]
    )

    return <>
        <Modal show={props.loading}>
            <div>
                <Spinner></Spinner>
            </div>
            <Modal.Body>
                Loading
                {/*<Spinner></Spinner>*/}
            </Modal.Body>
        </Modal>
    </>
}


export default function App() {
  const [ref, functions] = useRete(createEditor);
  const [loading, setLoading] = React.useState(false);
  const target = useRef(null);

  return (
      <div className="App">
          <LoadingModal loading={loading} load={
              ()=>{
                  functions?.load(()=>{}, ()=>{setLoading(false)});
              }
          }></LoadingModal>

          <Container>
              <Col>
                  <Button size="lg" onClick={() => {
                      functions?.save()
                  }}>Save</Button>
                  <Button size="lg" onClick={() => {
                      setLoading(true);
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
