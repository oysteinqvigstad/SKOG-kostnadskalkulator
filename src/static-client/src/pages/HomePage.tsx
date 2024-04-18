import {Button, Card, Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export function HomePage() {
    return (
            <Card className={"pt-5"}>
                <Card.Body>
                    <Row className={"mx-auto"} style={{maxWidth: '800px'}}>
                        <Col xs={12} md={8}>
                            <h1 style={{fontWeight: 700, fontSize: '40px'}}>Beregn produktivitet og kostnader ved skogsdrift
                            </h1>
                            <Row className={"mt-4 mb-4"} style={{fontWeight: 500}}>
                                <Col>
                                    <Row className={"mt-2 mb-4"} style={{fontSize: '18px'}}>
                                        <p>{"Kalkulatoren gir en prognose på tidsbruk og kostnader basert på skogtype, driftsforhold og hvordan drifta er tilrettelagt."}</p>
                                    </Row>
                                    <Row>
                                        <CalculatorPicker />
                                    </Row>
                                    <hr style={{color: "darkgray"}} />
                                    <i>
                                        <Row className={"pt-4 mb-2"}>
                                            <p>{"Kalkulatoren er utviklet av Skogkurs i samarbeid med NIBIO, Allskog, Glommen Mjøsen Skog og MEF-Skog. Programmeringen er utført av en gruppe bachelor-studenter ved NTNU i Gjøvik."}</p>
                                        </Row>
                                        <Row>
                                            <p>{"Kalkulatoren er finansiert med støtte fra Skogbrukets Utviklingsfond og Skogbrukets Verdiskapingsfond."}</p>
                                        </Row>
                                    </i>
                                </Col>
                            </Row>
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
                        description={""}
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
            className={"d-flex align-items-center w-100 h-100 pt-2 btn-calculator"}
            disabled={props.disabled}
            onClick={() => props.onclick()}
        >
            <Col>
                <div className={"title"}>{props.title}</div>
                <div className={"description"}>{props.description}</div>
            </Col>
        </Button>
)

}