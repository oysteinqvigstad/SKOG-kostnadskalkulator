import Container from "react-bootstrap/Container";
import {Button, Col, Form, Spinner} from "react-bootstrap";
import React, {FormEvent, useState} from "react";
import {useServices} from "../contexts/ServiceContext";
import {MdMarkEmailRead, MdUnsubscribe} from "react-icons/md";

/**
 * Page for sending a sign in link to the user
 */
export function SignInPage() {
    const {authService} = useServices()
    // The state of the sign in process
    const [state, setState] = useState<"ready" | "loading" | "success" | "error">("ready")
    // The email address that the user has entered
    const [emailField, setEmailField] = useState("")
    // The email address that was submitted after clicking the sign in button
    const [emailSubmitted, setEmailSubmitted] = useState("")

    /**
     * Sends the sign in link to the user
     */
    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        setState("loading")
        setEmailSubmitted(emailField)
        authService.sendSignInLink(emailField)
            .then(() => { setState("success") })
            .catch(() => { setState("error") })
    }

    return (
        <Container className="mx-auto" style={{paddingTop: '150px', maxWidth: '450px'}}>
            <Col>
                <h1 className={"text-center mb-5"}>{"Sign into Editor"}</h1>
                {state !== "success" &&
                    <EmailInputFields
                        onSubmit={onSubmit}
                        setEmail={setEmailField}
                        loading={state === "loading"} />
                }
                {state === "loading" &&
                    <LoadingSpinner />
                }
                {state === "error" &&
                    <ErrorMessage email={emailSubmitted} />
                }
                {state === "success" &&
                    <SuccessMessage email={emailSubmitted} />
                }
            </Col>
        </Container>
    );
}

/**
 * The input field for the email address including the submit button
 */
export function EmailInputFields(props: {
    setEmail: (email: string) => void
    onSubmit: (e: FormEvent) => void
    loading: boolean
}) {

    return (
        <Form
            onSubmit={props.onSubmit}>
        <Form.Group className={"mt-3"}>
            <Form.Label>
                {"Email Address"}
            </Form.Label>
            <Form.Control
                type={"email"}
                placeholder={"example@skogkurs.no"}
                onChange={e => props.setEmail(e.target.value)}
                disabled={props.loading}
                required
            />
        </Form.Group>
        <Button
            type={"submit"}
            className={"mt-3 w-100"}
            disabled={props.loading}
        >{"Sign In"}</Button>
        </Form>
    )
}

/**
 * The error message that is displayed when the sign in link could not be sent
 */
function ErrorMessage(props: {email: string}) {
    return (
        <Col className={"text-center mt-3"}>
            <MdUnsubscribe size={"3em"} />
            <p>{"Error sending sign in link to "}
                <strong>{props.email}</strong>
            </p>
            <p>{"A likely cause is that the particular email address has not been pre-approved by the administrator"}</p>
        </Col>
    )
}

/**
 * The success message that is displayed when the sign in link has been sent
 */
function SuccessMessage(props: {email: string}) {
    return (
        <Col className={"text-center"}>
            <MdMarkEmailRead size={"6em"}/>
            <p>{"Email with login link sent to "}
                <strong>{props.email}</strong>
                {". Check your inbox and proceed by clicking the link. This window can be closed."}</p>
        </Col>
    )
}

/**
 * The loading spinner that is displayed when the sign in link is being sent
 */
export function LoadingSpinner() {
    return (
        <Col className={"text-center mt-3"}>
            <Spinner />
        </Col>
    )
}