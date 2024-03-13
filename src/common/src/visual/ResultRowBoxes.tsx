import {Container, Row} from "react-bootstrap";
import React from "react";

export function ResultRowBoxes(props: {
    result: { label: string, color: string, value: number }[],
    unit: string
}) {
    const defaultColors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#00D9E9', '#FF66C3']


    return (
       <Row className={"d-flex gap-4 justify-content-center"}>
           {props.result.map(({label, color, value}, index) =>
               <ResultRowBox title={label} color={color ?? defaultColors[index]} measurement={`${value} ${props.unit}`} />)}
       </Row>
    )
}

function ResultRowBox(props: {
    title: string,
    color: string,
    measurement: string,
}) {

    return (
        <Container className={"m-0"}
             style={{borderTop: `solid 4px ${props.color}`, borderRadius: '4px', width: '90px'}}
        >

            <Row
                className={"justify-content-center"}
                style={{fontSize: '14px', fontWeight: 500}}
            >
                {props.title}
            </Row>
            <Row
                className={"justify-content-center"}
                style={{fontSize: '14px', fontWeight: 400, whiteSpace: 'pre-wrap'}}

            >
                {props.measurement}
            </Row>
        </Container>
    )
}
