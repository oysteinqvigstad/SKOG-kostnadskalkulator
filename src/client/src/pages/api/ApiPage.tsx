import {Accordion, Alert, Badge, Card, Col, Row, Spinner, Table} from "react-bootstrap";
import React, {useEffect} from "react";
import {useGetCalculatorsInfoIncludingUnpublishedQuery, useGetCalculatorTreeQuery} from "../../state/store";
import {DropdownInput, InputNode, NodeType, TreeState, treeStateFromData} from "@skogkalk/common/dist/src/parseTree";
import {NumberInputNode} from "@skogkalk/common/dist/src/parseTree/nodes/inputNode";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";

export function ApiPage() {
    return (
        <>
            <Card>
                <Card.Body className={"mx-auto"} style={{maxWidth: '800px'}}>
                    <GeneralDescription />
                    <SectionRequestBodyFormat />
                    <SectionResponseBodyFormat />
                    <CalculatorAccordeons />
                </Card.Body>
            </Card>
        </>
    )
}

function GeneralDescription() {
    return (
        <>
        <Row className={"mt-5 mb-5 gap-3"}>
            <Col>
                <h1>{"API"}</h1>
                <p className={"mt-3"}
                   style={{fontSize: '1.2rem'}}>{"Programmeringsgrensesnittet (API) muliggjør integrasjon av kostnadskalkulatoren i eksterne applikasjoner. Dette gir applikasjonene full frihet til å bruke andre mekanismer for innhenting av opplysninger og presentere resultatene etter egne behov."}</p>
                <p className={"mt-3"}
                   style={{fontWeight: 300}}>{"Dokumentasjonen på denne siden er rettet mot utviklere. Fordi API-et var utviklet som del av et bachelor-prosjekt, vil vedlikehold og support være svært begrenset."}</p>
            </Col>
            <Col xs={5}>
                <img src={"../api.png"} alt={"API illustration"}/>
            </Col>
        </Row>
        <Row>
            <h1 className={"mt-2 mb-4"}>{"Endpoint Description"}</h1>
            <p>{"This endpoint enables developers to directly send form inputs to the server and obtain the processed results. The information should be transmitted using JSON format. There's no need for authentication to access this service, which is offered at no cost. We kindly ask to refrain from overloading the system by setting up a mock service during heavy testing and/or development."}</p>
            <Row className={"mt-3 mb-3"}>
                <Col xs={"auto"} className={"gap-0"}>
                    <h4><Badge className={"me-2"}>POST</Badge></h4>
                </Col>
                <Col className={"ps-0"} xs={"auto"}>
                    <h4>{"https://kostnadskalkulator.skogkurs.no/api/v1/calculate"}</h4>

                    <p style={{fontWeight: 600}}>Content-Type: application/json</p>
                </Col>
            </Row>
            </Row>
        </>
    )
}

function SectionRequestBodyFormat() {
    const headers = ["Key", "Type", "Description"]
    const rows = [
        ["name", "string", "The name of the calculator to perform the operation"],
        ["version", "number", "The version of the calculator to perform the operation"],
        ["mode", "string", "Determines how lenient the calculator should be. Valid values are 'strict' and 'relaxed'. 'strict' requires all calculator inputs to be defined, wheras 'relaxed' attempts to insert default value for absent inputs"],
        ["inputs", "object", "Consult the specifications at the bottom of the page for the specific calulator"]
    ]

    return (
        <>
            <ApiHeader text={"Request Body Format"}/>
            <p>{"The service incorporates calculator versioning to ensure that updates to the calculators do not disrupt existing API calls. This also implies that it is crucial for developers to regularly update their API calls as new calculator versions become available."}</p>
            <p>{"The request body must be a JSON object with the following structure:"}</p>
            <ApiTable headers={headers} rows={rows}/>
            <ExampleCode object={{
                name: 'Calculator name',
                version: 200,
                mode: 'relaxed',
                inputs: {pageName: {Length: 200, Incline: "0-25%"}}
            }} header={"Example Request Body"}/>

        </>
    )

}


function SectionResponseBodyFormat() {
    const headers = ["Status Code", "Description"]
    const rows = [
        ["200 OK", "Successful computation. Consult the specifications for each individual cauclators below"],
        ["400 Bad Request", "Caused by a missing fields or input (when required), invalid inputs or otherwise not adhering to the request body specifications"],
        ["404 Not Found", "Usually casued by a deleted resource. The database connection is working but was unable to process the request"],
        ["500 Internal Server Error", "Unexpected error or a failed database connection"]
    ]
    const exampleResponse = {
        Cost: [
            { name: "Machine A", value: 2000, unit: "kr" },
            { name: "Machine B", value: 3000, unit: "kr" }
        ],
        Productivity: [
            { name: "Machine A", value: 15, unit: "m³ ∕ G₁₅" },
            { name: "Machine B", value: 18, unit: "m³ ∕ G₁₅" }
        ]
    }


    return (
        <>
            <ApiHeader text={"Response Format"} />
            <p>{"The server response always return a single JSON object, in addition to an appropriate status code"}</p>

            <ApiTable headers={headers} rows={rows} />
            <ExampleCode
                object={exampleResponse}
                header={"Example Successful Response"}/>

            <ExampleCode
                object={{error: "Missing fields: 'Volum pr dekar' on page 'Bestand'"}}
                header={"Example Error Response"}/>
        </>
    )
}


function ApiHeader(props: {text: string}) {
    return (
        <h2 className={"pt-3 pb-3"} style={{fontWeight: 500}}>
            {props.text}
        </h2>
    )
}

function ApiTable(props: { headers: string[], rows: string[][] }) {
    return (
        <Table striped bordered size={"sm"}>
            <thead>
            <tr>
                {props.headers.map((header) => <th>{header}</th>)}
            </tr>
            </thead>
            <tbody>
            {props.rows.map((row) => {
                return (
                    <tr>
                        {row.map((cell) => <td>{cell}</td>)}
                    </tr>
                )
                })}
            </tbody>
        </Table>
    )
}


function ExampleCode(props: { object: any, header: string }) {
    return (
        <div className={"mt-5 mb-5"}>
            <h5>{props.header}</h5>
            <Card className="code-example">
                <Card.Body>
                    {JSON.stringify(props.object, null, 2)}
                </Card.Body>
            </Card>
        </div>
    )

}

function CalculatorAccordeons() {
    const {data, error, isLoading} = useGetCalculatorsInfoIncludingUnpublishedQuery()

    return (
        <>
            <ApiHeader text={"Input Specification by Calculator"} />
            {isLoading && <Spinner />}
            {error && <Alert>{"En feil oppstod ved henting av kalkulatorer"}</Alert>}
            {data && data.length === 0 && <Alert>{"Ingen kalkulatorer funnet"}</Alert>}
            {data && data
                .filter((calculator) => calculator.published)
                .map((calculator) => <SingleCalculatorExample calculator={calculator} />)
            }
        </>
    )
}

function SingleCalculatorExample(props: {calculator: Calculator}) {
    const version: string = [
        props.calculator.version / 1000000,
        (props.calculator.version / 1000) % 1000,
        props.calculator.version % 1000
    ].map(n => Math.floor(n).toString().padStart(3, '0')).join('.')

    const [skip, setSkip] = React.useState(true)
    const [treeState, setTreeState] = React.useState<TreeState | null>(null)

    const {data, error, isLoading} = useGetCalculatorTreeQuery({
        name: props.calculator.name, version: props.calculator.version}, { skip: skip })


    useEffect(() => {
        if (data) {
            setTreeState(treeStateFromData(data))
        }
    }, [data]);

    return (
        <>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header onClick={() => setSkip(false)}>
                        <strong>{props.calculator.name}</strong>
                        <span className={"ps-2"}>{`version ${version}`}</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {isLoading && <Spinner />}
                        {error && <Alert>{"En feil oppstod ved henting av kalkulator"}</Alert>}
                        {data && !treeState && <Alert>{"En feil oppsto ved behandling av kalkulatorinformasjon"}</Alert>}
                        {data && treeState && <SingleCalculatorExampleFields treeState={treeState} />}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}

function generateExampleJsonQuery(treeState: TreeState) {
    const pages = treeState.rootNode.pages.map((page) => page.pageName)
    const inputs = pages.reduce<{[key: string]: {[key: string]: number | string}}>((acc, pageName) => {

        const inputFields = treeState.inputs.filter((input) => input.pageName === pageName)
        acc[pageName] = inputFields.reduce<{ [key: string]: number | string }>((acc, inputField) => {
            let value: number | string = inputField.defaultValue
            if (inputField.type === NodeType.DropdownInput) {
                const alternatives = (inputField as DropdownInput).dropdownAlternatives
                value = alternatives.find((option) => option.value === inputField.defaultValue)?.label ?? alternatives[0].label
            }
            acc[inputField.name] = value
            return acc
        }, {})
        return acc

    }, {})

    return {
        name: treeState.rootNode.formulaName,
        version: treeState.rootNode.version,
        mode: "strict",
        inputs: inputs
    }
}

function SingleCalculatorExampleFields(props: {treeState: TreeState}) {
    const pages = props.treeState.rootNode.pages.map((page) => page.pageName)
    const exampleJsonBody = generateExampleJsonQuery(props.treeState)



    return (
       <>
           {pages.map((page) => {
               const inputNodes = props.treeState.inputs.filter((input) => input.pageName === page)
               return (
                   <>
                       <p style={{fontWeight: 700}}>{`Page Name "${page}"`}</p>
                       <SingleCalculatorExampleTable inputNodes={inputNodes} />
                   </>
                   )
               })
           }
           <ExampleCode object={exampleJsonBody} header={"Example Request Body"} />
       </>
    )
}

function SingleCalculatorExampleTable(props: {inputNodes: InputNode[]}) {

    /**
     * Get list of legal input values for a given input node
     */
    const legalValues = (inputNode: InputNode) => {
        if (inputNode.type === NodeType.NumberInput) {
            const legalValues = (inputNode as NumberInputNode).legalValues
            if (!legalValues.length) return "Any number"
            return legalValues.map(range =>
                `${range.min === null ? "-∞" : range.min} to ${range.max === null ? "∞" : range.max}`
            ).join(", ")
        } else if (inputNode.type === NodeType.DropdownInput) {
            return (inputNode as DropdownInput).dropdownAlternatives.map((option) => `"${option.label}"`).join(", ")
        }
        return ""
    }

    /**
     * Get the type of input node
     */
    const inputType = (inputNode: InputNode) => {
        if (inputNode.type === NodeType.NumberInput) return "Number"
        if (inputNode.type === NodeType.DropdownInput) return "String"
        return "Unknown"
    }

    /**
     * Row data for the table
     */
    const rows = props.inputNodes.map((inputNode) => [
        `"${inputNode.name}"`,
        inputType(inputNode),
        legalValues(inputNode)
    ])

   return (
       <ApiTable headers={["Input Name", "Type", "Legal Values"]} rows={rows} />
    )
}