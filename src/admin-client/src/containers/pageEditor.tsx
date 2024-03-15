import {Card, Row} from "react-bootstrap";
import {selectPages, selectPageSelection} from "../state/store";
import {useAppSelector} from "../state/hooks";
import Container from "react-bootstrap/Container";


export function PageEditor() {
    const pages = useAppSelector(selectPages);
    const selectedPageIndex = useAppSelector(selectPageSelection);
    const selectedPage = pages[selectedPageIndex??0]?.page;

    return (
        <Card>
            <Card.Title>
                {`Page: ${selectedPage?.title || "No page selected"}`}
            </Card.Title>
            <Card.Body>
                <div>
                </div>
                <Container>
                    {selectedPage?.inputIds.map((id, index) => {
                        return <Row>{id}</Row>
                    })}
                </Container>
            </Card.Body>
        </Card>
    );
}