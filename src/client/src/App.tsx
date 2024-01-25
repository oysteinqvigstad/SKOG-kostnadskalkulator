import React from 'react';
import './App.css';
import {InputNumber} from "./components/InputNumber";
import 'bootstrap/dist/css/bootstrap.min.css';
import {FormContainer} from "./containers/FormContainer";
import {FieldType, inputFieldData} from "./constants/FieldData";
import {InputDropdown} from "./components/InputDropdown";
import {Button, Row} from "react-bootstrap";

function App() {
    return (
        <FormContainer>
            {inputFieldData.map((data) => {
                switch (data.type) {
                    case FieldType.NUMBERED_INPUT:
                        return <InputNumber fieldData={data} />
                    case FieldType.DROPDOWN_INPUT:
                        return <InputDropdown fieldData={data} />
                }
            })}
            <div className="d-grid gap-2">
                <Button>
                    Beregn
                </Button>
            </div>
        </FormContainer>
    )

    // <InputNumber title="avstand" unit="meter" min={0} max={9999}/>
    // <InputNumber title="høyde" unit="meter" min={0} max={9999}/>

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Her kommer kostnadskalkulator, etterhvert :)
  //       </p>
  //     </header>
  //   </div>
  // );
}

export default App;
