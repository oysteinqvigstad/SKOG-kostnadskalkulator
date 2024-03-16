import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";
import {useAddCalculatorMutation, useGetCalculatorSchemaQuery, useGetCalculatorsInfoQuery} from "../../state/store";
import {FormulaInfoContainer} from "../formulaInfoContainer";
import {Button, ButtonGroup, Dropdown, DropdownButton, Spinner, Stack, Table} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";

/**
 * A pane for importing and exporting calculators from/to the online database through the API
 */
export function OnlineStoragePane(props: {
    onLoad: (schema: Calculator["reteSchema"]) => void,
    calculator: Calculator
}) {

    // fetch metadata of stored calculators from the API
    const {data, error, isLoading, refetch} = useGetCalculatorsInfoQuery()

    return (
        <>
            <h3>{"Database Storage"}</h3>
            <p>
                {"The recommended way to save a calculator. The calculator can be saved with or without publishing it to customer app."}
            </p>
            <Stack className={"mb-4"} direction={"horizontal"} gap={3}>
                <FormulaInfoContainer/>
                <SaveToAPIButton onSaved={() => refetch()} calculator={props.calculator} />
            </Stack>
            <h5>{"Database stored calculators"}</h5>
            <Table size={"sm"}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th className={"text-end"}>Version</th>
                    <th className={"text-end"}>Published</th>
                </tr>
                </thead>
                <tbody>
                {data && data.map((calculator) => <TableRow onLoad={props.onLoad} calculator={calculator} />)}
                {data && !data.length &&
                    <tr>
                        <td colSpan={3}>
                            {"No calculators found"}
                        </td>
                    </tr>
                }
                </tbody>
                {isLoading && <Spinner/>}
                {error &&
                    <p>{"Error in communication with API"}</p>
                }
            </Table>
            <Button onClick={refetch}>
                {"Force Refresh"}
            </Button>
        </>
    )
}


/**
 * A button for saving the current calculator to the online database through the API
 * @param props.onSaved A callback function to be called when the calculator is saved
 */
function SaveToAPIButton(props: {
    calculator: Calculator,
    onSaved: () => void,
}) {
    const [addCalculator, addCalculatorStatus] = useAddCalculatorMutation()


    const sendToAPI = async (publish: boolean) => {
        if (!props.calculator.reteSchema?.graph || props.calculator.treeNodes?.length === 1) {
            window.alert("Cannot save empty graph to database")
        } else if (!props.calculator.name || !props.calculator.version) {
            window.alert("Cannot save a calculator without a name and version")
        } else {
            props.calculator.published = publish
            addCalculator(props.calculator)
        }
    }


    // keep a reference to the latest onSaved function
    const onSaved = useRef(props.onSaved)

    // keep the onSaved function up to date without causing a rerender
    useEffect(() => {
        onSaved.current = props.onSaved
    }, [props.onSaved]);

    // call the onSaved function when the data is fetched
    useEffect(() => {
        if (addCalculatorStatus.isSuccess) {
            window.alert("Successfully saved to database")
            onSaved.current()
        } else if (addCalculatorStatus.isError) {
            window.alert("Error saving to database")
        }
    }, [addCalculatorStatus])

    const title = (
        <>
            {"Export"}
            {addCalculatorStatus.isLoading && <Spinner size={"sm"} />}
        </>
    )

    return (

        <tr>
            <DropdownButton id={"save options"} as={ButtonGroup} title={title} style={{height: '58px'}}>
                <Dropdown.Item onClick={() => sendToAPI(false)}>Save only</Dropdown.Item>
                <Dropdown.Item onClick={() => sendToAPI(true)}>Save and publish</Dropdown.Item>
            </DropdownButton>
        </tr>
    )

}



/**
 * A row in the table of stored calculators
 */
function TableRow(props: {
    onLoad: (schema: Calculator["reteSchema"]) => void,
    calculator: Calculator,
}) {
    // format the version number to xxx.xxx.xxx without leading zeros
    const version: string = [
        props.calculator.version / 1000000,
        (props.calculator.version / 1000) % 1000,
        props.calculator.version % 1000
    ].map(n => Math.floor(n).toString()).join('.')

    // trigger for fetching the schema from the API when button/link is clicked
    const [haltFetch, setHaltFetch] = useState(true)
    // fetch the rete schema and redux store from the API
    const {data, error, isLoading} = useGetCalculatorSchemaQuery({name: props.calculator.name, version: props.calculator.version}, {skip: haltFetch})

    // keep a memoized reference to the latest onLoad function instead of using it directly,
    // as this this avoids a infinite loop on the useEffect below because
    const onLoad = useRef(props.onLoad)
    useEffect(() => {
        onLoad.current = props.onLoad
    }, [props.onLoad]);

    // call the onLoad function when the data is fetched
    useEffect(() => {
        if (data) {
            onLoad.current(data)
        } else if (error) {
            window.alert("Error fetching calculator schema")
        }
    }, [data, error]);

    return (
        <tr>
            <td>
                <Button variant={'link'} onClick={() => setHaltFetch(false)}>
                    {props.calculator.name}
                </Button>
                {isLoading && <Spinner/>}
            </td>
            <td className={"text-end"}>{version}</td>
            <td className={"text-end"}>{props.calculator.published ? '✓' : ''}</td>
        </tr>
    )
}


