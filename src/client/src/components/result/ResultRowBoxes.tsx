import {Container, Row} from "react-bootstrap";
import {ResultListItem} from "../../types/ResultListItem";

export function ResultRowBoxes(prop: {
    listItems: ResultListItem[]
}) {
    const colors = [
        '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#00D9E9'
    ]


    return (
       <Row className={"d-flex gap-4 justify-content-center"}>
           {prop.listItems.map((listItem, i) =>
               <ResultRowBox
                   listItem={listItem}
                   color={colors[i]}
               />)}
       </Row>
    )
}

function ResultRowBox(prop: {
    listItem: ResultListItem,
    color: string
}) {
    return (
        <Container className={"m-0"}
             style={{borderTop: `solid 4px ${prop.color}`, borderRadius: '4px', width: '90px'}}
        >

            <Row
                className={"justify-content-center"}
                style={{fontSize: '14px', fontWeight: 500}}
            >
                {prop.listItem.text}
            </Row>
            <Row
                className={"justify-content-center"}
                style={{fontSize: '14px', fontWeight: 400}}
            >

                {Math.round(prop.listItem.value)} {prop.listItem.unit}
            </Row>
        </Container>
    )

}