import {Col} from "react-bootstrap";
import React, {useRef} from "react";
import {ResultPage} from "../pages/ResultPage";
import {InputPage} from "../pages/InputPage";
import {PaginationBar} from "../components/PaginationBar";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setPage, setValidated} from "../state/formSlice";

export function MainContent() {

    const pageNumber = useAppSelector((state) => state.form.page)
    const dispatch = useAppDispatch()
    const formRef = useRef<HTMLFormElement>(null)

    const switchPage = (newPageNumber: number) => {
        // result page rendering intended but form is invalid
        if (newPageNumber === 3 && formRef.current && !formRef.current.checkValidity()) {
            dispatch(setValidated(true))
        } else {
            // remove validation flag
            if (pageNumber === 3) {
                dispatch(setValidated(false))
            }
            // set new page number
            dispatch(setPage(newPageNumber))
        }
    }


    return (
        <Col className={"p-3 mt-2 mx-auto"} style={{maxWidth: '400px'}}>
            {(pageNumber === 3) ? <ResultPage /> : <InputPage formRef={formRef} />}
            <PaginationBar onClick={switchPage} />
        </Col>
    )
}