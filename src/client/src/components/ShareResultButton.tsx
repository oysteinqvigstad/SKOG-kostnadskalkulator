import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link45deg} from "react-bootstrap-icons";
import React from "react";
import {useAppSelector} from "../state/hooks";

/**
 * ShareResultButton is a button that copies the current url to the clipboard
 */
export function ShareResultButton() {
    // Get the fields from the store
    const fields = useAppSelector((state) => state.form.fields)

    /**
     * copyToClipboard copies the current url to the clipboard
     */
    const copyToClipboard = async () => {
        try {
            const queries = Object.entries(fields).map(([key, value]) => {
                return `${key.replaceAll(" ", "%20")}=${value}`
            }).join("&")
            const url = `${window.location.origin}/resultat?${queries}`
            await navigator.clipboard.writeText(url);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    }

    return (
        <OverlayTrigger
            trigger={"click"}
            overlay={<Tooltip>Link kopiert til utklippstavle</Tooltip>}
            placement={"top"}
            delay={{show: 250, hide: 400}}
        >
            <Button onClick={() => copyToClipboard()}>
                {"Opprett lenke til resultatet"}<Link45deg className={"ms-2"}/>
            </Button>
        </OverlayTrigger>
    )
}