import {ReteFunctions} from "../../rete/editor";
import {Button, Modal, Spinner, Table} from "react-bootstrap";
import {useGetCalculatorsInfoQuery} from "../../state/store";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";

export function NavBarLoadDialogue(props: {
    show: boolean,
    onHide: () => void,
    functions: ReteFunctions | null
}) {
    return (
       <Modal
           show={props.show}
           onHide={props.onHide}
       >
           <Modal.Header closeButton>
               {"Load Calculator"}
           </Modal.Header>
           <Modal.Body>
               <Button
                   onClick={() => props.functions?.load()}

               >{"Load from browser local store"}</Button>
                <TableFromAPI />
           </Modal.Body>
       </Modal>
    )
}

function TableFromAPI() {
    const {data, error, isLoading} = useGetCalculatorsInfoQuery()

    return (
        <Table>
            <thead>
            <tr>
                <th>Name</th>
                <th className={"text-end"}>Version</th>
                <th className={"text-end"}>Published</th>
            </tr>
            </thead>
            <tbody>
            {isLoading && <Spinner />}
            {data && data.map((calculator) => <TableRow calculator={calculator} />)}
            </tbody>
            </Table>
            )
}

function TableRow({calculator}: {calculator: Calculator}) {
    const version: string = [
        calculator.version / 1000000,
        calculator.version / 1000,
        calculator.version
        ].map(n => Math.floor(n).toString()).join('.')

    return (
        <tr>
            <td>{calculator.name}</td>
            <td className={"text-end"}>{version}</td>
            <td className={"text-end"}>{calculator.published ? '✓' : ''}</td>
        </tr>
    )
}