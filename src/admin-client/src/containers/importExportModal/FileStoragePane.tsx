import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";
import {useEffect, useState} from "react";
import {Button, Stack} from "react-bootstrap";

/**
 * A pane for importing and exporting calculators from/to the local browser storage
 */
export function LocalStoragePane(props: {
    onLoad: (schema: Calculator["reteSchema"]) => void,
    calculator: Calculator
}) {

    // composite data from the local storage
    const [parsedData, setParsedData] = useState<Calculator["reteSchema"] | undefined>(undefined)
    // trigger for re-reading the local storage
    const [readTrigger, setReadTrigger] = useState(false)

    // read the local storage when the trigger is set or when the component is mounted
    useEffect(() => {
        if (localStorage && localStorage.getItem('store') && localStorage.getItem('graph')) {
            const parsed = {
                store: JSON.parse(localStorage.getItem('store')!),
                graph: JSON.parse(localStorage.getItem('graph')!)
            } as Calculator["reteSchema"]
            setParsedData(parsed)
        }
    }, [readTrigger])

    // callback for saving the current calculator to the local storage
    const onSave = () => {
        if (!parsedData || window.confirm("Overwrite existing graph?")) {
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
                <Button style={{height: '58px'}} disabled={!parsedData} onClick={() => props.onLoad(parsedData)}>
                    {"Restore"}
                </Button>
                <Button style={{height: '58px'}} onClick={() => onSave()}>
                    {"Save"}
                </Button>
            </Stack>
        </>
    )
}
