import Container from "react-bootstrap/Container";
import {InputGroup, Row} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {selectPages} from "../state/store";
import {TextInputField} from "../components/input/textInputField";
import {addPage, movePage, Page, removePage, setPageSelection, updatePage} from "../state/slices/pages";
import Button from "react-bootstrap/Button";

export function PageBox(
    props: {
        page: Page,
        onChange: (newTitle: string) => void,
        onMove: (newIndex: number) => void,
        onDelete: () => void
    }
) {
    const dispatch = useAppDispatch();



    return <Row>
        <InputGroup>
            <TextInputField value={props.page.title} inputHint={"Page name"} onChange={(newTitle) => {props.onChange(newTitle);}}/>
            <Button onClick={()=>{props.onMove(props.page.ordering-1)}}>Up</Button>
            <Button onClick={()=>{props.onMove(props.page.ordering+1)}}>Down</Button>
            <Button onClick={()=>{props.onDelete()}}>X</Button>
            <Button onClick={()=>{dispatch(setPageSelection(props.page.ordering))}}>Edit</Button>
        </InputGroup>
    </Row>
}


export function PagesWindow() {
    const pages = useAppSelector(selectPages);
    const dispatch = useAppDispatch();


    return <>
        <Container>
            <Row>
                <Button onClick={()=>{dispatch(addPage({title: "", ordering: 1, subPages:[], inputIds:[]}))}}>Add page</Button>
            </Row>
            {pages.map(({id, page}, index) => {
                return <Row key={id}>
                    <PageBox
                        page={page}
                        onChange={(newTitle)=>{
                            dispatch(updatePage({...page, title: newTitle}))
                        }}
                        onMove={(newIndex)=>{
                            dispatch(movePage({oldIndex: page.ordering, newIndex: newIndex}))
                        }}
                        onDelete={()=>{dispatch(removePage(page.ordering))}}
                    />
                </Row>
            })}
        </Container>
    </>
}