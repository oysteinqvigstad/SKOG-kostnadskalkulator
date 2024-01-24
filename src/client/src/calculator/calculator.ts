export class CalcResult {
    costPerTimberCubed:number
    timberCubedPerG15Hour:number
    constructor(costPerTimberCubed:number, timberCubedPerG15Hour:number) {
        this.costPerTimberCubed = costPerTimberCubed
        this.timberCubedPerG15Hour = timberCubedPerG15Hour
    }
}

export function calculator(harvesterHourCostG15:number,
                           timberTrees1000SQM:number,
                           drivingConditions: number,
                           clearanceTrees1000SQM: number,
                           incline: number,
                           sellableTimberVolume: number) : CalcResult {

    const middleStem = sellableTimberVolume / timberTrees1000SQM;

    // T1
    const drivingSpeedReductionCoefficient = 1 + 5 / timberTrees1000SQM - 0.1 * drivingConditions - 0.1 * incline
    const drivingSpeed = 25.9;
    const t1Transport = 60 * (1000 / (13.3 * timberTrees1000SQM * (drivingSpeed * drivingSpeedReductionCoefficient)))

    // T2
    const t2FellingAndProcessing = 60 * ((30.3 + 81.2 * middleStem) / 100)

    // T3
    const t3AddtionalTime = 1.5

    // TR2
    const tR2ClearanceTrees = 1.8 * (clearanceTrees1000SQM / timberTrees1000SQM)


    const secondsPerTree = t1Transport + t2FellingAndProcessing + t3AddtionalTime + tR2ClearanceTrees
    const secondsPerTreeG15 = secondsPerTree * 1.2


    const timberCubedPerG15Hour = 3600 / (secondsPerTreeG15 / middleStem)
    const costPerTimberCubed = harvesterHourCostG15 / timberCubedPerG15Hour

    console.log("drivingSpeedReductionCoefficient",drivingSpeedReductionCoefficient)

    console.log("t1Transport",t1Transport)




    return new CalcResult(costPerTimberCubed,timberCubedPerG15Hour)
}