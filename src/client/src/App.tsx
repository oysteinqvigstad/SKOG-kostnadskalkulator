import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MainContainer} from "./containers/MainContainer";
import {inputFieldData} from "./constants/FieldData";
import {Button} from "react-bootstrap";
import {DevelopmentHeaderWarning} from "./components/DevelopmentHeaderWarning";
import {InputField} from "./containers/InputField";

function App() {

    return (
        <>
        <DevelopmentHeaderWarning/>
        <MainContainer>
            {inputFieldData.map((data) => <InputField fieldData={data} />)}
            <div className="d-grid gap-2">
                <Button>Beregn</Button>
            </div>
        </MainContainer>
        </>
    )
}

export default App;
