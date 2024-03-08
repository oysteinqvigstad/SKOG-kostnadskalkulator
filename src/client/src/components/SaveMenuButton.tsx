import {MdBookmarks, MdDelete, MdSave} from "react-icons/md";
import {Button, Form, InputGroup, Modal, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {SavedResult} from "../types/SavedResult";
import {useAppSelector} from "../state/hooks";

export function SaveMenuButton() {
    const [show, setShow] = useState(false)
    const [results, setResults] = useState<SavedResult[]>([])
    const [resultName, setResultName] = useState("")
    const fields = useAppSelector((state) => state.form.fields)

    useEffect(() => {
        getSavedResults()
    }, [results]);

    function getSavedResults() {
        setResults(JSON.parse(localStorage.getItem("savedResults") as string ?? "[]"))
    }

    function handelNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setResultName(e.target.value)
    }

    function deleteSavedResult(index: number) {
        results.splice(index, 1)
        localStorage.setItem("savedResults", JSON.stringify(results))
    }

    function handleClose() {
        setShow(false)
    }

    return (
        <>
            <Button
                variant={"link"}
                onClick={() => setShow(!show)}
                style={{fontSize: '1.5em', color: "white"}}
            >
                <MdBookmarks/>
            </Button>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header>
                    <Modal.Title>Lagrede resultater</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Resultatene lagres lokalt i din nettleser og vil forsvinne ved sletting av nettleserdata.
                    <hr/>
                    <Form.Label htmlFor={"lagreResultat"}>Lagre nytt resultat</Form.Label>
                    <InputGroup>
                        <Form.Control
                            id={"lagreResultat"}
                            placeholder={"Navn på resultat"}
                            aria-label={"Navn på resultat"}
                            value={resultName}
                            onChange={handelNameChange}/>
                        <SaveButton results={results} fields={fields} resultName={resultName}/>
                    </InputGroup>
                    <hr/>
                    {results.length ? SavedResultsTable({
                        results,
                        handleClose,
                        deleteSavedResult
                    }) : "Ingen lagrede resultater"}
                </Modal.Body>
            </Modal>
        </>

    )
}

function SavedResultsTable(props: {
    results: SavedResult[],
    handleClose: (link: string) => void,
    deleteSavedResult: (index: number) => void
}) {
    const savedResults = props.results.map(({date, name, link}, index) =>
        <tr>
            <td>
                <a href={link} onClick={() => props.handleClose(link)}>
                    {name}
                </a>
            </td>
            <td>{new Date(date).toLocaleDateString()}</td>
            <td><Button onClick={() => props.deleteSavedResult(index)}>
                <MdDelete/>
            </Button></td>
        </tr>
    )

    return (<Table>
            <thead>
            <tr>
                <th>Navn</th>
                <th>Dato</th>
            </tr>
            </thead>
            <tbody>
            {savedResults}
            </tbody>
        </Table>
    )
}

function SaveButton(props: { results: SavedResult[], fields: any, resultName: string }) {
    function save() {
        const queries = Object.entries(props.fields).map(([key, value]) => {
            return `${encodeURI(key)}=${value}`
        }).join("&")
        const url = `/resultat?${queries}`
        props.results.unshift({date: Date.now(), name: props.resultName, link: url})
        localStorage.setItem("savedResults", JSON.stringify(props.results))
    }

    return (
        <Button onClick={save}>
            <MdSave/>
        </Button>
    )
}