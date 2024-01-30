import {
    ForestType,
    loadCarrierCalculator,
    logHarvesterCostCalculator,
    T1Transport,
    T2FellingAndProcessing,
    T4TerminalTime,
    T5DrivingTime,
    T6TreeSizePenalty,
    T7Sorting,
    T8AdditionalTime
} from "../src/calculator/calculator";
import {FormInputErrorCode} from "../src/calculator/calculator-fields";

// EXPECTED NUMBERS ARE ROUNDED DUE TO EXCEL SHEET ROUNDING NUMBERS

/**
 * Test that the calculator returns the correct result.
 * Current implementation rounds the results, so we round the expected results
 * as well in the test currently.
 */
describe("Should result in same result as excel-calculator for log harvester",  () => {
    const expectedCostPerTimberCubedRounded = 85;
    const expectedTimberCubedPerG15HourRounded = 19.9;

    const terrainData = {
        drivingDistance: 200,
        drivingConditions: 3,
        incline: 2
    }

    const treeData = {
        sellableTimberVolume: 25,
        timberTrees: 100,
        clearanceTrees: 150,
        forestType: ForestType.ValleyAndMountainForest
    }



    const result = logHarvesterCostCalculator( 1680, treeData, terrainData )


    if(result.ok === false) {
        throw new Error("Result not ok")
    }
    const {costPerTimberCubed, timberCubedPerG15Hour} = result.value;
    expect({
        expectedCostPerTimberCubedRounded,
        expectedTimberCubedPerG15HourRounded,
    }).toEqual(
        {
            expectedCostPerTimberCubedRounded:
                Math.round(costPerTimberCubed),
            expectedTimberCubedPerG15HourRounded:
                Number.parseFloat(timberCubedPerG15Hour.toFixed(1))
        }
    )

    it("Should return a list of enums indicating which inputs are NaN",  () => {

        const terrainData = {
            drivingDistance: 200,
            drivingConditions: NaN,
            incline: 2
        }

        const treeData = {
            sellableTimberVolume: 25,
            timberTrees: 100,
            clearanceTrees: 150,
            forestType: ForestType.ValleyAndMountainForest
        }
        const result = logHarvesterCostCalculator( NaN, treeData, terrainData )

        if(result.ok === true) {
            throw new Error("Result not ok")
        }
        const error = result.error;
        expect(error).toEqual(
            [
                FormInputErrorCode.HARVESTER_HOUR_COST_G15,
                FormInputErrorCode.DRIVING_CONDITIONS
            ]
        )
    });
})

describe("Tests calculation of load carrier cost", () => {
    it("Should result in same result as excel-calculator for load carrier",  () => {
        const expectedCostPerTimberCubedRounded = 79;
        const expectedTimberCubedPerG15HourRounded = 15.4;

        const roadData = {
            drivingDistance: 500,
            drivingConditions: 3,
            incline: 2
        }

        const terrainData = {
            drivingDistance: 200,
            drivingConditions: 3,
            incline: 2
        }

        const treeData = {
            sellableTimberVolume: 25,
            timberTrees: 100,
            clearanceTrees: 150,
            forestType: ForestType.ValleyAndMountainForest
        }

        const result = loadCarrierCalculator( 1220, terrainData, roadData, treeData, 20, 5)


        if(result.ok === false) {
            throw new Error("Result not ok")
        }
        const {costPerTimberCubed, timberCubedPerG15Hour} = result.value;
        expect({
            expectedCostPerTimberCubedRounded:
                Math.round(costPerTimberCubed),
            expectedTimberCubedPerG15HourRounded:
                Number.parseFloat(timberCubedPerG15Hour.toFixed(1))
        }).toEqual(

            {
                expectedCostPerTimberCubedRounded,
                expectedTimberCubedPerG15HourRounded,
            }
        )
    })
})


test("should result in same result as excel-calculator for T1", ()=> {
    expect(Number.parseFloat(T1Transport(100, 3, 2).toFixed(2))).toEqual(3.17)
})


describe("Tests calculations for forest-type variations for excel-calculator field T2", () => {
    it("Should result in same results as excel-calculator for T21", () => {
        expect(
            Number.parseFloat(
                T2FellingAndProcessing(100, 0.25, ForestType.ValleyAndMountainForest, 0, 0, 0)
                    .toFixed(2)
            )
        ).toEqual(36.47)
    })
    it("Should result in same results as excel-calculator for T22", () => {
        expect(
            Number.parseFloat(
                T2FellingAndProcessing(100, 0.25, ForestType.LowlandsForest, 0, 0, 0)
                    .toFixed(2)
            )
        ).toEqual(30.36)
    })
    it("Should result in same results as excel-calculator for T23", () => {
        expect(
            Number.parseFloat(
                T2FellingAndProcessing(100, 0.25, ForestType.SuperForest, 0, 0, 0)
                    .toFixed(2)
            )
        ).toEqual(19.65)
    })
})

test("Should result in same results as excel-calculator", () => {
    expect(T6TreeSizePenalty(0.25)).toEqual(-3)
})

test("Should result in produce same terminal-time value as excel-calculator field T4", () => {
    expect(Number.parseFloat(T4TerminalTime(0.25, 25).toFixed(2))).toEqual(31.02)
})

test("Should produce same terrain driving time as excel-calculator field T51", () => {
    expect(Number.parseFloat(T5DrivingTime(0.25, 200, 20, 3, 2).toFixed(2))).toEqual(6.7)
})
test("Should produce same driving time as excel-calculator field t52", () => {
    expect(Number.parseFloat(T5DrivingTime(0.25, 500, 20, 3, 2).toFixed(2))).toEqual(16.74)
})
test("Should produce same sorting time as excel-calculator", () => {
    expect(Number.parseFloat(T7Sorting(0.25, 5).toFixed(2))).toEqual(6.0)
})

test("Should produce same additional time as excel-calculator", () => {
    expect(Number.parseFloat(T8AdditionalTime(0.25, 20).toFixed(2))).toEqual(1.13)
})

