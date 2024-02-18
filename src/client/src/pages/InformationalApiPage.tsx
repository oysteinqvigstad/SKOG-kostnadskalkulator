import {Accordion, Alert} from "react-bootstrap";
import React from "react";
import {APIInfoAccordion} from "../components/infoAPI/APIInfoAccordion";
import {APIInfoExampleResult} from "../components/infoAPI/APIInfoExampleResult";

export function InformationalApiPage() {
    const prefixURL = "https://kostnad.skogkurs.no/api/v0/"
    const exampleResult =
`[
    {
        "name": "Kostnadskalkulator",
        "version": "1.0"
        "formula": "...",
    }
]`


    return (
        <>
            <Alert>
                {"Tilhørende API er experimentell og bør ikke brukes enda"}
            </Alert>
            <Accordion>
                <APIInfoAccordion method={"GET"} url={`${prefixURL}getCalculators`}>
                    <APIInfoExampleResult resultText={exampleResult} />
                </APIInfoAccordion>
            </Accordion>
        </>
    )
}