import {Alert, Card, Col, Row} from "react-bootstrap";
import {FcSalesPerformance} from "react-icons/fc";
import React from "react";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {useAppSelector} from "../../state/hooks";
import {selectCalculatorResult} from "../../state/formSelectors";
import {UnitType} from "../../types/UnitType";

export function ResultCost() {
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

    const harvesterCost = Math.round(harvesterResult.value.costPerTimberCubed)
    const forwarderCost = Math.round(loadCarrierResult.value.costPerTimberCubed)

    const options: ApexOptions = {
        series: [harvesterCost, forwarderCost, 0],
        chart: {
            type: 'donut',

        },
        labels: ['Hogstmaskin', 'Lassbærer', 'Annet'],
        title: {
            text: `${harvesterCost + forwarderCost}`,
            align: 'center',
            floating: true,
            offsetY: 100,
            style: {
                fontSize: '40px'
            }
        },
        subtitle: {
            text: UnitType.COST_PER_CUBIC_M,
            align: 'center',
            offsetX: 2,
            offsetY: 145,
            style: {
                fontSize: '20px'
            }
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: 'bottom'
        },
        plotOptions: {

            pie: {
                expandOnClick: false,
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
            y: {
                formatter: function (val: number) {
                    return `${val} ${UnitType.COST_PER_CUBIC_M}`
                }

            }
        }
    };
    return (
        <Card>
            <Card.Body>
                <Row className={"align-items-center"}>
                    <Col xs={1}>
                        <FcSalesPerformance style={{fontSize: '1.5em'}}/>
                    </Col>
                    <Col>
                        <h5 className={"m-0 pt-1"}>
                            {"Kostnad"}
                        </h5>
                    </Col>
                </Row>
                <ReactApexChart
                    options={options}
                    series={options.series}
                    type="donut"
                    height={300}
                />

            </Card.Body>
        </Card>
    )
}