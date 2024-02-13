import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MainContainer} from "./containers/MainContainer";
import {DevelopmentHeaderWarning} from "./components/DevelopmentHeaderWarning";
import {NavBar} from "./containers/NavBar";
import {useAppDispatch} from "./state/hooks";
import {setField} from "./state/formSlice";
import {staticFieldDescriptions} from "./data/staticFieldDescriptions";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {FormPage} from "./pages/FormPage";
import {InformationalScientificSourcesPage} from "./pages/InformationalScientificSourcesPage";
import {InformationalDefaultValuesPage} from "./pages/InformationalDefaultValuesPage";
import {InformationalApiPage} from "./pages/InformationalApiPage";
import {FeedbackPage} from "./pages/FeedbackPage";
import {ResultParser} from "./pages/ResultParser";
import {FrontPage} from "./pages/FrontPage";
import {setCalculatorData} from "./state/calculatorSlice";
import {staticCalculatorData} from "./data/staticCalculatorData";

function App() {

    const dispatch = useAppDispatch()

    // Keep track of whether the default values have been loaded
    const [haveDefaultsBeenLoaded, setHaveDefaultsBeenLoaded] = useState(false)

    /**
     * Load the default values for the fields
     */
    useEffect(() => {
        if (!haveDefaultsBeenLoaded) {
            // for each field, if it has a default value, set the field to the default value
            staticFieldDescriptions.forEach((fieldData) => {
                if (fieldData.default) {
                    dispatch(setField({title: fieldData.title, value: fieldData.default}))
                }
            })
            // sets default values for calculator data
            dispatch(setCalculatorData(staticCalculatorData[0]))
            setHaveDefaultsBeenLoaded(true)
        }
    }, [dispatch, haveDefaultsBeenLoaded]);


    return (
    <Router>
        <DevelopmentHeaderWarning />
        <NavBar />
        <MainContainer>
            <Routes>
                <Route path="/" element={<FrontPage />}/>
                <Route path="/kalkulator" element={<FormPage />} />
                <Route path="/forskningsgrunnlag" element={<InformationalScientificSourcesPage />} />
                <Route path="/tallgrunnlag" element={<InformationalDefaultValuesPage />} />
                <Route path="/api" element={<InformationalApiPage />} />
                <Route path="/tilbakemelding" element={<FeedbackPage />} />
                <Route path="/resultat" element={<ResultParser />} />
            </Routes>
        </MainContainer>
    </Router>
    )
}

export default App;
