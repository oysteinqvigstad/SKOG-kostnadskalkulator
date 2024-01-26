import {inputFieldData} from "../constants/FieldData";
import {InputField} from "../containers/InputField";
import {Button} from "react-bootstrap";
import React from "react";

export function InputPage(props: {setPageNumber: (e: React.MouseEvent, n: number) => void}) {
    return (
        <>
        {inputFieldData.map((data) => <InputField fieldData={data} />)}
        <div className="d-grid gap-2">
            <Button onClick={e => props.setPageNumber(e, 1)}>Beregn</Button>
        </div>
        </>
    )
}

