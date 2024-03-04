import type {DropdownInput, NumberInputNode} from "./nodes/inputNode";
import {InputType} from "./nodes/inputNode";
import {NodeType} from "./nodes/parseNode";
import type {OutputNode} from "./nodes/outputNode";
import type {DisplayNode} from "./nodes/displayNode";


let ID = 0;

function getUniquieID() {
    return (ID++).toString();
}


const radiusInput : NumberInputNode = {
    id: getUniquieID(),
    name: "radius",
    value: 1,
    ordering: 0,
    defaultValue: 1,
    legalValues: [{min: 0, max: null}],
    infoText: "Radius av sirkel",
    simpleInput: true,
    inputType: InputType.Float,
    unit: "meter",
    pageName: "Sirkel",
    type: NodeType.NumberInput,
}

const breddeInput : NumberInputNode = {
    id: getUniquieID(),
    name: "bredde",
    value: 1,
    ordering: 0,
    defaultValue: 1,
    legalValues: [{min: 0, max: null}],
    infoText: "Bredde av rektangel",
    simpleInput: true,
    inputType: InputType.Float,
    unit: "meter",
    pageName: "Rektangel",
    type: NodeType.NumberInput,
}

const hoydeInput : NumberInputNode = {
    id: getUniquieID(),
    name: "høyde",
    value: 1,
    ordering: 1,
    defaultValue: 1,
    legalValues: [{min: 0, max: null}],
    infoText: "Høyde av rektangel",
    simpleInput: true,
    inputType: InputType.Float,
    unit: "meter",
    pageName: "Rektangel",
    type: NodeType.NumberInput,
}


const enhetDropdown : DropdownInput = {
    id: getUniquieID(),
    name: "enhet",
    value: 1,
    ordering: 0,
    defaultValue: 1,
    dropdownAlternatives: [
        {value: 1, label: "m"},
        {value: 100, label: "cm"},
        {value: 0.001, label: "km"}
    ],
    infoText: "Enhet",
    simpleInput: true,
    pageName: "Enhet",
    type: NodeType.DropdownInput,
}



const circleAreaOutput: OutputNode = {
    id: getUniquieID(),
    name: "Sirkelareal",
    type: NodeType.Output,
    value: 0,
    color: "#5555FF",
    unit: "m^2",
    child: {
        id: getUniquieID(),
        type: NodeType.Mul,
        value: 0,
        left: {
            id: getUniquieID(),
            type: NodeType.Number,
            value: Math.PI,
        },
        right: {
            id: getUniquieID(),
            type: NodeType.Pow,
            value: 0,
            left: {
                id: getUniquieID(),
                type: NodeType.Mul,
                value: 0,
                left: {
                    id: getUniquieID(),
                    type: NodeType.Reference,
                    value: 35,
                    referenceID: radiusInput.id
                },
                right: {
                    id: getUniquieID(),
                    type: NodeType.Reference,
                    value: 11232123,
                    referenceID: enhetDropdown.id
                }
            },
            right: {
                id: getUniquieID(),
                type: NodeType.Number,
                value: 2
            }
        }
    }
}


const sirkelOmkrets: OutputNode = {
    id: getUniquieID(),
    name: "Sirkelomkrets",
    type: NodeType.Output,
    value: 0,
    unit: "meter",
    color: "#5555FF",
    child: {
        id: getUniquieID(),
        type: NodeType.Prod,
        value: 0,
        inputs: [
            {
                id: getUniquieID(),
                type: NodeType.Reference,
                value: 0,
                referenceID: radiusInput.id
            },
            {
                id: getUniquieID(),
                type: NodeType.Number,
                value: Math.PI,
            },
            {
                id: getUniquieID(),
                type: NodeType.Number,
                value: 2
            },
            {
                id: getUniquieID(),
                type: NodeType.Reference,
                value: 0,
                referenceID: enhetDropdown.id
            }
        ]
    }
}

const rektangelOmkrets: OutputNode = {
    id: getUniquieID(),
    type: NodeType.Output,
    value: 0,
    name: "Rektangelomkrets",
    color: "#55FF55",
    unit: "m^2",
    child: {
        id: getUniquieID(),
        type: NodeType.Add,
        value: 0,
        left: {
            id: getUniquieID(),
            type: NodeType.Prod,
            value: 0,
            inputs: [
                {
                    id: getUniquieID(),
                    type: NodeType.Number,
                    value: 2
                },
                {
                    id: getUniquieID(),
                    type: NodeType.Reference,
                    value: 0,
                    referenceID: hoydeInput.id
                },
                {
                    id: getUniquieID(),
                    type: NodeType.Reference,
                    value: 0,
                    referenceID: enhetDropdown.id
                }
            ]
        },
        right: {
            id: getUniquieID(),
            type: NodeType.Prod,
            value: 0,
            inputs: [
                {
                    id: getUniquieID(),
                    type: NodeType.Number,
                    value: 2
                },
                {
                    id: getUniquieID(),
                    type: NodeType.Reference,
                    value: 0,
                    referenceID: breddeInput.id
                },
                {
                    id: getUniquieID(),
                    type: NodeType.Reference,
                    value: 0,
                    referenceID: enhetDropdown.id
                }
            ]
        }
    }
}

const rektangelAreal: OutputNode = {
    id: getUniquieID(),
    type: NodeType.Output,
    name: "Rektangelareal",
    color: "#55FF55",
    value: 0,
    unit: "m",
    child: {
        id: getUniquieID(),
        type: NodeType.Prod,
        value: 0,
        inputs: [
            {
                id: getUniquieID(),
                type: NodeType.Reference,
                value: 0,
                referenceID: hoydeInput.id
            },
            {
                id: getUniquieID(),
                type: NodeType.Reference,
                value: 0,
                referenceID: breddeInput.id,
            },
            {
                id: getUniquieID(),
                type: NodeType.Pow,
                value: 0,
                left: {
                    id: getUniquieID(),
                    type: NodeType.Reference,
                    value: 0,
                    referenceID: enhetDropdown.id
                },
                right: {
                    id: getUniquieID(),
                    type: NodeType.Number,
                    value: 2
                }
            }
        ]
    }
}

const grafOmkrets : DisplayNode = {
    id: getUniquieID(),
    type: NodeType.Display,
    name: "Omkrets",
    value: 0,
    inputs: [
        {
            id: getUniquieID(),
            type: NodeType.Reference,
            value: 0,
            referenceID: sirkelOmkrets.id
        },
        {
            id: getUniquieID(),
            type: NodeType.Reference,
            value: 0,
            referenceID: rektangelOmkrets.id
        }
    ],
    inputOrdering: [
        {
            outputID: sirkelOmkrets.id,
            outputLabel: "Sirkel"
        },
        {
            outputID: rektangelOmkrets.id,
            outputLabel: "Rektangel"
        }
    ]
}

const arealGraf: DisplayNode =  {
    id: getUniquieID(),
    name: "Areal",
    value: 0,
    type: NodeType.Display,
    inputs: [
        {
            id: getUniquieID(),
            value: 0,
            type: NodeType.Reference,
            referenceID: circleAreaOutput.id,
        },
        {
            id: getUniquieID(),
            value: 0,
            type: NodeType.Reference,
            referenceID: rektangelAreal.id
        }
    ],
    inputOrdering: [
        {
            outputID: circleAreaOutput.id,
            outputLabel: "Sirkel"
        },
        {
            outputID: rektangelAreal.id,
            outputLabel: "Rektangel"
        }
    ]
}







export const testTree = [
    {
        id: getUniquieID(),
        value: 0,
        formulaName: "testformel",
        type: NodeType.Root,
        version: {
            major: 0,
            minor: 1,
            patch: 0
        },
        pages: [
            {
                pageName: "Sirkel",
                ordering: 3
            },
            {
                pageName: "Rektangel",
                ordering: 2
            },
            {
                pageName: "Enhet",
                ordering: 1
            }
        ],
        inputs: [
            grafOmkrets,
            arealGraf
        ]
    },
    radiusInput,
    breddeInput,
    hoydeInput,
    enhetDropdown,
    circleAreaOutput,
    sirkelOmkrets,
    rektangelAreal,
    rektangelOmkrets
]


