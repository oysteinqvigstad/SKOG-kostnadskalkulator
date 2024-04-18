/**
  * `ResultListItem` is an interface that is used to define the structure of the result list items.
  */
export interface ResultListItem {
    text: string
    value: number
    unit: UnitType
    percentage?: number
    color?: string
}

export interface VisualResult {
    name: string
    items: ResultListItem[]

}

/**
 * `UnitType` is an enum that represents the different types of units that can be used in the form fields.
 */
export enum UnitType {
    CUBIC_M = 'm³',
    CUBIC_M_PER_DEKAR = 'm³ ∕ daa',
    TREE_PER_DEKAR = 'tre ∕ daa',
    PIECE = 'stk',
    COST_PER_G15 = 'kr ∕ G₁₅',
    CUBIC_M_PR_G15 = 'm³ ∕ G₁₅',
    COST_PER_CUBIC_M = 'kr ∕ m³',
    CUBIC_M_PR_TREE = 'm³ ∕ tre',
    METER = 'meter',
    COST = 'kr',
    COUNT = 'antall'
}
