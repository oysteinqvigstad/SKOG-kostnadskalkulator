import {Container, Row} from "react-bootstrap";
import {ResultListItem} from "../../types/ResultListItem";

export function ResultRowBoxes(props: {
    listItems: ResultListItem[]
}) {
    const combined = combineSameTitleAndColor(props.listItems)
    const defaultColors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#00D9E9', '#FF66C3']


    return (
       <Row className={"d-flex gap-4 justify-content-center"}>
           {combined.map(({title, color, lines}, index) =>
               <ResultRowBox title={title} color={color ?? defaultColors[index]} measurement={lines} />)}
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

function combineSameTitleAndColor(items: ResultListItem[]) {
    const unique = new Set<string>(
        items.map((item) => item.text)
    )
    return Array.from(unique).map((title) => {

        return {
            title: title,
            color: items
                .find(item => item.text === title)
                ?.color,
            lines: items
                .filter(item => title === item.text)
                .map(item => `${item.value.toFixed()} ${item.unit}`).join("\n")
        }
    })




}