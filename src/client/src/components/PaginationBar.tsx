import {Button, Col, Pagination, Row} from "react-bootstrap";
import React from "react";
import {useAppSelector} from "../state/hooks";

export function PaginationBar(props: {onClick: (pageNumber: number) => void}) {
    const page = useAppSelector((state) => state.form.page)

    const pagination = [...Array(4)].map((_, n) =>
        <Pagination.Item
            key={n}
            active={page === n}
            onClick={() => props.onClick(n)}>
            {n+1}
        </Pagination.Item>
    )

    return (
        <Row>
            <Col xs={3}>
                <Button
                    className={"w-100"}
                    disabled={page === 0}
                    onClick={() => props.onClick(page-1)}>
                    {"Forrige"}
                </Button>
            </Col>
            <Col className={"d-flex justify-content-center"}>
                <Pagination>
                    {pagination}
                </Pagination>
            </Col>
            <Col xs={3}>
                <Button
                    className={"w-100"}
                    disabled={page === 3}
                    onClick={() => props.onClick(page+1)}>
                    {"Neste"}
                </Button>
            </Col>
        </Row>
    )
}