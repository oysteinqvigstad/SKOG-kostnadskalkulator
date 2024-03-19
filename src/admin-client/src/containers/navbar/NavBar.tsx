import {Nav, Navbar} from "react-bootstrap";
import {NavBarDropdowns} from "./NavBarDropdowns";
import {FormulaInfoContainer} from "../formulaInfoContainer";
import {ReteFunctions} from "../../rete/createEditor";

export function NavBar(props: {functions: ReteFunctions | null}) {
    return (
        <Navbar className="bg-body-tertiary">
            <Navbar.Brand className={"ms-4"}>
                Rete
            </Navbar.Brand>
            <Nav className="me-auto align-items-center">
                <NavBarDropdowns functions={props.functions} />
                <FormulaInfoContainer/>
            </Nav>
        </Navbar>
    )
}