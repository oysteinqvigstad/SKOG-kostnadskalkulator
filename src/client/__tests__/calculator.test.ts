import {calculator, CalcResult} from "../src/calculator/calculator";
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