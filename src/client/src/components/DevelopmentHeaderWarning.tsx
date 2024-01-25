import {Alert} from "react-bootstrap";
import {ExclamationTriangle} from "react-bootstrap-icons";
import React from "react";

export function DevelopmentHeaderWarning() {
   return (
       <Alert key="warning" variant="warning" className="text-center">
            <ExclamationTriangle className="me-2" />
            Kostnadskalkulatoren er <strong>under utvikling!</strong> Ikke forvent at den fungerer eller er korrekt.
        </Alert>
   )
}