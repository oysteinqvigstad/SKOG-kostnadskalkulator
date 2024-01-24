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
    const middleStem = sellableTimberVolume / timberTrees1000SQM
    const actualDrivingSpeedMetersPerMinute = 1 + 5 / clearanceTrees1000SQM - 0.1 * drivingConditions - 0.1 * incline
    const t1Transport = 60 * (1000 / (13.3 * clearanceTrees1000SQM * (25.9 * actualDrivingSpeedMetersPerMinute)))
    const t2FellingAndProcessing = 60 * (30.3 + 81.2 * middleStem)
    const t3AddtionalTime = 1.5
    const tR2ClearanceTrees = 1.8 * clearanceTrees1000SQM / timberTrees1000SQM
    const secondsPerTree = t1Transport + t2FellingAndProcessing + t3AddtionalTime + tR2ClearanceTrees
    const secondsPerTreeG15 = secondsPerTree * 1.2
    const timberCubedPerG15Hour = 3600 / secondsPerTreeG15 / middleStem
    const costPerTimberCubed = timberCubedPerG15Hour / harvesterHourCostG15

    return new CalcResult(costPerTimberCubed,timberCubedPerG15Hour)
}