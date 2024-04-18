import {Workbox} from "workbox-window";
import React, {useEffect, useMemo, useState} from "react";
import {Row, Toast, ToastContainer} from "react-bootstrap";
import {MdRefresh} from "react-icons/md";
import {Col} from "react-bootstrap";

/**
 * Load the service worker and display a toast when a new version is available
 */
export function LoadServiceWorker() {
    // Create a new Workbox instance as a memoized value to avoid creating a new instance on every render
    const wb = useMemo(() => new Workbox('/service-worker.js'), []);
    // State to show the update toast
    const [showUpdate, setShowUpdate] = useState(false);

    // Function to activate the new service worker
    const activateWorker = (event: React.MouseEvent<any>) => {
        event.preventDefault()
        wb.messageSkipWaiting()
    }

    /**
     * Register the service worker and set up event listeners
     */
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // Add an event listener to detect when the registered
            // service worker has installed but is waiting to activate.
            wb.addEventListener('waiting', () => {
                // Assuming the user accepted the update, set up a listener
                // that will reload the page as soon as the previously waiting
                // service worker has taken control.
                wb.addEventListener('controlling', () => {
                    // At this point, reloading will ensure that the current
                    // tab is loaded under the control of the new service worker.
                    // Depending on your web app, you may want to auto-save or
                    // persist transient state before triggering the reload.
                    window.location.reload();
                });
                setShowUpdate(true)
            });

            wb.register().then((registration) => {
                console.log('Service Worker registered: ', registration);
            }).catch((registrationError) => {
                console.log('Service Worker registration failed: ', registrationError);
            });
        }
    }, [wb]);

    return (
        <ToastContainer
            position={"top-end"}
            style={{marginTop: '110px', marginRight: '10px'}}
        >
            <Toast
                show={showUpdate}
                onClose={() => setShowUpdate(false)}
            >
                <Toast.Header>
                    <strong className={"me-auto"}>{"Ny versjon tilgjengelig"}</strong>
                </Toast.Header>
                <Toast.Body>
                    <Row>
                        <Col xs={"auto"}>
                            <MdRefresh className={"ms-2 mt-2"} size={25}/>
                        </Col>
                        <Col>
                            {"Du ser en eldre versjon av WebAppen."}
                            <br/>
                            <a href={"/"} onClick={activateWorker}>{"Klikk her for å oppdatere"} </a>
                        </Col>
                    </Row>
                </Toast.Body>
        </Toast>
        </ToastContainer>
    )

}