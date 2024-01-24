import {calculator, CalcResult} from "../src/calculator/calculator";

/**
 * Test that the calculator returns the correct result.
 * Current implementation rounds the results, so we round the expected results as well
 * in the test currently.
 */
test("Should result in same result as excel-calculator",  () => {
    const expectedCostPerTimberCubedRounded = 85;
    const expectedTimberCubedPerG15HourRounded = 19.9;

    const {costPerTimberCubed, timberCubedPerG15Hour} =calculator(
        1680,
        100,
        3,
        150,
        2,
        25
    )

    expect({
        expectedCostPerTimberCubedRounded,
        expectedTimberCubedPerG15HourRounded,
    }).toEqual(
        {
            expectedCostPerTimberCubedRounded: Math.round(costPerTimberCubed),
            expectedTimberCubedPerG15HourRounded: Number.parseFloat(timberCubedPerG15Hour.toFixed(1))
        }
    )
})