import {Col} from "react-bootstrap";
import React from "react";
import {useAppSelector} from "../state/hooks";

/**
 * The main content of the application, containing the input and result pages
 */
export function MainContainer({children}: {children: any}) {
    const pageNumber = useAppSelector((state) => state.form.page)

    return (
        <Col className={"mt-2 mx-auto"} style={{maxWidth: pageNumber === 4 ? '1200px' : '400px', color: 'white'}}>
            {children}
        </Col>
    )
}
