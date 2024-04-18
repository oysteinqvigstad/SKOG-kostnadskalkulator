import {Accordion, Form} from "react-bootstrap";
import React from "react";

export function APIInfoExampleResult(props: {resultText: string}) {
    return (

        <Accordion>
            <Accordion.Item eventKey={"2"}>

                <Accordion.Header>Eksempel resultat</Accordion.Header>
                <Accordion.Body style={{fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>
                    {props.resultText}
                    {/* not entirely sure why, but its not possible to mark the text without the empty form below */}
                    <Form>
                        <Form.Group>
                        </Form.Group>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>

        </Accordion>
    )
}