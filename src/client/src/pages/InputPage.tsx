import {InputField} from "../containers/InputField";
import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {useAppDispatch} from "../state/hooks";
import {setPage} from "../state/formSlice";
import {staticFieldDescriptions} from "../constants/staticFieldData";

export function InputPage() {
    const dispatch = useAppDispatch()

    const [validated, setValidated] = useState(false)

    const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        if (!form.checkValidity()) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            dispatch(setPage(1))
        }
        setValidated(true)
    }

    return (
        <Form noValidate onSubmit={handleSubmit} validated={validated}>
        {staticFieldDescriptions.map((data) => <InputField fieldData={data} />)}
        <div className="d-grid">
            <Button type="submit">Beregn</Button>
        </div>
        </Form>
    )
}
