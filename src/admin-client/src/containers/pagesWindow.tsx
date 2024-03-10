import Container from "react-bootstrap/Container";
import {InputGroup, Row} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {selectPages} from "../state/store";
import {TextInputField} from "../components/input/textInputField";
import {addPage, movePage, Page, removePage, updatePage} from "../state/slices/pages";
import Button from "react-bootstrap/Button";

export function PageBox(
    props: {
        page: Page,
        onChange: (newTitle: string) => void,
        onMove: (newIndex: number) => void,
        onDelete: () => void
    }
) {
    return <Row>
        <InputGroup>
            <TextInputField value={props.page.title} inputHint={"Page name"} onChange={(newTitle) => {props.onChange(newTitle)}}/>
            <Button onClick={()=>{props.onMove(props.page.ordering-1)}}>Up</Button>
            <Button onClick={()=>{props.onMove(props.page.ordering+1)}}>Down</Button>
            <Button onClick={()=>{props.onDelete()}}>X</Button>
        </InputGroup>
    </Row>
}


export function PagesWindow(
    props: {}
) {
    const pages = useAppSelector(selectPages);
    const dispatch = useAppDispatch();



    return <>
        <Container>
            <Row>
                <Button onClick={()=>{dispatch(addPage({title: "", ordering: 1, subPages:[]}))}}>Add page</Button>
            </Row>
            {pages.map((page, index) => {
                return <Row key={page.title}>
                    <PageBox
                        page={page}
                        onChange={(newTitle)=>{
                            dispatch(updatePage({...page, title: newTitle}))
                        }}
                        onMove={(newIndex)=>{
                            dispatch(movePage({oldIndex: page.ordering, newIndex: newIndex}))
                            console.log(pages.map((p)=>p.title))
                        }}
                        onDelete={()=>{dispatch(removePage(page.ordering))}}
                    />
                </Row>
            })}
        </Container>
    </>
}