import {Button, Row} from "react-bootstrap";
import React, {ReactNode} from "react";
import {useAppSelector} from "../state/hooks";
import {MdBarChart, MdForest, MdInfoOutline, MdLandscape, MdPrecisionManufacturing} from "react-icons/md";
import {IconContext} from "react-icons";

/**
 * The pagination bar for the input and result pages
 * @param props - onClick: (pageNumber: number) => void - the function to call when a page is clicked
 */
export function PaginationBar(props: { onClick: (pageNumber: number) => void }) {
    // Get the current page number from the store
    const page = useAppSelector((state) => state.form.page)
    // The number of pages of input fields TODO: Change to dynamic reading from active calculator
    const numberOfPages = 5

    // Icons in order corresponding to page number:
    const icons: ReactNode[] = [
        <MdInfoOutline/>,
        <MdForest/>,
        <MdLandscape/>,
        <MdPrecisionManufacturing/>,
        <MdBarChart/>
    ]


    /**
     * Creates the individual page buttons
     */
    const pageButton = [...Array(numberOfPages)].map((_, n) =>
        <IconContext.Provider value={{size: "1.5rem"}}>
            <Button
                className={"page-button"}
                key={n}
                disabled={page === n}
                onClick={() => props.onClick(n)}>
                {iconSelector(n, icons)}
                {pageDescription[n]}
            </Button>
            {/**
            * Adds a spacer after every button except the last one
            */}
            {n === numberOfPages - 1 ? null : <div className={"page-bar-spacer"}/>}
        </IconContext.Provider>
    )

    return(
        <>
            <Row className={"d-flex flex-nowrap overflow-x-auto mx-auto sticky-top page-bar"} style={{maxWidth: '400px'}}>
                {/*<Button disabled={page === 0} onClick={() =>
                props.onClick(page - 1)}><MdArrowBack/></Button>*/}
                {pageButton}
                {/*<Button disabled={page === 3} onClick={() =>
                props.onClick(page + 1)}><MdArrowForward/></Button>*/}
            </Row>
        </>
    )
}


/**
 * Select appropriate icon based on page number.
 *
 * @param n - page number
 * @param icons - array of icons, must be mapped to page number
 */
const iconSelector = (n: number, icons: ReactNode[]) => {
    if ((icons.length === 0) || (n > icons.length)) throw new Error("Icon array out of range.")
    return icons[n];
}

const pageDescription: string[] = [
    "Informasjon",
    "Bestand",
    "Kjøreforhold",
    "Maskin",
    "Resultat"
]