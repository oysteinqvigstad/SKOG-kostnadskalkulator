import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MainContainer} from "./containers/MainContainer";
import {DevelopmentHeaderWarning} from "./components/DevelopmentHeaderWarning";
import {InputPage} from "./pages/InputPage";
import {ResultPage} from "./pages/ResultPage";
import {NavBar} from "./containers/NavBar";
import {useAppDispatch, useAppSelector} from "./state/hooks";
import {setField} from "./state/formSlice";
import {staticFieldDescriptions} from "./constants/staticFieldData";

function App() {

    const pageNumber = useAppSelector((state) => state.form.page)
    const dispatch = useAppDispatch()

    const pages = [
        <InputPage />,
        <ResultPage />
    ]
    const [loadedDefaults, setLoadedDefaults] = useState(false)

    useEffect(() => {
        if (!loadedDefaults) {
            staticFieldDescriptions.forEach((fieldData) => {
                if (fieldData.default) {
                    dispatch(setField({title: fieldData.title, value: fieldData.default}))
                }
            })
            setLoadedDefaults(true)
        }
    }, [dispatch, loadedDefaults]);

    return (
        <>
            <DevelopmentHeaderWarning />
            <NavBar />
            <MainContainer>
                {pages[pageNumber]}
            </MainContainer>
        </>
    )
}

export default App;
