import {Form} from "react-bootstrap";
import React from "react";
import {useAppSelector} from "../state/hooks";
import '../App.css'
import {staticFieldDescriptions} from "../data/staticFieldDescriptions";

/**
 * The input pages for the form where the user can input data
 * @param props - formRef: React.RefObject<HTMLFormElement> - A reference to the form
 */
export function InputContent(props: {formRef: React.RefObject<HTMLFormElement>}) {
    const page = useAppSelector((state) => state.form.page)
    const validated = useAppSelector((state) => state.form.validated)

    return (
        <Form noValidate validated={validated} ref={props.formRef}>
            {staticFieldDescriptions.map((data) =>
                <div hidden={data.page !== page}>
                    {/*<InputField fieldData={data} />*/}
                </div>
            )}
        </Form>
    )
}
