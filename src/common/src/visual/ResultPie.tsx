import {FcSalesPerformance} from "react-icons/fc";
import React from "react";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {ResultCard} from "./ResultCard";
import {DisplayPieNode, getNodeByID, TreeState} from "../parseTree";
import {ResultRowBoxes} from "./ResultRowBoxes";
import {OutputNode as ParseOutputNode} from "../parseTree";



export function ResultPie(props: {
    treeState: TreeState | undefined,
    displayData: DisplayPieNode,
}) {
    const nodes = props.displayData.inputOrdering.map((value)=>{
        const node = getNodeByID(props.treeState!, value.outputID) as ParseOutputNode;
        return { color: node.color, ordering: value.ordering, label: value.outputLabel, value: node.value, unit: props.displayData.unit }
    }).sort((a, b)=>(a.ordering ?? 0) - (b.ordering??0));

    const labels = nodes.map(node=>node.label);
    const values = nodes.map(node=>node.value);
    const colors = nodes.map(node=>node.color);

    const totalCost = Math.round(
        values.reduce((acc, cost) => acc + cost, 0)
    )

    const options: ApexOptions = {
        series: values,
        chart: {
            type: props.displayData.pieType || "donut",
        },
        labels: labels,
        colors: colors,
        title: {
            text: totalCost.toString(),
            align: 'center',
            floating: true,
            offsetY: props.displayData.unit ? 85 : 75,
            style: {
                fontSize: '40px'
            }
        },
        subtitle: {
            text: props.displayData.unit,
            align: 'center',
            offsetX: 2,
            offsetY: 130,
            style: {
                fontSize: '20px'
            }
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
            position: 'bottom',
            formatter(legendName: string, opts?: any): string {
                return `${legendName}: ${Math.round(values[opts.seriesIndex] ?? 0)}`
            }
        },
        plotOptions: {

            pie: {
                offsetY: -20,
                expandOnClick: false,
            },
        },
        states: {
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none'
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return `${Math.round(val)} ${props.displayData.unit}`
                }
            }
        }
    };

    const children = (
        <ReactApexChart
            options={options}
            series={options.series}
            type="donut"
            height={250}
            style={{paddingBottom: '20px'}}
        />
    )

    return (
        <ResultCard
            icon={<FcSalesPerformance />}
            title={props.displayData.name}
            infoText={props.displayData.infoText || ""}
        >
            {children}
            <ResultRowBoxes
                result={nodes.map(node=>{return {color: node.color, label: node.label, value: node.value}})}
                unit={props.displayData.unit}
            />
        </ResultCard>

    )
}