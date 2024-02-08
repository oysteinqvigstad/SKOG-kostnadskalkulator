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
import {ResultPage} from "./pages/ResultPage";

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
            setHaveDefaultsBeenLoaded(true)
        }
    }, [dispatch, haveDefaultsBeenLoaded]);


    return (
    <Router>
        <DevelopmentHeaderWarning />
        <NavBar />
        <MainContainer>
            <Routes>
                <Route path="/" element={<FormPage />} />
                <Route path="/forskningsgrunnlag" element={<InformationalScientificSourcesPage />} />
                <Route path="/tallgrunnlag" element={<InformationalDefaultValuesPage />} />
                <Route path="/api" element={<InformationalApiPage />} />
                <Route path="/tilbakemelding" element={<FeedbackPage />} />
                <Route path="/resultat" element={<ResultPage />} />
            </Routes>
        </MainContainer>
    </Router>
    )
}

export default App;
