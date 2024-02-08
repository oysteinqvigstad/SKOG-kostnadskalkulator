import {Col, Pagination, Row} from "react-bootstrap";
import React, {ReactNode} from "react";
import {useAppSelector} from "../state/hooks";
import {BarChartLine} from "react-bootstrap-icons";
import {BarChart, Forest, Landscape, PrecisionManufacturing} from "@mui/icons-material"
/**
 * The pagination bar for the input and result pages
 * @param props - onClick: (pageNumber: number) => void - the function to call when a page is clicked
 */
export function PaginationBar(props: {onClick: (pageNumber: number) => void}) {
    // Get the current page number from the store
    const page = useAppSelector((state) => state.form.page)

    const icons: ReactNode[]  = [
        <Forest />,
        <Landscape/>,
        <PrecisionManufacturing/>,
        <BarChart/>,

    ]

    /**
     * Creates the individual page numbers
     */
    //TODO: remove original code:

    /* Original code:
    const pagination = [...Array(4)].map((_, n) =>
        <Pagination.Item
            key={n}
            active={page === n}
            onClick={() => props.onClick(n)}>
            {(n === 3) ? <BarChartLine /> : n+1}
        </Pagination.Item>
    )
    */
    const pagination = [...Array(4)].map((_, n) =>
        <Pagination.Item
            key={n}
            active={page === n}
            onClick={() => props.onClick(n)}>
            {iconSelector(n, icons)}
        </Pagination.Item>
    )

    return (
        <Row>
            <Col className={"d-flex justify-content-center"}>
                <Pagination size="lg">
                    <Pagination.Prev disabled={page === 0} onClick={() => props.onClick(page-1)} />
                    {pagination}
                    <Pagination.Next disabled={page === 3} onClick={() => props.onClick(page+1)} />
                </Pagination>
            </Col>

        </Row>
    )
}


/**
 * Select appropriate icon based on page number.
 *
 * @param n - page number
 * @param icons - array of icons, must be mapped to page number
 */
const iconSelector =  (n: number, icons: ReactNode[]) => {
    if((icons.length === 0) || (n>icons.length)) throw new Error("oops!")
    return icons[n];
}