import {ResultCard} from "./ResultCard";
import {FcMultipleInputs} from "react-icons/fc";
import {MdForest, MdLandscape, MdPrecisionManufacturing} from "react-icons/md";
import React from "react";
import {Button, Col, Row, Stack} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../state/hooks";
import {setParameterPage} from "../../state/formSlice";
import {staticFieldDescriptions} from "../../data/staticFieldDescriptions";
import {InputField} from "../../containers/InputField";

export function ResultParameters() {

    type MenuOption = {
        title: string,
        icon: JSX.Element,
    }

    const menuOptions: MenuOption[] = [
        {
            title: "Bestand",
            icon: <MdForest/>
        },
        {
            title: "Kjøreforhold",
            icon: <MdLandscape/>
        },
        {
            title: "Maskin",
            icon: <MdPrecisionManufacturing/>
        }
    ]


    const children = (
        <Row>
            <Col xs={6}>
            <Stack gap={2}>
                {menuOptions.map((option, index) =>
                    <TabButton title={option.title} icon={option.icon} page={index+1}/>)}
            </Stack>
            </Col>
            <Col xs={6} className={"ps-4 pe-4"}>
                <TabContent />
            </Col>
        </Row>
    )


    return (
        <ResultCard
            icon={<FcMultipleInputs />}
            title={"Kostnadsdrivere"}
        >
            {children}
        </ResultCard>
    )
}


function TabButton(props: {
    title: string,
    icon: JSX.Element,
    page: number

}) {
    const pageNumber = useAppSelector((state) => state.form.parameterPage)
    const dispatch = useAppDispatch()

    return (
        <Button
            className={"btn-toggle ms-4 me-4 pt-1 pb-1 text-start"}
            active={pageNumber === props.page}
            onClick={() => dispatch(setParameterPage(props.page))}
        >
            <span className={"ps-2 pe-2"} style={{fontSize: '25px', color: '#5e7461'}}>
                {props.icon}
            </span>
             {props.title}
        </Button>
    )
}

function TabContent() {
    const pageNumber = useAppSelector((state) => state.form.parameterPage)

    return (
        <>
            {staticFieldDescriptions.map((data) =>
                <InputField fieldData={data} hidden={data.page !== pageNumber} />
            )}
        </>
    )
}


