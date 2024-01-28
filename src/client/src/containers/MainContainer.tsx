import {Col} from "react-bootstrap";

export function MainContainer(props: {children: React.ReactNode}) {
    return (
        <Col className={"p-3 mt-2 mx-auto"} style={{maxWidth: '400px'}}>
            {props.children}
        </Col>
    )
}