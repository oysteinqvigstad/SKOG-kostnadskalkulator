import {Button, Card, Modal, Stack} from "react-bootstrap";
import React, {useState} from "react";
import {FcInfo} from "react-icons/fc";

//TODO: Maybe change dangerouslySet to parseHTML??
export function ResultCard(props: {
    icon: JSX.Element,
    title: string,
    left?: any,
    infoText?: string,
    children: any
}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


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
                        {props.infoText &&
                        <>
                            <Button
                                className={"ms-auto"}
                                onClick={handleShow} disabled={!props.infoText}
                                style={{backgroundColor: 'transparent', border: 'none'}}
                            >
                                <FcInfo size={"2rem"}/>
                            </Button>
                            <Modal onHide={handleClose} show={show}>
                                <Modal.Header closeButton>
                                    <Modal.Title> Info </Modal.Title>
                                </Modal.Header>
                                <Modal.Body dangerouslySetInnerHTML={{__html: props.infoText ?? ""}}/>
                            </Modal>
                        </>
                        }
                    </div>
                </Stack>
                {props.children}
            </Card.Body>
        </Card>
    )
}