import {FcSalesPerformance} from "react-icons/fc";
import React from "react";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {ResultCard} from "./ResultCard";
import {ResultListItem} from "../../types/ResultListItem";

export function ResultCost(props: {
    costCategories: ResultListItem[]
}) {
    const labels = props.costCategories.map((cost) => cost.text)
    const costs = props.costCategories.map((cost) => cost.value)
    const totalCost = Math.round(
        props.costCategories.reduce((acc, cost) => acc + cost.value, 0)
    )

    const options: ApexOptions = {
        series: costs,
        chart: {
            type: 'donut',
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
            text: props.costCategories[0]?.unit ?? "",
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
                return `${legendName}: ${Math.round(props.costCategories[opts.seriesIndex]?.value ?? 0)}`
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
                    return `${Math.round(val)} ${props.costCategories[0]?.unit ?? ""}`
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