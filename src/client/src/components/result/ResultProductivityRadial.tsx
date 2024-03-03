import React from "react";
import {ResultCard} from "./ResultCard";
import {FcBullish} from "react-icons/fc";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {UnitType} from "../../types/UnitType";
import {ResultListItem} from "../../types/ResultListItem";

export function ResultProductivityRadial(props: {
    productivityItems: ResultListItem[]
}) {

    const productivityPercentages = props.productivityItems.map((productivity) => productivity.percentage ?? 0)
    const minimumValue = Math.min(...props.productivityItems.map((productivity) => productivity.value))


    const options: ApexOptions = {
        chart: {
            type: "radialBar",
        },
        series: productivityPercentages,
        plotOptions: {
            radialBar: {
                offsetY: -41,
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                }

            }
        },
        labels: ['Hogstmaskin', 'Lassbærer'],
        title: {
            text: Math.round(minimumValue).toString(),
            align: 'center',
            floating: true,
            offsetY: 85,
            style: {
                fontSize: '40px'
            }
        },
        subtitle: {
            text: props.productivityItems[0]?.unit ?? "",
            align: 'center',
            offsetX: 2,
            offsetY: 130,
            style: {
                fontSize: '20px'
            }
        },
        legend: {
            show: false,
            position: 'bottom',
            offsetY: -15,
            formatter(seriesName: string, opts: any) {
                return `${seriesName}: ${Math.round(props.productivityItems[opts.seriesIndex]?.value ?? 0)}`
            }

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
            enabled: true,
            theme: 'dark',
            y: {
                formatter: function (val: number) {
                    return `${Math.round(val/2)} ${UnitType.COST_PER_CUBIC_M}`
                }
            }
        }
    };

    const children = (
        <ReactApexChart
            options={options}
            series={options.series}
            type="radialBar"
            height={290}
        />
    )


    return (
        <ResultCard
            icon={<FcBullish />}
            title={"Produktivitet"}
        >
            {children}
            {/*<ResultRowBoxes listItems={props.productivityItems} />*/}
        </ResultCard>


    )
}