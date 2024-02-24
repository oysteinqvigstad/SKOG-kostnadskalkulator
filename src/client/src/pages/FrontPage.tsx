import {Card} from "react-bootstrap";
import {useAppSelector} from "../state/hooks";
import {selectCalculatorData} from "../state/calculatorSelectors";
import {StartButton} from "../components/StartButton";
import CalculatorPicker from "../containers/CalculatorPicker";
import {useAddCalculatorMutation, useGetCalculatorsQuery} from "../state/store";
import {useEffect} from "react";

export function FrontPage() {
    // Get the calculator data from the store
    const calculatorData = useAppSelector(selectCalculatorData)

    // testing api call in production on GAE. Will be removed soon.
    const {data, error, isLoading} = useGetCalculatorsQuery()
    const [addCalculator, {isLoading: isUpdating, error: postError}] = useAddCalculatorMutation()
    useEffect(() => {
        addCalculator({name: "test", version: "1.0", formula: "abcdfg"})
    }, [addCalculator]);

    useEffect(() => {
        console.log('data:', JSON.stringify(data), 'error:', !!error, 'isLoading:', isLoading)
        console.log('isUpdating:', isUpdating, "error:", postError)

    }, [data, error, isLoading, isUpdating, postError]);


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