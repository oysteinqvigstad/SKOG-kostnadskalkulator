import {Alert} from "react-bootstrap";
import{MdWarning} from "react-icons/md";

import React from "react";

/**
 * A warning message for when the service is under development
 */
export function DevelopmentHeaderWarning() {
   return (
       <Alert variant={"warning"} className={"mb-0 p-1 text-center text-truncate shadow-lg rounded-0"}>
            <MdWarning className="me-2" />
           {"Tjenesten er "}
           <strong>under utvikling</strong>
           {"! Resultatene er upålitelige."}
       </Alert>
   )
}