import {Card, Row} from "react-bootstrap";
import {selectPages, selectPageSelection, selectTreeState} from "../state/store";
import {useAppSelector} from "../state/hooks";
import Container from "react-bootstrap/Container";
import {getNodeByID, InputNode} from "@skogkalk/common/dist/src/parseTree";
import {InputFieldPreview} from "@skogkalk/common/dist/src/visual/inputField/InputField";


export function PageEditor() {
    const tree = useAppSelector(selectTreeState);
    const pages = useAppSelector(selectPages);
    const selectedPageIndex = useAppSelector(selectPageSelection);
    const selectedPage = pages[selectedPageIndex??0]?.page;

    return (
        <Card>
            <Card.Title>
                {`Page: ${selectedPage?.title || "No page selected"}`}
            </Card.Title>
            <Card.Body>
                <Container>
                    {selectedPage?.inputIds.map((id, index) => {
                        console.log(id);
                        if(tree.tree) {
                            const input = getNodeByID(tree.tree, id) as InputNode;
                            if(!input) { return null }
                            return <Row key={id}>
                                <InputFieldPreview node={input}/>
                            </Row>
                        } else {
                            throw new Error("Tree not loaded");
                        }

                    })}
                </Container>
            </Card.Body>
        </Card>
    );
}