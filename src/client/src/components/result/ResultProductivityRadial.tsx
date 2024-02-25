import {useAppSelector} from "../../state/hooks";
import {selectCalculatorResult} from "../../state/formSelectors";
import {Alert} from "react-bootstrap";
import React from "react";
import {ResultCard} from "./ResultCard";
import {FcBullish} from "react-icons/fc";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {UnitType} from "../../types/UnitType";

export function ResultProductivityRadial() {

    const {harvesterResult, loadCarrierResult} = useAppSelector(selectCalculatorResult)

    // If the result is not ok, show an error message to user
    if(!harvesterResult.ok || !loadCarrierResult.ok) {
        return (
            <Alert variant={"warning"}>
                {"Uventet feil oppsto ved kalkulasjon. "}
                <br />
                {"Vennligst kontroller opplysningene du oppga."}
            </Alert>
        )
    }

    const options: ApexOptions = {
        chart: {
            type: "radialBar",
        },
        series: [
            harvesterResult.value.timberCubedPerG15Hour * 2,
            loadCarrierResult.value.timberCubedPerG15Hour * 2
        ],
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
            text: Math.round(Math.min(
                harvesterResult.value.timberCubedPerG15Hour,
                loadCarrierResult.value.timberCubedPerG15Hour
            )).toString(),
            align: 'center',
            floating: true,
            offsetY: 75,
            style: {
                fontSize: '40px'
            }
        },
        subtitle: {
            text: UnitType.CUBIC_M_PR_G15,
            align: 'center',
            offsetX: 2,
            offsetY: 120,
            style: {
                fontSize: '20px'
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            offsetY: -15,

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
            height={340}
        />
    )


    return (
        <ResultCard
            icon={<FcBullish />}
            title={"Produktivitet"}
            children={children}
        />

    )
}