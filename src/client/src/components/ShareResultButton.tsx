import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {MdShare} from "react-icons/md"
import React from "react";
import {useAppSelector} from "../state/hooks";

/**
 * ShareResultButton is a button that copies the current url to the clipboard
 */
export function ShareResultButton() {
    // Get the fields from the store
    const fields = useAppSelector((state) => state.form.fields)

    const share = async () => {
        // create share url
        const queries = Object.entries(fields).map(([key, value]) => {
            return `${key.replaceAll(" ", "%20")}=${value}`
        }).join("&")
        const url = `${window.location.origin}/resultat?${queries}`

        try {
            // copy to clipboard
            await navigator.clipboard.writeText(url);

            // open share context menu if possible
            if (navigator.canShare({url: url})) {
                await navigator.share({url: url})
            }
        } catch (err) {
            // error triggers if share context menu is cancelled
            console.error('Failed to share!', err);
        }
    }

    return (
        <>
            <OverlayTrigger
                trigger={"click"}
                overlay={<Tooltip>Link kopiert til utklippstavle</Tooltip>}
                placement={"top"}
                delay={{show: 250, hide: 400}}
            >
                <Button onClick={() => share()}>
                    <MdShare />
                </Button>
            </OverlayTrigger>
    </>
    )
}