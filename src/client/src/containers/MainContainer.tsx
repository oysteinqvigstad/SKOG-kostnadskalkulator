import {Col} from "react-bootstrap";
import React from "react";

/**
 * The main content of the application, containing the input and result pages
 */
export function MainContainer({children}: {children: any}) {

    return (
        <Col className={"mt-2 mx-auto"} style={{maxWidth: '800px', color: 'white'}}>
            {children}
        </Col>
    )
}
