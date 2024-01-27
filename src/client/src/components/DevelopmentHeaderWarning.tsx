import {Alert} from "react-bootstrap";
import {ExclamationTriangle} from "react-bootstrap-icons";
import React from "react";

export function DevelopmentHeaderWarning() {
   return (
       <Alert variant={"warning"} className={"mb-0 pt-1 pb-1 text-center text-truncate"} style={{borderRadius: "0"}}>
            <ExclamationTriangle className="me-2" />
            Tjenesten er <strong>under utvikling</strong>! Resultatene er svært upålitlige.
       </Alert>
   )
}