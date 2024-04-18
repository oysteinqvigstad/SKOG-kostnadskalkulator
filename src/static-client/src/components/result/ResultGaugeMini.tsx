import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {ResultListItem} from "../../types/ResultListItem";

export function ResultGaugeMini(prop: {item: ResultListItem}) {
    const options3: ApexOptions = {
        chart: {
            height: 280,
            type: "radialBar",
        },
        series: [prop.item.percentage ?? 0],
        labels: [prop.item.text],
        colors: [prop.item.color ?? '#008FFB'],
        plotOptions: {
            radialBar: {
                startAngle: -70,
                endAngle: 70,
                track: {
                    background: '#c4c4c4',
                    startAngle: -70,
                    endAngle: 70,
                },
                dataLabels: {
                    name: {
                        show: true,
                        color: 'black',
                    },
                }
            }
        },
        title: {
            text: prop.item.value.toFixed(0),
            align: "center",
            margin: 0,
            offsetY: 90,
            style: {
                fontSize: '20px'
            }

        },
        subtitle: {
            text: prop.item.unit,
            align: "center",
            margin: 0,
            offsetY: 110,
        },
        stroke: {
            lineCap: "round"
        },
    };
    return (
        <ReactApexChart
            options={options3}
            series={options3.series}
            type="radialBar"
            height={200}
            />
    )
}