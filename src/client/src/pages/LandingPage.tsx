import {ResultContent} from "../containers/ResultContent";
import Sheet from "react-modal-sheet";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setPage, setValidated} from "../state/formSlice";
import {InfoContent} from "../containers/InfoContent";
import {InputContent} from "../containers/InputContent";
import {MdForest, MdLandscape, MdPrecisionManufacturing} from "react-icons/md";
import { IconContext } from "react-icons";

export function LandingPage() {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    const updateMedia = () => {
        setIsDesktop(window.innerWidth >= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    })



    return (
        <>
            {isDesktop ? (
                <DesktopView />
            ) : (
                <MobileView />
            )}
        </>
    )
}

function MobileView() {
    const [isOpen, setIsOpen] = useState(false)

    const onTapClose = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(false)
    }

        return (
        <>
            <FormPage />
            <Button
                className={"fixed-bottom"}
                onClick={() => setIsOpen(true)}
            >
                {"Vis resultat..."}
            </Button>
            <Sheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header
                        onTap={onTapClose}
                    />
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <ResultContent />
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </>
    )
}

function DesktopView() {
    return (
        <ResultContent />
    )
}


type MenuItem = {
    title: string,
    icon: ReactNode,
    pageNumber: number
}

function FormPage() {
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



    const menuItems: MenuItem[] = [
        {
            title: "Bestand",
            icon: <MdForest />,
            pageNumber: 1,
        },
        {
            title: "Kjøreforhold",
            icon: <MdLandscape />,
            pageNumber: 2,
        },
        {
            title: "Maskin",
            icon: <MdPrecisionManufacturing />,
            pageNumber: 3,
        }
    ]



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
        <Col className={"px-3 mt-2 mx-auto"} style={{maxWidth: '1200px'}}>
            <PaginationBar items={menuItems} onClick={switchPage} />
            {pageSwitcher(pageNumber)}
        </Col>
    )
}

/**
 * The pagination bar for the input and result pages
 * @param props - onClick: (pageNumber: number) => void - the function to call when a page is clicked
 */
function PaginationBar(props: { items: MenuItem[], onClick: (pageNumber: number) => void }) {
    // Get the current page number from the store
    const page = useAppSelector((state) => state.form.page)

    /**
     * Creates the individual page buttons
     */
    const pageButtons = props.items.map((item) =>
        <IconContext.Provider value={{size: "1.5rem"}}>
            <Button
                className={"page-button"}
                key={item.pageNumber}
                disabled={page === item.pageNumber}
                onClick={() => props.onClick(item.pageNumber)}>
                {item.icon}
                {item.title}
            </Button>
            {/**
             * Adds a spacer after every button except the last one
             */}
            {item.pageNumber !== (props.items.length) && <div className={"page-bar-spacer"}/>}
        </IconContext.Provider>
    )

    return(
        <>
            <Row className={"d-flex flex-nowrap overflow-x-auto mx-auto sticky-top page-bar mb-3"}>
                {pageButtons}
            </Row>
        </>
    )
}

