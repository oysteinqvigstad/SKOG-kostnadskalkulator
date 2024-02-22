export enum InputType {
    DropDown,
    Float,
    Integer
}

export interface LegalValues {
    value?: number
    range?: {
        min: number
        max: number
    }
}

export interface InputAlternative {
    name: string,
    value: number
}
