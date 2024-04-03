import {Card} from "react-bootstrap";

export function InformationalDefaultValuesPage() {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    {"Tallgrunnlag"}
                </Card.Title>
                {"Maskinkostnadene har som grunnlag 2000 timer/år, basert på beregnede kostnader fra Prosjekt Klimatre, justert med Kostnadsindeks for skogsmaskiner pr 3. kvartal 2022."}
            </Card.Body>
        </Card>
    )
}