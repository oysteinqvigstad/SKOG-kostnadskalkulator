// Get the current page number from the store
import {useAppDispatch, useAppSelector} from "../state/hooks";
import React, {useRef} from "react";
import {setPage, setValidated} from "../state/formSlice";
import {Col} from "react-bootstrap";
import {ResultContent} from "../containers/ResultContent";
import {InputContent} from "../containers/InputContent";
import {PaginationBar} from "../components/PaginationBar";


export function FormPage() {
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
            {pageDescription[pageNumber]}
            {(pageNumber === 3) ? <ResultContent /> : <InputContent formRef={formRef} />}
            <PaginationBar onClick={switchPage} />
        </Col>
    )
}

// TODO: Combine with Icon from PaginationBar.tsx?
const pageDescription: string[] = [
    "Bestand",
    "Kjøreforhold",
    "Maskin",
    "Resultat"
]
