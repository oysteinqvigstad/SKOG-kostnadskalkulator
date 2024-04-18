import {Alert} from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import React from "react";
import {ApexOptions} from "apexcharts";
import {UnitType} from "../../types/UnitType";
import {useAppSelector} from "../../state/hooks";
import {selectCalculatorResult} from "../../state/formSelectors";
import {FcBullish} from "react-icons/fc";
import {ResultCard} from "./ResultCard";

export function ResultProductivity() {

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

    const children = (
        <>
            <DrawBar
                title="Hogstmaskin"
                value={harvesterResult.value.timberCubedPerG15Hour}
                unit={UnitType.CUBIC_M_PR_G15}
                max={50}
                color={"#008FFB"}
            />
            <DrawBar
                title="Lassbærer"
                value={loadCarrierResult.value.timberCubedPerG15Hour}
                unit={UnitType.CUBIC_M_PR_G15}
                max={50}
                color={"#00E396"}
            />
        </>
    )


    return (
        <ResultCard
            icon={<FcBullish />}
            title={"Produktivitet"}
            children={children}
        />

    )
}

function DrawBar(props: {
    title: string,
    value: number,
    unit: string,
    max: number,
    color: string,
}) {
    const options: ApexOptions = {
        chart: {
            height: 70,
            type: 'bar',
            sparkline: {
                enabled: true
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '20%',
                colors: {
                    backgroundBarColors: ['#004f59'],
                },
            },
        },
        stroke: {
            width: 0,
        },
        series: [{
            name: props.title,
            data: [props.value]
        }],
        title: {
            floating: true,
            offsetX: -10,
            offsetY: 5,
            style: {
                fontSize: '16px',
            },
            text: props.title
        },
        subtitle: {
            floating: true,
            align: 'right',
            offsetY: 5,
            offsetX: 8,
            text: `${Math.round(props.value)} ${props.unit}`,
            style: {
                fontSize: '16px',
            }
        },
        tooltip: {
            enabled: false
        },
        yaxis: {
            max: props.max
        },
        fill: {
            opacity: 1.0,
            colors: [props.color],
        },
        states: {
            hover: {
                filter: {
                    type: 'none'
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none'
                }
            }
        }
    }
    return (

        <ReactApexChart
            options={options}
            series={options.series}
            type="bar"
            height={80}
        />
        )
}