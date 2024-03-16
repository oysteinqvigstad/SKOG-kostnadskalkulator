import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DevelopmentHeaderWarning} from "./components/DevelopmentHeaderWarning";
import {useAppDispatch} from "./state/hooks";
import {setField} from "./state/formSlice";
import {staticFieldDescriptions} from "./data/staticFieldDescriptions";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {InformationalScientificSourcesPage} from "./pages/InformationalScientificSourcesPage";
import {InformationalDefaultValuesPage} from "./pages/InformationalDefaultValuesPage";
import {InformationalApiPage} from "./pages/InformationalApiPage";
import {FeedbackPage} from "./pages/FeedbackPage";
import {ResultParser} from "./pages/ResultParser";
import {setCalculatorData} from "./state/calculatorSlice";
import {staticCalculatorData} from "./data/staticCalculatorData";
import {LandingPage} from "./pages/LandingPage";
import {initiateTree} from "./state/treeSlice";
import {testTree, treeStateFromData} from "@skogkalk/common/dist/src/parseTree";
import {HomePage} from "./pages/HomePage";
import {NavBar} from "./containers/NavBar";
// import {useAddCalculatorMutation, useGetCalculatorQuery} from "./state/store";

function App() {

    const dispatch = useAppDispatch()
    // const [addCalculator, addCalculatorStatus] = useAddCalculatorMutation()
    // const {data, error, isLoading} = useGetCalculatorQuery({name: 'testformel'})


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

            // read tree data
            dispatch(initiateTree({tree: treeStateFromData(testTree)}))

            setHaveDefaultsBeenLoaded(true)
        }

        // if (data) {
        //     dispatch(initiateTree({tree: data}))
        // }
        // addCalculator(treeStateFromData(testTree))
    }, [dispatch, haveDefaultsBeenLoaded]);


    return (
    <Router>
            <DevelopmentHeaderWarning />
            <Routes>
                <Route element={<NavBar />}>
                    <Route path={"/"} element={<HomePage />}/>
                    <Route path={"/kalkulator/:name/:version"} element={<LandingPage />}/>

                    <Route path="/forskningsgrunnlag" element={<InformationalScientificSourcesPage />} />
                    <Route path="/tallgrunnlag" element={<InformationalDefaultValuesPage />} />
                    <Route path="/apiinfo" element={<InformationalApiPage />} />
                    <Route path="/tilbakemelding" element={<FeedbackPage />} />
                    <Route path="/resultat" element={<ResultParser />} />
                </Route>
            </Routes>
    </Router>
    )
}

export default App;
