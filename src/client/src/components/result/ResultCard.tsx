import {Card, Stack} from "react-bootstrap";
import React from "react";

export function ResultCard(props: {
    icon: JSX.Element,
    title: string,
    left?: any,
    children: any
}) {
    return (
        <Card className={"h-100"}>
            <Card.Body>
                <Stack direction={"horizontal"} className={"mb-3"}>
                    <h5 className={"ps-1 pe-1"} style={{fontSize: '1.5em'}}>
                        {props.icon}
                    </h5>
                    <h5 className={"m-0 ms-1"}>
                        {props.title}
                    </h5>
                    <div className={"ms-auto"}>
                        {props.left}
                    </div>
                </Stack>
                {props.children}
            </Card.Body>
        </Card>
    )
}