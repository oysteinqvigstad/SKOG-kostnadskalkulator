import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MainContent} from "./containers/MainContent";
import {DevelopmentHeaderWarning} from "./components/DevelopmentHeaderWarning";
import {NavBar} from "./containers/NavBar";
import {useAppDispatch} from "./state/hooks";
import {setField} from "./state/formSlice";
import {staticFieldDescriptions} from "./data/staticFieldDescriptions";

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
        <>
            <DevelopmentHeaderWarning />
            <NavBar />
            <MainContent />
        </>
    )
}

export default App;
