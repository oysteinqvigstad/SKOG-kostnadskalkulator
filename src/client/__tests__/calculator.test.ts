import {calculator, CalcResult} from "../calculator/calculator";
test("Should result in same result as excel-calculator",  () => {
    const result = new CalcResult(85,19.9)

    expect(result).toEqual(calculator(1680,
        100,
        3,
        150,
        2,
        25))
})