import {Col, Pagination, Row} from "react-bootstrap";
import React from "react";
import {useAppSelector} from "../state/hooks";
import {BarChartLine} from "react-bootstrap-icons";

/**
 * The pagination bar for the input and result pages
 * @param props - onClick: (pageNumber: number) => void - the function to call when a page is clicked
 */
export function PaginationBar(props: {onClick: (pageNumber: number) => void}) {
    // Get the current page number from the store
    const page = useAppSelector((state) => state.form.page)

    /**
     * Creates the individual page numbers
     */
    const pagination = [...Array(4)].map((_, n) =>
        <Pagination.Item
            key={n}
            active={page === n}
            onClick={() => props.onClick(n)}>
            {(n === 3) ? <BarChartLine /> : n+1}
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