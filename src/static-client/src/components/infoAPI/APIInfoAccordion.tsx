import {Accordion, Badge, Form, InputGroup} from "react-bootstrap";
import React from "react";

export function APIInfoAccordion(props: {
    method: string,
    url: string,
    children: any
}) {
    const handleMouseDown = (event: React.MouseEvent<any>) => {
        event.stopPropagation()
        event.preventDefault()
    }

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <Badge>{props.method}</Badge>
                <InputGroup className={"ps-3 pe-4"}>
                    <Form.Control
                        type={"text"}
                        value={props.url}
                        onClick={handleMouseDown}
                    />
                </InputGroup>
            </Accordion.Header>
            <Accordion.Body>
                {props.children}
            </Accordion.Body>
        </Accordion.Item>
    )
}