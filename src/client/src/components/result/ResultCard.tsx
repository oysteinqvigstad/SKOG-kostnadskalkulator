import {Card, Stack} from "react-bootstrap";
import React from "react";

export function ResultCard(props: {
    icon: JSX.Element,
    title: string,
    children: any
}) {
    return (
        <Card className={"h-100"}>
            <Card.Body>
                <Stack direction={"horizontal"} className={"mb-4"}>
                    <h5 style={{fontSize: '1.5em'}}>
                        {props.icon}
                    </h5>
                        <h5 className={"m-0 ms-1"}>
                            {props.title}
                        </h5>
                </Stack>
                {props.children}
            </Card.Body>
        </Card>
    )
}