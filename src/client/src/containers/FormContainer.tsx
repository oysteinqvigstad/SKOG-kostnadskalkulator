import {Col} from "react-bootstrap";

export function FormContainer(props: {children: React.ReactNode}) {
    return (
        <Col className={"p-3 mx-auto"} style={{maxWidth: '400px'}}>
            {props.children}
        </Col>
    )
}