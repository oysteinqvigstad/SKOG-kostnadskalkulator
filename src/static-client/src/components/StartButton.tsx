import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export function StartButton() {
    const navigate = useNavigate()
    return (
        <Button variant="primary" size="lg" onClick={() => navigate("/kalkulator")}>
            Start kalkulatoren
        </Button>
    )
}