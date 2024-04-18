import {Card} from "react-bootstrap";

export function InformationalScientificSourcesPage() {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    {"Forskningsgrunnlag"}
                </Card.Title>
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
            </Card.Body>
        </Card>
    )
}