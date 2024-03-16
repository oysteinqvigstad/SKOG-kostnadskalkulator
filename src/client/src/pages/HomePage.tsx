import {Button, Card, Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useGetCalculatorsInfoQuery} from "../state/store";

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
    const {data, error, isLoading} = useGetCalculatorsInfoQuery()


    return (
        <>
            {isLoading && <p>{"Laster inn..."}</p>}
            {data && data.length === 0 && <p>{"Ingen kalkulatorer funnet"}</p>}
            {error && <p>{"En feil oppstod ved henting av kalkulatorer"}</p>}
            {data && data.map((calculator) => {
                return (
                    <Col xs={6}>
                        <CalculatorButton
                            title={calculator.name}
                            description={"Kort beskrivelse"}
                            onclick={() => {navigate(`/kalkulator/${encodeURI(calculator.name)}/${calculator.version}`)}}
                            disabled={false}/>
                    </Col>
                )
            })
            }
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