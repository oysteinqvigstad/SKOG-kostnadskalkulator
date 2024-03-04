import {ResultCard} from "./ResultCard";
import {FcMultipleInputs} from "react-icons/fc";
import React from "react";
import {ParametersWithTabs} from "../ParametersWithTabs";

export function ResultParameters() {

    return (
        <ResultCard
            icon={<FcMultipleInputs />}
            title={"Kostnadsdrivere"}
        >
            {/*<PaginationBar />*/}
            <ParametersWithTabs />
        </ResultCard>
    )
}
