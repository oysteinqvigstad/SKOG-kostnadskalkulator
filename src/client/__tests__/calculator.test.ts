import {calculator} from "../src/calculator/calculator";
import {FormInputErrorCode} from "../src/calculator/calculator-fields";

/**
 * Test that the calculator returns the correct result.
 * Current implementation rounds the results, so we round the expected results as well
 * in the test currently.
 */
test("Should result in same result as excel-calculator",  () => {
    const expectedCostPerTimberCubedRounded = 85;
    const expectedTimberCubedPerG15HourRounded = 19.9;

    const result = calculator( 1680, 100, 3, 150, 2, 25 )

    if(result.ok === false) {
        fail("Result not ok")
    } else {
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
    }
})

test("Should return a list of enums indicating which inputs are NaN",  () => {
    const result = calculator( NaN, 100, NaN, 150, 2, 25 )

    if(result.ok === true) {
        fail("Result not ok")
    } else if(result.ok === false) {
        const error = result.error;
        expect(error).toEqual(
            [
                FormInputErrorCode.HARVESTER_HOUR_COST_G15,
                FormInputErrorCode.DRIVING_CONDITIONS
            ]
        )
    }
});