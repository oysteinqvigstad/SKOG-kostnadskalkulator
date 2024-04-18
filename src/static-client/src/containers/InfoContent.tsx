import {useAppSelector} from "../state/hooks";
import {selectCalculatorData} from "../state/calculatorSelectors";
import {Card} from "react-bootstrap";

export function InfoContent() {
    const calculatorData = useAppSelector(selectCalculatorData)

    return (
        <Card>
            <Card.Body>
                <Card.Title>{calculatorData.name}</Card.Title>
                <Card.Text dangerouslySetInnerHTML={{__html: calculatorData.description}}></Card.Text></Card.Body>
        </Card>
    )
}