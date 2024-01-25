import * as C from "./calculator-constants";
import {FormInputErrorCode} from "./calculator-fields";

/**
 * Calculation contains the output fields of the calculator.
 */
export type Calculation = {
    costPerTimberCubed: number
    timberCubedPerG15Hour: number
}

/**
 * Result is a generic type that can be either a valid value or an error.
 */
export type Success<T> = { ok: true, value: T };
export type Failure<E> = { ok: false, error: E };
export type Result<T, E> = Success<T> | Failure<E>;


/**
 * calculator calculates the cost per timber cubed and timber cubed per G15 hour.
 * @param harvesterCostPerG15Hour Hourly cost of harvester in G15
 * @param timberTreeCountPer1000SQM Number of timber trees per 1000 square meters
 * @param drivingConditions Driving conditions, 1-5
 * @param clearanceTreeCountPer1000SQM Number of clearance trees per 1000 square meters
 * @param incline Incline of logging area, 1-2 (1 = 0-10%, 2 = 10-20%)
 * @param sellableTimberVolume Sellable timber volume
 * @returns Calculation or list of FormInputErrorCode indicating which inputs are invalid
 */
export function calculator(
    harvesterCostPerG15Hour:number,
    timberTreeCountPer1000SQM:number,
    drivingConditions: number,
    clearanceTreeCountPer1000SQM: number,
    incline: number,
    sellableTimberVolume: number
) : Result<Calculation, FormInputErrorCode[]> {
    let errors: FormInputErrorCode[] = [];


    if (isNaN(harvesterCostPerG15Hour)) {
        errors.push(FormInputErrorCode.HARVESTER_HOUR_COST_G15)
    }
    if (isNaN(timberTreeCountPer1000SQM)) {
        errors.push(FormInputErrorCode.TIMBER_TREES_1000_SQM)
    }
    if (isNaN(drivingConditions)) {
        errors.push(FormInputErrorCode.DRIVING_CONDITIONS)
    }
    if (isNaN(clearanceTreeCountPer1000SQM)) {
        errors.push(FormInputErrorCode.CLEARANCE_TREES_1000_SQM)
    }
    if (isNaN(incline)) {
        errors.push(FormInputErrorCode.INCLINE)
    }
    if (isNaN(sellableTimberVolume)) {
        errors.push(FormInputErrorCode.SELLABLE_TIMBER_VOLUME)
    }

    // If any errors, return them
    if(errors.length > 0) {
        return { ok: false, error: errors }
    }


    const middleStem = sellableTimberVolume / timberTreeCountPer1000SQM;

    // T1
    const drivingSpeedReductionCoefficient = 1 + 5 / timberTreeCountPer1000SQM
        - 0.1 * drivingConditions - 0.1 * incline
    const t1Transport = 60 * (1000 / (C.WORK_WIDTH * timberTreeCountPer1000SQM *
        (C.NAIVE_DRIVING_SPEED * drivingSpeedReductionCoefficient)))

    // T2
    const t2FellingAndProcessing = 60 * ((C.BASE_TIME + C.MIDDLESTEM_GROWTH_FACTOR * middleStem) / 100)

    // T3
    const t3AdditionalTime = 1.5

    // TR2
    const tR2ClearanceTrees = C.CLEARANCE_TIME_PER_TREE *
        (clearanceTreeCountPer1000SQM / timberTreeCountPer1000SQM)

    const secondsPerTree = t1Transport + t2FellingAndProcessing
        + t3AdditionalTime + tR2ClearanceTrees
    const secondsUsedPerTreeG15 = secondsPerTree * C.G0_TO_G15_FACTOR


    const timberCubedPerG15Hour = 3600 / (secondsUsedPerTreeG15 / middleStem)
    const costPerTimberCubed = harvesterCostPerG15Hour / timberCubedPerG15Hour

    return {
        ok: true,
        value: { costPerTimberCubed, timberCubedPerG15Hour }
    }
}