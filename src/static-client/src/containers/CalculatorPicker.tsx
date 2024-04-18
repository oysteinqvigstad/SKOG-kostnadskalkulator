import {staticCalculatorData} from "../data/staticCalculatorData";
import {CalculatorPickerDropdown} from "../components/CalculatorPickerDropdown";

export function CalculatorPicker() {
    return (
        <CalculatorPickerDropdown calculations={staticCalculatorData}/>
    )
}

export default CalculatorPicker;