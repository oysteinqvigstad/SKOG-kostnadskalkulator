import {FcSalesPerformance} from "react-icons/fc";
import React from "react";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {ResultCard} from "./resultCard";
import {DisplayNode} from "@skogkalk/common/dist/src/parseTree/nodes/displayNode";
import {getNodeByID, TreeState} from "@skogkalk/common/dist/src/parseTree";
import {isOutputNode} from "@skogkalk/common/dist/src/parseTree/nodes/outputNode";
import {OutputNode} from "@skogkalk/common/dist/src/parseTree"
/**
 * `ResultListItem` is an interface that is used to define the structure of the result list items.
 */
export interface ResultListItem {
    text: string
    value: number
    unit: string
    percentage?: number
    color?: string
}


export interface DisplayPieNode extends DisplayNode {
    unit: string
    pieType: "pie" | "donut"
}

export function ResultPie(props: {
    treeState: TreeState | undefined,
    displayData: DisplayPieNode,
}) {
    // const outputs = props.displayData.inputs.map(node=>{
    //     if(isOutputNode(node)) {
    //         return node as OutputNode
    //     } else {
    //         const derefNode = getNodeByID(props.treeState, node.referenceID);
    //         if(derefNode !== undefined && isOutputNode(derefNode)) {
    //             return derefNode as OutputNode;
    //         }
    //     }
    //     throw new Error("Invalid node type found in input to visualization");
    // })

    const labels = props.displayData.inputOrdering
        .sort((a, b)=>{ return (a.ordering ?? 0) - (b.ordering ?? 0)})
        .map((value)=>{
            return value.outputLabel
        });
    const values = props
        .displayData.inputOrdering
        .map((value)=>{
            if(props.treeState) {
                return getNodeByID(props.treeState, value.outputID)?.value || 0
            } else {
                return 0;
            }
        })
    const totalCost = Math.round(
        values.reduce((acc, cost) => acc + cost, 0)
    )

    const options: ApexOptions = {
        series: values,
        chart: {
            type: props.displayData.pieType || "donut",
        },
        labels: labels,
        title: {
            text: totalCost.toString(),
            align: 'center',
            floating: true,
            offsetY: 85,
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
            title={"Kostnad"}
        >
            {children}
            {/*<ResultRowBoxes listItems={props.costCategories} />*/}
        </ResultCard>

    )
}