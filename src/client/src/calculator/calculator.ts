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
    return new CalcResult(0,0)
}