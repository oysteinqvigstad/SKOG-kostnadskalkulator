import {Form, FloatingLabel, Button} from "react-bootstrap";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../state/hooks";
import {MdReplay} from "react-icons/md";
import {DropdownInput} from "@skogkalk/common/dist/src/parseTree";
import {selectInputFieldValue} from "../../state/treeSelectors";
import {setField} from "../../state/treeSlice";

/**
 * The input field for a dropdown input
 * @param fieldData - the data for the field, including the title and properties
 */
export function InputDropdown({node}: {node: DropdownInput}) {
    // Get the default value for the field from the store
    const fieldValue = useAppSelector(selectInputFieldValue(node.id))
    // Get the dispatch function from the store
    const dispatch = useAppDispatch()
    // whole form has been validated
    const formValidated = useAppSelector((state) => state.form.validated)

    const onChange = (e: React.ChangeEvent<any>) => {
        dispatch(setField({id: node.id, value: e.target.value}))
        e.target.blur()
        e.currentTarget.blur()
    }

    return (
            <FloatingLabel label={node.name} >
                <Form.Select
                    aria-label={`dropdown ${node.name}`}
                    className="field"
                    // style={{fontWeight: (fieldValue !== fieldData.default) ? 'bold' : 'normal'}}
                    value={fieldValue ?? ""}
                    onChange={onChange}>
                    <option value="" disabled>Velg et alternativ</option>
                    {node.dropdownAlternatives.map(({value, label}) => <option value={value}>{label}</option>)}
                </Form.Select>
                <Button
                    // TODO
                    // onClick={() => dispatch(setField({id: fieldData.title, value: fieldData.default ?? ""}))}
                    hidden={node.value === node.defaultValue}
                    className={"reset-button"}
                    style={{
                        position: 'absolute',
                        right: (isNaN(parseInt(fieldValue)) || formValidated) ? '50px' : '25px',
                        border: 'none',
                        top: '11%',
                    }}
                >
                    <MdReplay />
                </Button>
            </FloatingLabel>

    )
}