import {Button, ButtonGroup, Col, Form, Row} from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import React, {useState} from "react";
import {ApexOptions} from "apexcharts";
import {useAppSelector} from "../../state/hooks";
import {selectCalculatorSeriesResult, selectGraphXaxis, selectXasisText} from "../../state/formSelectors";
import {FieldNames} from "../../types/FieldNames";
import {UnitType} from "../../types/UnitType";
import {staticFieldDescriptions} from "../../data/staticFieldDescriptions";
import {NumberedProperties} from "../../types/FieldData";
import {FcIdea} from "react-icons/fc";
import {ResultCard} from "./ResultCard";
import "../../App.css"

export function ResultGraph() {
    const [selection, setSelection] = useState<FieldNames>(FieldNames.VOLUM_PR_DEKAR)

    const unit = (staticFieldDescriptions.find((fieldData) => fieldData.title === selection)?.properties as NumberedProperties).unit
    const value = useAppSelector(selectXasisText(selection))
    const dropdownItems = staticFieldDescriptions
        .filter((fieldData) => fieldData.showGraph)
        .map((fieldData) => fieldData.title)

    const series = useAppSelector(selectGraphXaxis(selection))
    const results = useAppSelector(selectCalculatorSeriesResult(selection, series.values))

    const [showCost, setShowCost] = useState<boolean>(false)

    const harvesterResults = results.map((result) => {
        return !result.harvesterResult.ok ? 0
            : showCost ? result.harvesterResult.value.costPerTimberCubed
                : result.harvesterResult.value.timberCubedPerG15Hour
    })


    const loadCarrierResults = results.map((result) => {
        return !result.loadCarrierResult.ok ? 0
            : showCost ? result.loadCarrierResult.value.costPerTimberCubed
                : result.loadCarrierResult.value.timberCubedPerG15Hour
    })

    const chartSeries: ApexAxisChartSeries =
            [
        {
            name: 'Hogstmaskin',
            data: harvesterResults,
        },
        {
            name: 'Lassbærer',
            data: loadCarrierResults,
        },
    ]

    const children = (
        <>
        <Form>
            <Row className={"row-gap-2 mb-4"}>
                <Col md={12} lg={12}>
                    <Form.Text>{"Velg kostnadsdriver:"}</Form.Text>
                    <Form.Select
                        aria-label={`select field to draw graph for`}
                        value={selection}
                        onChange={e => {setSelection(e.target.value as FieldNames)}}
                    >
                        {dropdownItems.map((title) => <option value={title}>{title}</option>)}
                    </Form.Select>
                </Col>

                <Col md={12} lg={12}>

                    <Row>
                        <Form.Text>{"Velg resultattype:"}</Form.Text>
                    </Row>
                    <Row>
                        <ButtonGroup aria-label="Basic example" className={"d-inline"} >
                            <Button
                                className={"btn-toggle"}
                                active={!showCost}
                                onClick={() => setShowCost(false)}
                            >
                                {"Produktivitet"}
                            </Button>
                            <Button
                                className={"btn-toggle"}
                                active={showCost}
                                onClick={() => setShowCost(true)}
                            >
                                {"Kostnad"}
                            </Button>
                        </ButtonGroup>
                    </Row>
                </Col>
            </Row>
        </Form>
    <DrawGraph
        series={chartSeries}
        xLabels={series.labels}
        xUnit={unit ?? ""}
        yUnit={showCost ? UnitType.COST_PER_CUBIC_M : UnitType.CUBIC_M_PR_G15}
        yLabel={showCost ? 'Kostnad' : 'Produktivitet'}

        actualValue={value}
    />
        </>
    )

    return (
        <ResultCard
            icon={<FcIdea />}
            title={"Innsikt i kostnadsdrivere"}
            children={children}
        />
    )
}


function DrawGraph(
    props: {
        series: ApexAxisChartSeries
        xLabels: string[]
        xUnit: string
        yUnit: string
        yLabel: string
        actualValue: string
    }) {

    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        series: props.series,
        legend: {
            position: 'top',
        },
        xaxis: {
            categories: props.xLabels,
            title: {
                text: props.xUnit,
                offsetY: -8
            }

        },
        yaxis: {
            title: {
                text: `${props.yLabel} (${props.yUnit})`,
            },
            decimalsInFloat: 1,
        },
        annotations: {
            xaxis: [{
                x: props.actualValue,
                borderColor: '#48D1CC',
                label: {
                    borderColor: '#48D1CC',
                    offsetX: 18,
                    style: {
                        color: '#fff',
                        background: '#48D1CC',
                    },
                    text: 'Valgt verdi',
                }
            }]
        },
        tooltip: {
            x: {
                formatter: (_value: number, {dataPointIndex}) => `${props.xLabels[dataPointIndex]} ${props.xUnit}`
            },
            y: {
                formatter: (value) => `${Math.round(value)} ${props.yUnit}`
            }
        }
    }



    return (
        <ReactApexChart
            options={chartOptions}
            series={props.series}
            type="line"
            height={300}
        />
    )

}
