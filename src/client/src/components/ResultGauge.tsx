import React from "react";
import GaugeComponent from "react-gauge-component";

export function ResultGauge({productivity}: {productivity: number}) {
    const formatText = (value: number) => {
        return `${value}`
    }
   return (
            <GaugeComponent
                arc={{
                    nbSubArcs: 150,
                    width: 0.3,
                    padding: 0.003,
                    subArcs: [
                        { limit: 15, color: "#EA4228"},
                        { limit: 30, color: "#F5CD19"},
                        { color: "#5BE12C"},
                    ]
                }}
                labels={{
                    valueLabel: {
                        matchColorWithArc: true,
                        formatTextValue: formatText,
                        maxDecimalDigits: 1
                    },
                    tickLabels: {
                        type: "outer",
                        ticks: [
                            { value: 0 },
                            { value: 15 },
                            { value: 30 },
                            { value: 50 },
                        ],
                    }
                }}
                value={productivity}
                maxValue={50}
            />
   )

}