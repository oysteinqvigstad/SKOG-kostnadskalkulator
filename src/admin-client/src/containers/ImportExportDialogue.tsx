import {ReteFunctions} from "../rete/editor";
import {
    Button,
    ButtonGroup,
    Col,
    Dropdown,
    DropdownButton,
    Modal,
    Row,
    Spinner,
    Stack,
    Table
} from "react-bootstrap";
import {
    useAddCalculatorMutation,
    useGetCalculatorSchemaQuery,
    useGetCalculatorsInfoQuery
} from "../state/store";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";
import {setTreeState} from "../state/slices/treeState";
import {setPagesState} from "../state/slices/pages";
import {setFormulaInfoState} from "../state/slices/formulaInfo";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {useEffect, useRef, useState} from "react";
import {selectCalculator} from "../state/selectors";
import {FormulaInfoContainer} from "./formulaInfoContainer";

export function ImportExportDialogue(props: {
    show: boolean,
    onHide: () => void,
    functions: ReteFunctions | null
}) {
    const dispatch = useAppDispatch()
    const currentCalculator = useAppSelector(selectCalculator(props.functions?.export()))

    const importCalculator = (data: Calculator["reteSchema"]) => {
        const emptyCanvas = currentCalculator.treeNodes?.length === 1 // only root node is present
        if (data && (emptyCanvas || window.confirm("Unsaved changes will be lost"))) {
            props.functions?.import(data.graph)
            dispatch(setTreeState(data.store.treeState));
            dispatch(setPagesState(data.store.pages));
            dispatch(setFormulaInfoState(data.store.formulaInfo));
            props.onHide()
        }
    }




    return (
       <Modal
           show={props.show}
           onHide={props.onHide}
           size={"xl"}
       >
           <Modal.Header closeButton>
               {"Load/Save Calculator"}
           </Modal.Header>
           <Modal.Body>
               <Row>
                   <Col xs={7}>
                       <OnlineStorageView onLoad={importCalculator} calculator={currentCalculator} />
                   </Col>
                   <Col className={"justify-content-center d-flex"}>
                      <div className={"h-100 border"} style={{width: '1px'}} />
                   </Col>
                   <Col xs={4}>
                       <LocalStorageView onLoad={importCalculator} calculator={currentCalculator} />
                   </Col>

               </Row>
           </Modal.Body>
       </Modal>
    )
}

function LocalStorageView(props: {
    onLoad: (schema: Calculator["reteSchema"]) => void,
    calculator: Calculator
}) {

    const [data, setData] = useState<Calculator["reteSchema"] | undefined>(undefined)
    const [readTrigger, setReadTrigger] = useState(false)

    useEffect(() => {
        if (localStorage && localStorage.getItem('store') && localStorage.getItem('graph')) {
            const parsed = {
                store: JSON.parse(localStorage.getItem('store')!),
                graph: JSON.parse(localStorage.getItem('graph')!)
            } as Calculator["reteSchema"]
            setData(parsed)
        }
    }, [readTrigger])

    const onSave = () => {
        if (!data || window.confirm("Overwrite existing graph?")) {
            localStorage.setItem('store', JSON.stringify(props.calculator.reteSchema?.store));
            localStorage.setItem('graph', JSON.stringify(props.calculator.reteSchema?.graph));
            setReadTrigger(!readTrigger)
        }
    }


    return (
        <>
            <h3>{"Local Browser Storage"}</h3>
            <p>
                {"The browser storage only have capacity for one calculator, and should only be used temporarily"}
            </p>
            <Stack direction={"horizontal"} gap={2}>
                <Button style={{height: '58px'}} disabled={!data} onClick={() => props.onLoad(data)}>
                    {"Restore"}
                </Button>
                <Button style={{height: '58px'}} onClick={() => onSave()}>
                    {"Save"}
                </Button>
            </Stack>
        </>
    )
}

function OnlineStorageView(props: {
    onLoad: (schema: Calculator["reteSchema"]) => void,
    calculator: Calculator
}) {
    const {data, error, isLoading, refetch} = useGetCalculatorsInfoQuery()

    return (
        <>
            <h3>{"Database Storage"}</h3>
            <p>
                {"The recommended way to save a calculator. The calculator can be saved with or without publishing it to customer app."}
            </p>
            <Stack className={"mb-4"} direction={"horizontal"} gap={3}>
                <FormulaInfoContainer/>
                <SaveToAPI onSaved={() => refetch()} calculator={props.calculator} />
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
                {data && !data.length && <tr>
                    <td colSpan={3}>{"No calculators found"}</td>
                </tr>}
                </tbody>
                {isLoading && <Spinner/>}
                {error && <p>{"Error in communication with API"}</p>}
            </Table>
            <Button onClick={refetch}>
                {"Force Refresh"}
            </Button>
        </>
    )
}


function TableRow(props: {
    onLoad: (schema: Calculator["reteSchema"]) => void,
    calculator: Calculator,
}) {
    const version: string = [
        props.calculator.version / 1000000,
        (props.calculator.version / 1000) % 1000,
        props.calculator.version % 1000
    ].map(n => Math.floor(n).toString()).join('.')

    const [haltFetch, setHaltFetch] = useState(true)
    const {data, error, isLoading} = useGetCalculatorSchemaQuery({name: props.calculator.name, version: props.calculator.version}, {skip: haltFetch})

    // keep a reference to the latest onLoad function
    const onLoad = useRef(props.onLoad)

    // keep the onLoad function up to date without causing a rerender
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


function SaveToAPI(props: {
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
