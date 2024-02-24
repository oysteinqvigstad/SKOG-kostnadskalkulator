// Get the current page number from the store
import {useAppDispatch, useAppSelector} from "../state/hooks";
import React, {useRef} from "react";
import {setPage, setValidated} from "../state/formSlice";
import {Col} from "react-bootstrap";
import {ResultContent} from "../containers/ResultContent";
import {InputContent} from "../containers/InputContent";
import {PaginationBar} from "../components/PaginationBar";
import {InfoContent} from "../containers/InfoContent";


export function FormPage() {
    const pageNumber = useAppSelector((state) => state.form.page)
    // Get the dispatch function from the store
    const dispatch = useAppDispatch()
    // Create a reference to the form
    const formRef = useRef<HTMLFormElement>(null)
    // Page number for result page
    const RESULTPAGE = 4
    // Page number for information page
    const INFOPAGE = 0
    /**
     * switchPage switches the page to the new page number
     * @param newPageNumber - the new page number
     */
    const switchPage = (newPageNumber: number) => {
        // if the page is the result page, check if the form is valid
        if (newPageNumber === RESULTPAGE && formRef.current && !formRef.current.checkValidity()) {
            dispatch(setValidated(true))
        } else {
            // if the current page is the result page, set validated to false when returning to input page
            if (pageNumber === RESULTPAGE) {
                dispatch(setValidated(false))
            }
            // set the new page number
            dispatch(setPage(newPageNumber))
        }
    }

    const pageSwitcher = (pageNumber: number) => {
        switch (pageNumber) {
            case INFOPAGE:
                return <InfoContent />
            case RESULTPAGE:
                return <ResultContent />
            default :
                return <InputContent formRef={formRef} />
        }
    }

    return (
        <Col className={"px-3 mt-2 mx-auto"} style={{maxWidth: '400px'}}>
            <PaginationBar onClick={switchPage} />
            {pageDescription[pageNumber]}
            {pageSwitcher(pageNumber)}
        </Col>
    )
}

// TODO: Combine with Icon from PaginationBar.tsx?
const pageDescription: string[] = [
    "Informasjon",
    "Bestand",
    "Kjøreforhold",
    "Maskin",
    "Resultat"
]
