import {InputGroup} from "react-bootstrap";
import {TextInputField} from "../components/input/textInputField";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {selectFormulaInfo} from "../state/store";
import {increaseMajorVersion, increaseMinorVersion, increasePatchVersion, setName} from "../state/slices/formulaInfo";
import Button from "react-bootstrap/Button";


export function FormulaInfoContainer(
    ) {
    const formulaInfo = useAppSelector(selectFormulaInfo);
    const dispatch = useAppDispatch();
    return <InputGroup size="sm">
            <TextInputField
                value={formulaInfo.name}
                inputHint={"Formula name"}
                onChange={(newName: string) => {
                    dispatch(setName(newName));
                }}
                isValid={text=> { return text !== ""}}


            />
            <InputGroup.Text id="inputGroup-sizing-sm">
                {`Version: ${formulaInfo.version.major}.${formulaInfo.version.minor}.${formulaInfo.version.patch}`}
            </InputGroup.Text>
            <Button
                onClick={
                    ()=>{
                        dispatch(increaseMajorVersion());
                    }
                }
            >+ Major</Button>
        <Button
            onClick={
                ()=>{
                    dispatch(increaseMinorVersion());
                }
            }
        >+ Minor</Button>
        <Button
            onClick={
                ()=>{
                    dispatch(increasePatchVersion());
                }
            }
        >+ Patch</Button>
        </InputGroup>
}

