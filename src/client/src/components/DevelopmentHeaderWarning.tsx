import {Alert} from "react-bootstrap";
import {ExclamationTriangle} from "react-bootstrap-icons";
import React from "react";

export function DevelopmentHeaderWarning() {
   return (
       <Alert variant={"warning"} className={"mb-0 p-1 text-center text-truncate shadow-lg rounded-0"}>
            <ExclamationTriangle className="me-2" />
           {"Tjenesten er "}
           <strong>under utvikling</strong>
           {"! Resultatene er upålitelige."}
       </Alert>
   )
}