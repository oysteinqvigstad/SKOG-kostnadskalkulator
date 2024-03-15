import {Nav, Navbar} from "react-bootstrap";
import {NavBarDropdowns} from "./NavBarDropdowns";
import {FormulaInfoContainer} from "../formulaInfoContainer";
import {ReteFunctions} from "../../rete/editor";

export function NavBar(props: {functions: ReteFunctions | null}) {
    return (
        <Navbar className="bg-body-tertiary">
            <Navbar.Brand>
                Rete
            </Navbar.Brand>
            <Nav className="me-auto">
                <NavBarDropdowns functions={props.functions} />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <FormulaInfoContainer/>
                    </Navbar.Text>

                </Navbar.Collapse>
            </Nav>
        </Navbar>
    )
}