import {InputField} from "../containers/InputField";
import {Form} from "react-bootstrap";
import React from "react";
import {useAppSelector} from "../state/hooks";
import {staticFieldDescriptions} from "../constants/staticFieldData";
import '../App.css'

export function InputPage(props: {formRef: React.RefObject<HTMLFormElement>}) {
    const page = useAppSelector((state) => state.form.page)
    const validated = useAppSelector((state) => state.form.validated)



    return (
        <Form noValidate validated={validated} ref={props.formRef}>
            {staticFieldDescriptions.map((data) => <InputField fieldData={data} hidden={data.page !== page} />)}
        </Form>
    )
}
