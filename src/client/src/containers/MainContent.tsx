import {Col} from "react-bootstrap";
import React, {useRef} from "react";
import {ResultPage} from "../pages/ResultPage";
import {InputPage} from "../pages/InputPage";
import {PaginationBar} from "../components/PaginationBar";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setPage, setValidated} from "../state/formSlice";

/**
 * The main content of the application, containing the input and result pages
 */
export function MainContent() {
    // Get the current page number from the store
    const pageNumber = useAppSelector((state) => state.form.page)
    // Get the dispatch function from the store
    const dispatch = useAppDispatch()
    // Create a reference to the form
    const formRef = useRef<HTMLFormElement>(null)

    /**
     * switchPage switches the page to the new page number
     * @param newPageNumber - the new page number
     */
    const switchPage = (newPageNumber: number) => {
        // if the page is the result page, check if the form is valid
        if (newPageNumber === 3 && formRef.current && !formRef.current.checkValidity()) {
            dispatch(setValidated(true))
        } else {
            // if the current page is the result page, set validated to false when returning to input page
            if (pageNumber === 3) {
                dispatch(setValidated(false))
            }
            // set the new page number
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