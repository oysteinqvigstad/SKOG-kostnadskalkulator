import {FieldData, FieldNames, FieldType} from "../types/FieldData";
import {FormInputErrorCode} from "../calculator/calculator-fields";
import {UnitType} from "../types/UnitTypes";
import {ForestType, forestTypeToString} from "../calculator/calculator";

export const staticFieldDescriptions: FieldData[] = [
    {
        type: FieldType.DROPDOWN_INPUT,
        errorId: FormInputErrorCode.FOREST_TYPE,
        title: FieldNames.SKOGTYPE,
        default: ForestType.LowlandsForest.toString(),
        page: 0,
        properties: { options: new Map([
                [forestTypeToString(ForestType.LowlandsForest), ForestType.LowlandsForest.toString()],
                [forestTypeToString(ForestType.ValleyAndMountainForest), ForestType.ValleyAndMountainForest.toString()],
                [forestTypeToString(ForestType.SuperForest), ForestType.SuperForest.toString()],
            ]) }
    },
    // TREE DATA START
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: FormInputErrorCode.TIMBER_TREES_1000_SQM,
        title: FieldNames.TOMMERTREAR_PR_DEKAR,
        default: "100",
        page: 0,
        properties: { min: 1, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: FormInputErrorCode.CLEARANCE_TREES_1000_SQM,
        title: FieldNames.RYDDETREAR_PR_DEKAR,
        default: "150",
        page: 0,
        properties: { min: 0, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: FormInputErrorCode.SELLABLE_TIMBER_VOLUME,
        title: FieldNames.VOLUM_PR_DEKAR,
        default: "25",
        page: 0,
        properties: { min: 0, unit: UnitType.CUBIC_M_PER_DEKAR }
    },
    // TREE DATA END
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: FormInputErrorCode.HARVESTER_HOUR_COST_G15,
        title: FieldNames.TIMEKOST_HOGSTMASKIN,
        default: "2000",
        page: 1,
        properties: { min: 0, unit: UnitType.COST_PER_G15 }
    },
    // TERRAIN DATA START
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: null,
        title: FieldNames.KJOREAVSTAND_TERRENG,
        default: "200",
        page: 1,
        properties: { min: 0, unit: UnitType.METER }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        errorId: FormInputErrorCode.DRIVING_CONDITIONS,
        title: FieldNames.OVERFLATESTRUKTUR_TERRENG,
        default: "1",
        page: 1,
        properties: { options: new Map([
                ["Meget god", "1"],
                ["God", "2"],
                ["Middels god", "3"],
                ["Dårlig", "4"],
                ["Svært dårlig", "5"]
            ]) }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        errorId: FormInputErrorCode.INCLINE,
        title: FieldNames.HELLING_HOGSTFELT,
        default: "1",
        page: 1,
        properties: { options: new Map([
                ["0-10 %", "1"],
                ["10-20 %", "2"],
                ["20-33 %", "3"],
                ["33-50 %", "4"],
                ["> 50 %", "5"]
            ]) }
    },
    // TERRAIN DATA END
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: null,
        title: FieldNames.TIMEKOST_LASSBEARER,
        default: "1800",
        page: 2,
        properties: { min: 0, unit: UnitType.COST_PER_G15 }
    },
    // ROAD DATA START
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: null,
        title: FieldNames.KJOREAVSTAND_VEG,
        default: "500",
        page: 2,
        properties: { min: 0, unit: UnitType.METER }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        errorId: FormInputErrorCode.DRIVING_CONDITIONS,
        title: FieldNames.OVERFLATESTRUKTUR_TRAKTORVEG,
        default: "1",
        page: 2,
        properties: { options: new Map([
                ["Meget god", "1"],
                ["God", "2"],
                ["Middels god", "3"],
                ["Dårlig", "4"],
                ["Svært dårlig", "5"]
            ]) }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        errorId: FormInputErrorCode.INCLINE,
        title: FieldNames.HELLING_PAA_TRAKTORVEG,
        default: "1",
        page: 2,
        properties: { options: new Map([
                ["0-10 %", "1"],
                ["10-20 %", "2"],
                ["20-33 %", "3"],
                ["33-50 %", "4"],
                ["> 50 %", "5"]
            ]) }
    },
    // ROAD DATA END
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: null,
        title: FieldNames.LASSTORRELSE,
        default: "20",
        page: 2,
        properties: { min: 0, unit: UnitType.CUBIC_M }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        errorId: null,
        title: FieldNames.ANTALL_SORTIMENT,
        default: "8",
        page: 2,
        properties: { min: 0, unit: UnitType.PIECE }
    },
]
