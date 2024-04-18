import {FieldData, FieldType} from "../types/FieldData";
import {FormInputErrorCode} from "../calculator/calculator-fields";
import {UnitType} from "../types/UnitType";
import {ForestType, forestTypeToString} from "../calculator/calculator";
import {
    assortmentsNor,
    clearanceTreesNor,
    drivingConditionsExplanationNOR, forestTypeExplanationNOR,
    harvesterCostNor, klopplegging,
    logCarrierCostNor, midlertidigeBroer,
    roadDistanceNor, roadInclineNor,
    sellableVolumeNor,
    terrainDistanceNor,
    terrainInclineNor,
    timberLoadSizeNor,
    timberTreesNor
} from "./staticFieldInfoText";
import {renderToString} from "react-dom/server";
import {FieldNames} from "../types/FieldNames";

/**
 * `staticFieldDescriptions` is an array of `FieldData` objects that are used to define the data of the form fields.
 */
export const staticFieldDescriptions: FieldData[] = [
    {
        type: FieldType.DROPDOWN_INPUT,
        descriptionHTML: renderToString(forestTypeExplanationNOR()), //TODO: Add description
        errorId: FormInputErrorCode.FOREST_TYPE,
        title: FieldNames.SKOGTYPE,
        default: ForestType.LowlandsForest.toString(),
        page: 1,
        showGraph: false,
        advanced: false,
        properties: { options: new Map([
                [forestTypeToString(ForestType.LowlandsForest), ForestType.LowlandsForest.toString()],
                [forestTypeToString(ForestType.ValleyAndMountainForest), ForestType.ValleyAndMountainForest.toString()],
                [forestTypeToString(ForestType.SuperForest), ForestType.SuperForest.toString()],
            ]) }
    },
    // TREE DATA START
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(timberTreesNor()),
        errorId: FormInputErrorCode.TIMBER_TREES_1000_SQM,
        title: FieldNames.TOMMERTREAR_PR_DEKAR,
        default: "100",
        page: 1,
        showGraph: true,
        advanced: false,
        properties: { min: 1, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(sellableVolumeNor()),
        errorId: FormInputErrorCode.SELLABLE_TIMBER_VOLUME,
        title: FieldNames.VOLUM_PR_DEKAR,
        default: "25",
        page: 1,
        showGraph: true,
        advanced: false,
        properties: { min: 0, unit: UnitType.CUBIC_M_PER_DEKAR }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.ANTALL_DEKAR,
        default: "1",
        page: 1,
        showGraph: false,
        advanced: false,
        properties: { min: 1, unit: UnitType.COUNT }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(clearanceTreesNor()),
        errorId: FormInputErrorCode.CLEARANCE_TREES_1000_SQM,
        title: FieldNames.RYDDETREAR_PR_DEKAR,
        default: "150",
        page: 1,
        showGraph: true,
        advanced: true,
        properties: { min: 0, unit: UnitType.TREE_PER_DEKAR }
    },
    // TREE DATA END

    // ROAD/TERRAIN DATA START

    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(roadDistanceNor()),
        errorId: null,
        title: FieldNames.KJOREAVSTAND_VEG,
        default: "500",
        page: 2,
        showGraph: true,
        advanced: false,
        properties: { min: 0, unit: UnitType.METER }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        descriptionHTML: renderToString(roadInclineNor()),
        errorId: FormInputErrorCode.INCLINE,
        title: FieldNames.HELLING_PAA_TRAKTORVEG,
        default: "1",
        page: 2,
        showGraph: true,
        advanced: true,
        properties: { options: new Map([
                ["0-10 %", "1"],
                ["10-20 %", "2"],
                ["20-33 %", "3"],
                ["33-50 %", "4"],
                ["> 50 %", "5"]
            ]) }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        descriptionHTML: renderToString(drivingConditionsExplanationNOR()),
        errorId: FormInputErrorCode.DRIVING_CONDITIONS,
        title: FieldNames.OVERFLATESTRUKTUR_TRAKTORVEG,
        default: "1",
        page: 2,
        showGraph: true,
        advanced: true,
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
        descriptionHTML: renderToString(terrainDistanceNor()),
        errorId: null,
        title: FieldNames.KJOREAVSTAND_TERRENG,
        default: "200",
        page: 2,
        showGraph: true,
        advanced: false,
        properties: { min: 0, unit: UnitType.METER }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        descriptionHTML: renderToString(terrainInclineNor()),
        errorId: FormInputErrorCode.INCLINE,
        title: FieldNames.HELLING_HOGSTFELT,
        default: "1",
        page: 2,
        showGraph: true,
        advanced: true,
        properties: { options: new Map([
                ["0-10 %", "1"],
                ["10-20 %", "2"],
                ["20-33 %", "3"],
                ["33-50 %", "4"],
                ["> 50 %", "5"]
            ]) }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        descriptionHTML: renderToString(drivingConditionsExplanationNOR()),
        errorId: FormInputErrorCode.DRIVING_CONDITIONS,
        title: FieldNames.OVERFLATESTRUKTUR_TERRENG,
        default: "1",
        page: 2,
        showGraph: true,
        advanced: true,
        properties: { options: new Map([
                ["Meget god", "1"],
                ["God", "2"],
                ["Middels god", "3"],
                ["Dårlig", "4"],
                ["Svært dårlig", "5"]
            ]) }
    },
    // ROAD/TERRAIN DATA END

    // MACHINE DATA START
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(harvesterCostNor()),
        errorId: FormInputErrorCode.HARVESTER_HOUR_COST_G15,
        title: FieldNames.TIMEKOST_HOGSTMASKIN,
        default: "2000",
        page: 3,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COST_PER_G15 }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(logCarrierCostNor()),
        errorId: null,
        title: FieldNames.TIMEKOST_LASSBEARER,
        default: "1800",
        page: 3,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COST_PER_G15 }
    },

    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(timberLoadSizeNor()),
        errorId: null,
        title: FieldNames.LASSTORRELSE,
        default: "20",
        page: 3,
        showGraph: true,
        advanced: true,
        properties: { min: 0, unit: UnitType.CUBIC_M }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(assortmentsNor()),
        errorId: null,
        title: FieldNames.ANTALL_SORTIMENT,
        default: "8",
        page: 3,
        showGraph: true,
        advanced: true,
        properties: { min: 0, unit: UnitType.PIECE }
    },
    // MACHINE DATA END
    // TILLEGG DATA START
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.OPPSTARTSKOSTNADER,
        default: "0",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COST }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.ENHETSPRIS_MASKINFLYTT,
        default: "4000",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COST }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.ANTALL_MASKINFLYTT,
        default: "0",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COUNT }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.ENHETSPRIS_BRO,
        default: "3000",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COST }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(midlertidigeBroer()),
        errorId: null,
        title: FieldNames.ANTALL_BRUER,
        default: "0",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COUNT }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.ENHETSPRIS_KLOPP,
        default: "50",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COST }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: renderToString(klopplegging()),
        errorId: null,
        title: FieldNames.KLOPPLEGGING,
        default: "0",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.METER }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.TIMEKOST_GRAVEMASKIN,
        default: "3000",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COST }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.TIMER_GRAVEMASKIN,
        default: "0",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COUNT }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.MANUELT_TILLEGGSARBEID,
        default: "0",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COST }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        descriptionHTML: "",
        errorId: null,
        title: FieldNames.TIMER_TILLEGGSARBEID,
        default: "0",
        page: 4,
        showGraph: false,
        advanced: true,
        properties: { min: 0, unit: UnitType.COUNT }
    },
]
