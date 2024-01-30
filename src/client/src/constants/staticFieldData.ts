import {FieldData, FieldNames, FieldType} from "../types/FieldData";
import {FormInputErrorCode} from "../calculator/calculator-fields";
import {UnitType} from "../types/UnitTypes";
import {ForestType, forestTypeToString} from "../calculator/calculator";

export const staticFieldDescriptions: FieldData[] = [
    {
        type: FieldType.DROPDOWN_INPUT,
        errorId: FormInputErrorCode.HARVESTER_HOUR_COST_G15, //TODO: Add errorId
        title: FieldNames.SKOGTYPE,
        default: ForestType.LowlandsForest.toString(),
        properties: { options: new Map([
                [forestTypeToString(ForestType.LowlandsForest), ForestType.LowlandsForest.toString()],
                [forestTypeToString(ForestType.ValleyAndMountainForest), ForestType.ValleyAndMountainForest.toString()],
                [forestTypeToString(ForestType.SuperForest), ForestType.SuperForest.toString()],
            ]) }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: FormInputErrorCode.HARVESTER_HOUR_COST_G15,
        title: FieldNames.TIMEKOST_HOGSTMASKIN,
        default: "2000",
        properties: { min: 0, unit: UnitType.COST_PER_G15 }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: FormInputErrorCode.TIMBER_TREES_1000_SQM,
        title: FieldNames.TOMMERTREAR_PR_DEKAR,
        default: "100",
        properties: { min: 1, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        errorId: FormInputErrorCode.DRIVING_CONDITIONS,
        title: FieldNames.OVERFLATESTRUKTUR_TERRENG,
        default: "1",
        properties: { options: new Map([
                ["Meget god", "1"],
                ["God", "2"],
                ["Middels god", "3"],
                ["Dårlig", "4"],
                ["Svært dårlig", "5"]
            ]) }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: FormInputErrorCode.CLEARANCE_TREES_1000_SQM,
        title: FieldNames.RYDDETREAR_PR_DEKAR,
        default: "150",
        properties: { min: 0, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        errorId: FormInputErrorCode.INCLINE,
        title: FieldNames.HELLING_HOGSTFELT,
        default: "1",
        properties: { options: new Map([
                ["0-10 %", "1"],
                ["10-20 %", "2"],
                ["20-33 %", "3"],
                ["33-50 %", "4"],
                ["> 50 %", "5"]
            ]) }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: FormInputErrorCode.SELLABLE_TIMBER_VOLUME,
        title: FieldNames.VOLUM_PR_DEKAR,
        default: "25",
        properties: { min: 0, unit: UnitType.CUBIC_M_PER_DEKAR }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: null,
        title: FieldNames.KJOREAVSTAND_TERRENG,
        default: "200",
        properties: { min: 0, unit: UnitType.METER }
    },
]
