import {Card} from "react-bootstrap";
import {useAppSelector} from "../state/hooks";
import {selectCalculatorData} from "../state/calculatorSelectors";
import {StartButton} from "../components/StartButton";
import CalculatorPicker from "../containers/CalculatorPicker";
import {useGetCalculatorsQuery} from "../state/store";

export function FrontPage() {
    // Get the calculator data from the store
    const calculatorData = useAppSelector(selectCalculatorData)

    // testing api call in production on GAE. Will be removed soon.
    const {data, error, isLoading} = useGetCalculatorsQuery()
    console.log('data:', JSON.stringify(data), 'error:', !!error, 'isLoading:', isLoading)

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