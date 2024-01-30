import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MainContent} from "./containers/MainContent";
import {DevelopmentHeaderWarning} from "./components/DevelopmentHeaderWarning";
import {NavBar} from "./containers/NavBar";
import {useAppDispatch} from "./state/hooks";
import {setField} from "./state/formSlice";
import {staticFieldDescriptions} from "./constants/staticFieldData";

function App() {

    // ensures that default form values are being loaded into Redux
    const dispatch = useAppDispatch()
    const [haveDefaultsBeenLoaded, setHaveDefaultsBeenLoaded] = useState(false)
    useEffect(() => {
        if (!haveDefaultsBeenLoaded) {
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
