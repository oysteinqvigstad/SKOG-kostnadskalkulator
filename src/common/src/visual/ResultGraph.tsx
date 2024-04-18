import {Col, Form, Row} from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import React, {useState} from "react";
import {ApexOptions} from "apexcharts";
import {FcIdea} from "react-icons/fc";
import {ResultCard} from "./ResultCard";
import {
    DropdownInput,
    getNodeByID,
    getResultsForInputs,
    InputNode,
    NodeType,
    OutputNode,
    TreeState
} from "../parseTree";
import {GraphDisplayNode} from "../parseTree";
import {isDropdownInputNode} from "../parseTree/nodes/inputNode";


function selectGraphXAxisInput(input: InputNode | undefined) {
    if(input === undefined) {
        return { labels: [], values: [] }
    }
    if(isDropdownInputNode(input)) {
        return {
            labels: (input as DropdownInput).dropdownAlternatives.map(d=>d.label),
            values: (input as DropdownInput).dropdownAlternatives.map(d=>d.value.toString())
        }
    } else {
        const steps = 5;
        const baseValue = input.value;
        const stepSize = Math.ceil(baseValue * 0.1);
        const range = [];
        for(let i = -steps; i<= steps; i++) {
            range.push((i*stepSize + baseValue).toString());
        }
        return {
            labels: range,
            values: range
        }
    }
}



export function ResultGraph(
    props: { treeState: TreeState, displayData: GraphDisplayNode }
) {

    // const inputs = displayData.inputNames.map(input=>{
    //     return getInputByPageAndIndex(props.treeState!, input.page, input.ordering);
    // })
    const inputs = props.treeState?.inputs;

    const [selection, setSelection] : [InputNode | undefined, any] = useState(inputs?.[0] ?? undefined);
    const outputIDs = props.displayData.inputs.map(node=>{
        if(node.type === NodeType.Reference) {
            return getNodeByID(props.treeState, node.id)?.id || "";
        } else {
            return node.id;
        }
    })


    const value = "value?"; // Usikker på hva denne er til

    const series : { labels: string[], values: string[] } = selectGraphXAxisInput(selection);
    const xValues = series.values.map(v=>parseInt(v));
    const results = getResultsForInputs(props.treeState, selection?.id || "", xValues);

    const [showCost, setShowCost] = useState<boolean>(false) // velge mellom kostnad eller produktivitet


    const chartSeries: ApexAxisChartSeries = results
        ?.filter((entry)=>{return outputIDs.includes(entry.outputID)})
        .map(entry=>{
        const output = getNodeByID(props.treeState, entry.outputID);
        return {
            name: (output as OutputNode).name,
            data: entry.values,
            color: (output as OutputNode).color
        }
    }) || [];

    const children = (
        <>
            <Form>
                <Row className={"row-gap-2 mb-4"}>
                    <Col md={12} lg={12}>
                        <Form.Text>{"Velg kostnadsdriver:"}</Form.Text>
                        <Form.Select
                            aria-label={`select field to draw graph for`}
                            value={selection?.name}
                            onChange={e => {
                                const input = inputs.find(i=>i.name === e.currentTarget.value);
                                setSelection(input);
                            }}
                        >
                            {inputs.map((input, index) => <option key={input?.id} value={input?.name}>{input?.name}</option>)}
                        </Form.Select>
                    </Col>

                    {/*<Col md={12} lg={12}>*/}

                    {/*    <Row>*/}
                    {/*        <Form.Text>{"Velg resultattype:"}</Form.Text>*/}
                    {/*    </Row>*/}
                    {/*    <Row>*/}
                    {/*        <ButtonGroup aria-label="Basic example" className={"d-inline"} >*/}
                    {/*            <Button*/}
                    {/*                className={"btn-toggle"}*/}
                    {/*                active={!showCost}*/}
                    {/*                onClick={() => setShowCost(false)}*/}
                    {/*            >*/}
                    {/*                {"Produktivitet"}*/}
                    {/*            </Button>*/}
                    {/*            <Button*/}
                    {/*                className={"btn-toggle"}*/}
                    {/*                active={showCost}*/}
                    {/*                onClick={() => setShowCost(true)}*/}
                    {/*            >*/}
                    {/*                {"Kostnad"}*/}
                    {/*            </Button>*/}
                    {/*        </ButtonGroup>*/}
                    {/*    </Row>*/}
                    {/*</Col>*/}
                </Row>
            </Form>
            <DrawGraph
                series={chartSeries}
                xLabels={series.labels}
                xUnit={selection?.unit ?? "XUnit"}
                yUnit={showCost ? "unit" : "annen unit"} // popup unit
                yLabel={showCost ? 'Kostnad' : 'Produktivitet'}

                actualValue={value}
            />
        </>
    )

    return (
        <ResultCard
            icon={<FcIdea />}
            title={props.displayData.name}
            children={children}
            infoText={props.displayData.infoText ?? ""}/>
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
            height={250}
        />
    )

}

