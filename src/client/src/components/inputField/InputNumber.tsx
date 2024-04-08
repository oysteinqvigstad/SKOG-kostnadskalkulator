import React, {useEffect} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
import '../../App.css'
import {useAppDispatch, useAppSelector} from "../../state/hooks";
import {MdReplay} from "react-icons/md";
import {resetField, setField} from "../../state/treeSlice";
import {selectInputFieldValue} from "../../state/treeSelectors";
import {NumberInputNode} from "@skogkalk/common/dist/src/parseTree/nodes/inputNode";
import {isValidValue} from "@skogkalk/common/dist/src/parseTree";

/**
 * The input field for a numerical input
 * @param fieldData - the data for the field, including the title and properties
 */
export function InputNumber({node}: {node: NumberInputNode}) {
    // Get the default value for the field from the store
    const fieldValue = useAppSelector(selectInputFieldValue(node.id))

    // Get the dispatch function from the store
    const dispatch = useAppDispatch()
    // callback function for changing input value





    // field value is kept in local state because we don't want to update the
    // node value until all the digits have been entered
    const [value, setValue] = React.useState<string>(fieldValue)

    const onChange = (e: React.ChangeEvent<any>) => {
        setValue(e.target.value)
        console.log(isInvalid)
    }

    useEffect(() => {
        setValue(fieldValue)
    }, [fieldValue]);

    const isInvalid =  !isValidValue(node, parseFloat(value))

    const onKeyPress = (e: React.KeyboardEvent<any>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.currentTarget.blur()
            console.log(e.currentTarget.value)
            if (!isInvalid) {
                dispatch(setField({id: node.id, value: e.currentTarget.value}))
            }
        }
    }

    const onUnfocus = (e: React.FocusEvent<any>) => {
        if (!isInvalid) {
            dispatch(setField({id: node.id, value: e.currentTarget.value}))
        }
    }

    const onReset = () => {
        dispatch(resetField({id: node.id}))
        setValue(fieldValue)
    }

    return (
        <>
            <Form.Floating style={{color: '#6f7174'}}>
                <Form.Control
                    className={"field"}
                    // style={{fontWeight: (fieldValue !== fieldData.default) ? 'bold' : 'normal'}}
                    placeholder="value"
                    aria-describedby={`input ${node.name}`}
                    type={"number"}
                    inputMode={"numeric"}
                    pattern="[0-9]*"
                    value={value}
                    isInvalid={isInvalid}
                    onChange={e => onChange(e)}
                    onKeyPress={e => onKeyPress(e)}
                    onBlur={e => onUnfocus(e)}
                    required
                />
                <label>{node.name}</label>
            </Form.Floating>
            <Button
                // TODO: Reset!
                onClick={() => onReset()}
                hidden={parseFloat(value) === node.defaultValue}
                className={"reset-button"}
                style={{
                    position: 'absolute',
                    right: (isInvalid) ? '100px' : '80px',
                    zIndex: 5,
                    border: 'none',
                    top: '11%',
            }}
            >
                <MdReplay />
            </Button>

            <InputGroup.Text
                className={"justify-content-center"}
                style={{width: '5rem'}}>
                    {node.unit}
            </InputGroup.Text>
        </>
    )
}