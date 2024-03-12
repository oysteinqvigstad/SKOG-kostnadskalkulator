import {Button, Card, Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export function HomePage() {
    return (
            <Card className={"pt-5"}>
                <Card.Body>
                    <Row className={"mx-auto"} style={{maxWidth: '800px'}}>
                        <Col xs={12} md={8}>
                            <h1 style={{fontWeight: 600}}>Beregn <span style={{color: '#ffa100'}}>produktivitet</span> og <span style={{color: '#ffa100'}}>kostnader</span> for skoghogst.
                            </h1>
                            <Row className={"mt-4 mb-4"}>
                                <Col className={"fst-italic"}>
                                    <p>{"Basert på skogtype, driftsforhold og hvordan drifta er tilrettelagt, gir kalkulatoren en prognose på tidsbruk og kostnader."}</p>
                                </Col>
                            </Row>
                            <CalculatorPicker />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
    )
}

function CalculatorPicker() {
    const navigate = useNavigate()

    return (
        <>
            <Row className={"mt-2 mb-5"}>
                <Col xs={6}>
                    <CalculatorButton
                        title={"Åpen hogst"}
                        description={"Fjerner alle trær fra et område."}
                        onclick={() => {navigate("/kalkulator")}}
                        disabled={false}/>
                </Col>
                <Col xs={6}>
                    <CalculatorButton
                        title={"Lukket hogst"}
                        description={"Kommer senere"}
                        onclick={() => {}}
                        disabled={true}/>
                </Col>
            </Row>

        </>
    )
}

function CalculatorButton(props: {
    title: string,
    description: string,
    onclick: () => void,
    disabled: boolean}) {
    return (
        <Button
            variant={"secondary"}
            className={"d-flex w-100 h-100 pt-2"}
            disabled={props.disabled}
            onClick={() => props.onclick()}
        >
            <Col>
                <Card.Title>
                    {props.title}
                </Card.Title>
                <Card.Body>
                    <p>
                        {props.description}
                    </p>
                </Card.Body>
            </Col>
        </Button>
)

}