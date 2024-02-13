import {Card} from "react-bootstrap";
import {useAppSelector} from "../state/hooks";
import {selectCalculatorData} from "../state/calculatorSelectors";
import {StartButton} from "../components/StartButton";
import CalculatorPicker from "../containers/CalculatorPicker";

export function FrontPage() {
    const calculatorData = useAppSelector(selectCalculatorData)
    return (
        <>
            <CalculatorPicker/>
            <Card className={"my-3"}>
                <Card.Body>
                    <Card.Title>{calculatorData.name}</Card.Title>
                    <Card.Text dangerouslySetInnerHTML={{__html: calculatorData.description}}></Card.Text>
                </Card.Body>
            </Card>
            <StartButton/>
        </>
    )
}