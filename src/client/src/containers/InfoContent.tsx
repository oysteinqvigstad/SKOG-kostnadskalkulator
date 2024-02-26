import {selectCalculatorData} from "../state/calculatorSelectors";
import {useAppSelector} from "../state/hooks";
import {Accordion, Card} from "react-bootstrap";

export function InfoContent() {
    // Get the calculator data from the store
    const calculatorData = useAppSelector(selectCalculatorData)

    return (
        <>
            <Card className={"mt-3 rounded-bottom-0"}>
                <Card.Body>
                    <Card.Title>{calculatorData.name}</Card.Title>
                    <Card.Text dangerouslySetInnerHTML={{__html: calculatorData.description}}></Card.Text>
                </Card.Body>
            </Card>
            <Accordion>
                <Accordion.Item className={"rounded-top-0"} eventKey="0">
                    <Accordion.Header>Forskningsgrunnlag</Accordion.Header>
                    <Accordion.Body>
                        <p>
                            {"Grunnlaget for kalkylene er SKOGFORSK sine Underlag til produksjonsnormer for skotare (Torbjörn Brunberg, 2004) og "}
                            <a href="https://www.skogforsk.se/kunskap/kunskapsbanken/2007/Underlag-for-produktionsnormer-for-extra-stora-engrepsskordare-i-slutavverkning/">
                                {"Underlag for produktionsnormer for extra stora engrepsskordare"}
                            </a>
                            {" (Torbjörn Brunberg, 2007)."}
                        </p>
                        <p>
                            {"Normene er justert med norske studier gjort av NIBIO, NFR 225329, Sustainable utilization of forest resources in Norway (Bruce Talbot, 2016)."}
                        </p>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Tallgrunnlag</Accordion.Header>
                    <Accordion.Body>
                        {"Maskinkostnadene har som grunnlag 2000 timer/år, basert på beregnede kostnader fra Prosjekt Klimatre, justert med Kostnadsindeks for skogsmaskiner pr 3. kvartal 2022."}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}