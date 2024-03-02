import * as C from "./calculator-constants";
import {FormInputErrorCode} from "./calculator-fields";


/**
 * Calculation contains the output fields of the calculator.
 */
export type Calculation = {
    costPerTimberCubed: number
    timberCubedPerG15Hour: number
}

export type DrivingData = {
    drivingDistance: number
    drivingConditions: number
    incline: number
}

export type TreeData = {
    timberTrees: number
    clearanceTrees: number
    sellableTimberVolume: number
    forestType: ForestType
}





/**
 * Enum indicating forest type.
 */
export enum ForestType {
    ValleyAndMountainForest,
    LowlandsForest,
    SuperForest
}

export function forestTypeToString(forestType: ForestType) {
    switch(forestType) {
        case ForestType.ValleyAndMountainForest:
            return "Dal- og fjellskog"
        case ForestType.LowlandsForest:
            return "Låglandsskog"
        case ForestType.SuperForest:
            return "Særlig velpleid og jevn skog"
    }
}


/**
 * Result is a generic type that can be either a valid value or an error.
 */
export type Success<T> = { ok: true, value: T };
export type Failure<E> = { ok: false, error: E };
export type Result<T, E> = Success<T> | Failure<E>;


/**
 * calculator calculates the cost per timber cubed and timber cubed per G15 hour.
 * @param harvesterCost Hourly cost of harvester in G15
 * @param treeData Timber trees per 1000sqm, clearance trees per 1000sqm and sellable timber volume
 * @param terrainData Driving distance, driving conditions and incline
 * @returns Calculation or list of FormInputErrorCode indicating which inputs are invalid
 */
export function logHarvesterCostCalculator(
    harvesterCost: number,
    treeData: TreeData,
    terrainData: DrivingData,
) : Result<Calculation, FormInputErrorCode[]> {

    // let errors: FormInputErrorCode[] = [];
    //
    // if (isNaN(harvesterCost)) {
    //     errors.push(FormInputErrorCode.HARVESTER_HOUR_COST_G15)
    // }
    // if (isNaN(treeData.timberTrees)) {
    //     errors.push(FormInputErrorCode.TIMBER_TREES_1000_SQM)
    // }
    // if (isNaN(terrainData.drivingConditions)) {
    //     errors.push(FormInputErrorCode.DRIVING_CONDITIONS)
    // }
    // if (isNaN(treeData.clearanceTrees)) {
    //     errors.push(FormInputErrorCode.CLEARANCE_TREES_1000_SQM)
    // }
    // if (isNaN(terrainData.incline)) {
    //     errors.push(FormInputErrorCode.INCLINE)
    // }
    // if (isNaN(treeData.sellableTimberVolume)) {
    //     errors.push(FormInputErrorCode.SELLABLE_TIMBER_VOLUME)
    // }
    // // If any errors, return them
    // if(errors.length > 0) {
    //     return { ok: false, error: errors }
    // }


    const middleStem = treeData.sellableTimberVolume / treeData.timberTrees;

    const secondsUsedPerTreeG15 = secondsPerTreeG15(
        T1Transport(treeData.timberTrees, terrainData.drivingConditions, terrainData.incline),
        T2FellingAndProcessing(treeData.timberTrees, middleStem, treeData.forestType),
        T3AdditionalTime(),
        TR2ClearanceTrees(treeData.timberTrees, treeData.clearanceTrees)
    )

    const timberM3PerG15Hour = 3600 / (secondsUsedPerTreeG15 / middleStem)
    const costPerM3Timber = harvesterCost / timberM3PerG15Hour

    // if (isNaN(costPerM3Timber) || isNaN(timberM3PerG15Hour)) {
    //     return { ok: false, error: [] }
    // }

    return {
        ok: true,
        value: {
            costPerTimberCubed: costPerM3Timber,
            timberCubedPerG15Hour: timberM3PerG15Hour
        }
    }
}


/**
 *
 * @param carrierCost cost per hour of carrier
 * @param terrainData terrain conditions, incline and driving distance
 * @param roadData road conditions, incline and driving distance
 * @param treeData sellable volume, timber trees and clearance trees count
 * @param timberLoadSize volume of timber load per trip
 * @param distinctAssortments number of distinct assortments of timber
 */
export function loadCarrierCalculator(
    carrierCost: number,
    terrainData: DrivingData,
    roadData: DrivingData,
    treeData: TreeData,
    timberLoadSize: number,
    distinctAssortments: number
) : Result<Calculation, FormInputErrorCode[]> {



    const middleStem = treeData.sellableTimberVolume / treeData.timberTrees;

    const secondsPerVolume =
        T4TerminalTime(middleStem, treeData.sellableTimberVolume)
        + T5DrivingTime(middleStem, terrainData.drivingDistance,
            timberLoadSize, terrainData.drivingConditions, terrainData.incline)
        + T5DrivingTime(middleStem, roadData.drivingDistance ,
            timberLoadSize, roadData.drivingConditions, roadData.incline)
        + T6TreeSizePenalty(middleStem)
        + T7Sorting(middleStem, distinctAssortments)
        + T8AdditionalTime(middleStem, timberLoadSize)

    const timberM3PerG15Hour = 3600 / (secondsPerVolume / middleStem)
    const costPerM3Timber = carrierCost / timberM3PerG15Hour

    return {
        ok: true,
        value: {
            costPerTimberCubed: costPerM3Timber,
            timberCubedPerG15Hour: timberM3PerG15Hour
        }
    }
}


/**
 * T1Transport calculates the time spent driving between trees.
 *
 * Formula:
 * T = 60 * ( 1 + (1000 / ( S * U * H )))
 * H = K * (1 + 5 / U - 0.1 * Y - 0.1 * L)
 *
 * H = Real driving speed (reell kjørehastighet)
 * S = Word width (arbeidsbredde)
 * K = Vehicle speed in m/min (kjørehastighet)
 * U = Timber trees per 1000 sqm (uttak)
 * Y = Driving conditions (overflatestruktur)
 * L = Incline (Helning)
 *
 * @param timberTreeCountPer1000SQM Timber trees per 1000sqm
 * @param drivingConditions Driving conditions
 * @param incline Incline of logging terrain
 * @returns {number} Time spent driving between trees in G0 seconds
 */
export function T1Transport(
    timberTreeCountPer1000SQM: number,
    drivingConditions: number,
    incline: number
) {
    const H = C.NAIVE_DRIVING_SPEED * (1 + 5 / timberTreeCountPer1000SQM
        - 0.1 * drivingConditions - 0.1 * incline)
    return 60 * ( 1000 / (C.WORK_WIDTH * timberTreeCountPer1000SQM * H))
}


//TODO: Betydning av opparbeiding?
//TODO: Hva betyr tallet man skriver in for "ekstratid" som f.eks dobbelsaging
/**
 * T2FellingAndProcessing calculates the time spent felling and processing trees.
 *
 * Formula:
 * T = 60 * (((B + V * M) + E) / 100)
 *
 * B = Base time (grunntid)
 * V = Middle stem growth factor (økningsfaktor)
 * M = Middle stem (middelstamme)
 * E = Extra time (ekstratid)
 *
 * @param timberTreeCountPer1000SQM
 * @param middleStem Sellable timber volume / timberTreeCountPer1000SQM
 * @param forestType Forest type
 * @param doubleSawing
 * @param roadObstructions
 * @param difficultProcessing
 * @returns {number} Time spent felling and processing trees in G0 seconds
 */
export function T2FellingAndProcessing(
    timberTreeCountPer1000SQM: number,
    middleStem: number,
    forestType: ForestType = ForestType.LowlandsForest,
    doubleSawing: number = 0,
    roadObstructions: number = 0,
    difficultProcessing: number = 0
) {
    let baseTime = 0;
    let growthFactor = 0;

    switch(forestType) {
        case ForestType.ValleyAndMountainForest:
            baseTime = 21.3;
            growthFactor = 157.9;
            break;
        case ForestType.LowlandsForest:
            baseTime = 30.3;
            growthFactor = 81.2;
            break;
        case ForestType.SuperForest:
            baseTime = 24;
            growthFactor = 35;
            break;
    }

    const extraTime =
        doubleSawing * C.DOUBLE_SAWING_TIME_G0_SECONDS
        + roadObstructions * C.ROAD_OBSTRUCTIONS_TIME_G0_SECONDS
        + difficultProcessing * C.DIFFICULT_PROCESSING_TIME_G0_SECONDS

    return 60 * ((baseTime + growthFactor * middleStem)  + extraTime) / 100
}


function T3AdditionalTime() {
    return 1.5  // can be 0.8, 1.2 or 1.5 in Excel sheet. Not an exposed option.
}


/**
 * TR2ClearanceTrees calculates the time spent clearing non-sellable trees.
 *
 * Formula:
 * T = 1.8 * (C / U)
 *
 * C = Number of clearance trees per 1000 sqm (rydning)
 * U = Number of timber trees per 1000 sqm (uttak)
 * 1.8 = Time spent per tree in G0 seconds
 *
 * @param timberTrees Timber trees per 1000sqm
 * @param clearanceTrees Clearance trees per 1000sqm
 * @returns {number} Time spent clearing non-sellable trees in G0 seconds
 */
function TR2ClearanceTrees(
    timberTrees: number,
    clearanceTrees: number
) {
    return C.CLEARANCE_TIME_PER_TREE * (clearanceTrees / timberTrees)
}


/**
 * Calculates time spent at terminal
 *
 * T = k1 * ( (alpha + K*2*UT + beta*(sqrt(10*UT))) / (10*UT) )
 * UT = sellable timber volume
 *
 * @param middleStem Sellable timber volume / timberTreeCountPer1000SQM
 * @param sellableVolume sellable timber volume per 1000sqm
 * @constructor
 */
export function T4TerminalTime(middleStem:number, sellableVolume:number) {
    const alpha = 5.7
    const beta = 11.45
    const k1 = 1.4
    const k2 = 0.73

    const x = Math.sqrt(10 * sellableVolume) * beta
    return (k1 * ((alpha + (10 * k2 * sellableVolume) + x) / (10 * sellableVolume)))
        * 60 * middleStem
}


/**
 * Calculates time spent driving between trees
 *
 * T = (2 * A) / (H * L)
 * H = 75 - (8.2 * Y) - (1.4 * B)^2 - calculated driving speed
 * A = Driving distance - one way
 * Y = Driving conditions
 * B = Incline
 * L = timber load size
 *
 * @param middleStem Sellable timber volume / timberTreeCountPer1000SQM
 * @param terrainDrivingDistance Driving distance
 * @param timberLoadSize volume of timber load per trip
 * @param terrainDrivingConditions Driving conditions
 * @param incline Incline of logging terrain
 * @constructor
 */
export function T5DrivingTime(
    middleStem:number,
    terrainDrivingDistance:number,
    timberLoadSize:number,
    terrainDrivingConditions:number,
    incline:number
) {
    const h = (75 - (8.2 * terrainDrivingConditions)) - (Math.pow(incline,2) * 1.4)
    const drivingDistanceBothWays = 2 * terrainDrivingDistance
    const timePrM3 = drivingDistanceBothWays / (h * timberLoadSize)
    return timePrM3 * 60 * middleStem
}


/**
 * Calculates time-penalty for extra large trees
 *
 * @param middleStem
 */
export function T6TreeSizePenalty(middleStem:number) {
    return (0.05 - Math.min(0.5, middleStem)) * 60 * middleStem
}


/**
 * Calculates time spent sorting timber
 *
 * @param middleStem Sellable timber volume / timberTreeCountPer1000SQM
 * @param distinctAssortments Number of distinct assortments of timber
 */
export function T7Sorting(middleStem:number, distinctAssortments:number) {
    return (-0.1 + 0.1 * distinctAssortments) * 60 * middleStem
}


/**
 * Calculates additional time spent on extra work
 * @param middleStem Sellable timber volume / timberTreeCountPer1000SQM
 * @param timberLoadSize volume of timber load per trip
 */
export function T8AdditionalTime(middleStem:number, timberLoadSize:number) {
    return (1.5 / timberLoadSize) * 60 * middleStem
}


/**
 * secondsPerTreeG15 calculates the total time spent per tree in G15 seconds.
 *
 * Formula:
 * T = (T1 + T2 + T3 + TR2) * 1.2
 *
 * @param T1Transport Time spent driving between trees
 * @param T2FellingAndProcessing Time spent felling and processing trees
 * @param T3AdditionalTime Additional time
 * @param TR2ClearanceTrees Time spent clearing non-sellable trees
 */
function secondsPerTreeG15(
    T1Transport: number,
    T2FellingAndProcessing: number,
    T3AdditionalTime: number,
    TR2ClearanceTrees: number
) {
    return (
        T1Transport + T2FellingAndProcessing
        + T3AdditionalTime + TR2ClearanceTrees
    ) * C.G0_TO_G15_FACTOR
}

//ctrl shift X for bytte mellom åpen og lukket verjon



