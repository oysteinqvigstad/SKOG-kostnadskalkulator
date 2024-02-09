import {Button, ButtonGroup, Col, Row} from "react-bootstrap";
import React, {ReactNode} from "react";
import {useAppSelector} from "../state/hooks";
import {MdBarChart, MdForest, MdLandscape, MdPrecisionManufacturing} from "react-icons/md";
import {MdArrowBack, MdArrowForward} from "react-icons/md";

/**
 * The pagination bar for the input and result pages
 * @param props - onClick: (pageNumber: number) => void - the function to call when a page is clicked
 */
export function PaginationBar(props: { onClick: (pageNumber: number) => void }) {
    // Get the current page number from the store
    const page = useAppSelector((state) => state.form.page)

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
    const pageButton = [...Array(4)].map((_, n) =>
        <Button
            key={n}
            disabled={page === n}
            onClick={() => props.onClick(n)}>
            {iconSelector(n, icons)}
        </Button>
    )

    return( <>
            <Row>
                <Col className={"d-flex justify-content-center"}>
                    <ButtonGroup size={"lg"}>
                        <Button disabled={page === 0} onClick={() =>
                            props.onClick(page - 1)}><MdArrowBack/></Button>
                        {pageButton}
                        <Button disabled={page === 3} onClick={() =>
                            props.onClick(page + 1)}><MdArrowForward/></Button>
                    </ButtonGroup>
                </Col>
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