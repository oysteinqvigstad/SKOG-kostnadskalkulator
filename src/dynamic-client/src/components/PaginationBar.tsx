import {Button, Row} from "react-bootstrap";
import React, {ReactNode} from "react";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {MdBarChart, MdForest, MdLandscape, MdPrecisionManufacturing} from "react-icons/md";
import {IconContext} from "react-icons";
import {selectActivePage, selectPageTitles} from "../state/treeSelectors";
import {setActivePage} from "../state/treeSlice";

/**
 * The pagination bar for the input and result pages
 */
export function PaginationBar() {
    // Get the current page number from the store
    const activePage = useAppSelector(selectActivePage)

    const pageTitles = useAppSelector(selectPageTitles)

    const dispatch = useAppDispatch()

    // Icons in order corresponding to page number:
    const icons: ReactNode[] = [
        <MdForest/>,
        <MdLandscape/>,
        <MdPrecisionManufacturing/>,
        <MdBarChart/>
    ]


    /**
     * Creates the individual page buttons
     */
    const pageButtons = pageTitles.map((title, index) =>
        <IconContext.Provider value={{size: "1.5rem"}}>
            <Button
                className={"page-button"}
                style={{border: '1px solid gray'}}
                key={title}
                disabled={title === activePage}
                onClick={() => dispatch(setActivePage({title}))}
            >
                {icons[index] ?? <></>}
                {title}
            </Button>
            {/**
            * Adds a spacer after every button except the last one
            */}
            {index < (pageTitles.length-1) && <div className={"page-bar-spacer"} />}
        </IconContext.Provider>
    )

    return(
        <>
            <Row className={"d-flex flex-nowrap overflow-x-auto mx-auto sticky-top page-bar"}>
                {pageButtons}
            </Row>
        </>
    )
}