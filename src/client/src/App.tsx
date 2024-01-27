import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MainContainer} from "./containers/MainContainer";
import {DevelopmentHeaderWarning} from "./components/DevelopmentHeaderWarning";
import {InputPage} from "./pages/InputPage";
import {ResultPage} from "./pages/ResultPage";
import {NavBar} from "./containers/NavBar";

function App() {
    const [pageNumber, setPageNumber] = useState(0)
    const updatePageNumber = (e: React.MouseEvent, n: number) => {
        e.preventDefault()
        setPageNumber(n)
    }

    const pages = [
        <InputPage setPageNumber={updatePageNumber}/>,
        <ResultPage setPageNumber={updatePageNumber} />
    ]

    return (
        <>
            <NavBar />
            <DevelopmentHeaderWarning />
            <MainContainer>
                {pages[pageNumber]}
            </MainContainer>
        </>
    )
}

export default App;
