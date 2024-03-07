enum TreatmentType {
    PATCH_HARVEST = "PATCH_HARVEST",
    SINGLE_TREE_SELECTION = "SINGLE_TREE_SELECTION",
}

function trunk_rng( // Utydelig for meg hvor denne kommer fra?
    a: number,
    b: number,
    c: number
) {
    return a * b * c; //TODO: HELT UKJENT HVA SOM SKJER I DENNE FUNKSJONEN
    // Kun placeholder
}

//TODO: Bruker nåværende formel m3fub for middelstamme, eller er det noe helt annet?
/*
m3sk Tree stem volume above the felling cut. Includes bark and top of the tree, but not branches.
m3fub Volume of log(s) excluding bark.
m3fpb Volume of log(s) including bark.
m3to Volume of log(s) as given by a cylinder, with diameter = top diameter of the log under bark.
 */


function t_harv_ccf_fj94(
    stems_ha: number = 1200,
    v: number = 0.4, // m^3fub = mean tree volume excluding bark. Tror dette er middelstamme eller en variant av det.
    treatment: TreatmentType = TreatmentType.PATCH_HARVEST,
    harvest_strength_pct: number = 45, // share of basal area to be cut
    patch_size_ha: number = 0.6,
    sr_w: number = 4,
    stripRoadExists: boolean = true
) {
    let vharv = stems_ha * v * harvest_strength_pct / 100;

    if(treatment === TreatmentType.PATCH_HARVEST) {
        patch_size_ha = trunk_rng(patch_size_ha, 100/10000, 0.5);
        const ptch_w = Math.sqrt(patch_size_ha) * 100;

        const sr_sp =
            (Math.sqrt( sr_w^2 - 4* sr_w* (harvest_strength_pct/100) *
                ptch_w+ 4 * (harvest_strength_pct/100) * ptch_w^2 ) + sr_w) /
            (2 * (harvest_strength_pct/100))

        const sr_share_harvest_area =
            (sr_sp * ptch_w) *
            sr_w / (harvest_strength_pct * sr_sp**2 /100);
        // const sr_share_tot_area =
        //     (sr_sp * ptch_w) *
        //     sr_w / (sr_sp**2);

        const nharv_sr =
            stripRoadExists? 0 : sr_share_harvest_area * stems_ha;
        const vharv_sr = nharv_sr * v;
        const v_sr =
            stripRoadExists? 0 : vharv_sr / nharv_sr;

        const vharv_bsr =
            vharv - vharv_sr;
        const v_bsr = v;
        // const nharv_bsr = vharv_bsr / v_bsr;
        // const nharv = nharv_bsr + nharv_sr;

        getHarvestTime(
            v_bsr, // v_bsr alltid lik v?
            harvest_strength_pct,
            vharv,
            vharv_sr,
            vharv_bsr,
            v,
            v_sr,
            treatment,
            stripRoadExists
        )

    } else {
        const sr_sp = 22;
        const sr_share_harvest_area = sr_w / sr_sp;

        stripRoadExists = false;

        // const sr_share_tot_area = sr_share_harvest_area; // ser ikke ut til å bli brukt
        // const nharv_sr = stems_ha * sr_share_harvest_area;
        const v_sr = v;
        const vharv_sr = stems_ha * sr_share_harvest_area * v_sr;
        const vharv_bsr = vharv - vharv_sr;
        const v_bsr = v * 1.3; // selektivt valg av trær 30% over snitt av v
        // const nharv_bsr = vharv_bsr / v_bsr;
        // const nharv = parseInt((nharv_bsr + nharv_sr).toString());
        vharv = vharv_sr * vharv_bsr;
        // const v_hrv = parseFloat((vharv * nharv).toFixed(3));

        getHarvestTime(
            v_bsr,
            harvest_strength_pct,
            vharv,
            vharv_sr,
            vharv_bsr,
            v,
            v_sr,
            treatment,
            stripRoadExists
        )
    }
}

function getHarvestTime(
    v_bsr: number,
    harvest_strength_pct: number,
    vharv: number,
    vharv_sr: number,
    vharv_bsr: number,
    v: number,
    v_sr: number,
    type: TreatmentType,
    stripRoadExists: boolean
) {
    const T_proc_cmin_m3 = 81.537 / (29.4662 / v_bsr) + 31.12 * ((type === TreatmentType.PATCH_HARVEST)? 1 : 2);
    const T_move_cmin_m3 = 5.756 + (539.574 / (v_bsr * harvest_strength_pct));
    const T_clpr_cmin_m3 = 15.84;
    const T_bsr_cmin_m3 = (T_proc_cmin_m3 + T_move_cmin_m3 + T_clpr_cmin_m3);
    const T_bsr_cmin_ha = T_bsr_cmin_m3 * vharv_bsr;
    const T_sr_cmin_m3 = stripRoadExists? 81.537 + (29.4662/v_sr)  + 31.12 * 1.5 + 23.9 / v_sr + 15.84 : 0;
    const T_sr_cmin_ha = stripRoadExists? T_sr_cmin_m3 * vharv_sr : 0;
    const T_cmin_ha = T_sr_cmin_ha + T_bsr_cmin_ha;
    const T_mean_cmin_m3 = T_cmin_ha/vharv;


    const cmin_tree = T_mean_cmin_m3 * v;
    const harv_G15min_tree = cmin_tree * 1.5 / 100;
    const harv_G15min_ha = T_cmin_ha * 1.5 / 100;
    // const harv_G15h_ha = harv_G15min_ha / 60;
    const harv_G15min_m3 = harv_G15min_ha / vharv;
    const harv_m3_g15h = 60 / harv_G15min_m3;

    // console.log("cmin_tree", cmin_tree);
    // console.log("harv_G15min_tree", harv_G15min_tree);
    // console.log("harv_G15min_ha", harv_G15min_ha);
    // console.log("harv_G15h_ha", harv_G15h_ha);
    // console.log("harv_G15min_m3", harv_G15min_m3);
    console.log("harv_m3_g15h", harv_m3_g15h);
}





function longNameVersion(
    stemsPerHectare: number = 1200,
    meanTreeVolumeM3fub: number = 0.4, // m^3fub = mean tree volume excluding bark. Tror dette er middelstamme eller en variant av det.
    treatment: TreatmentType = TreatmentType.PATCH_HARVEST,
    harvestStrengthPercent: number = 45, // share of basal area to be cut
    harvestedPatchSizeInHectare: number = 0.6,
    stripRoadWidthMeters: number = 4,
    stripRoadExists: boolean = true
) {
    let volumeHarvestedPerHectare = stemsPerHectare * meanTreeVolumeM3fub * harvestStrengthPercent / 100;

    if(treatment === TreatmentType.PATCH_HARVEST) {
        harvestedPatchSizeInHectare = trunk_rng(harvestedPatchSizeInHectare, 100/10000, 0.5);
        const patchEdgeLengthInMeters = Math.sqrt(harvestedPatchSizeInHectare) * 100;

        const stripRoadSpacing =
            (Math.sqrt( stripRoadWidthMeters^2 - 4* stripRoadWidthMeters* (harvestStrengthPercent/100) *
                patchEdgeLengthInMeters+ 4 * (harvestStrengthPercent/100) * patchEdgeLengthInMeters^2 ) + stripRoadWidthMeters) /
            (2 * (harvestStrengthPercent/100))

        const stripRoadAreaFractionPerPatch =
            (stripRoadSpacing * patchEdgeLengthInMeters) *
            stripRoadWidthMeters / (harvestStrengthPercent * stripRoadSpacing**2 /100);
        // const sr_share_tot_area =
        //     (sr_sp * ptch_w) *
        //     sr_w / (sr_sp**2);

        const stripRoadStemCount =
            stripRoadExists? 0 : stripRoadAreaFractionPerPatch * stemsPerHectare;
        const volumeHarvestedPerHectareOnStripRoad = stripRoadStemCount * meanTreeVolumeM3fub;
        const v_sr = // ser ut som at v_sr altid er lik meanTreeVolumeM3fub?
            stripRoadExists? 0 : volumeHarvestedPerHectareOnStripRoad / stripRoadStemCount;

        const volumeHarvestedPrHectareBetweenStripRoads =
            volumeHarvestedPerHectare - volumeHarvestedPerHectareOnStripRoad;
        const v_bsr = meanTreeVolumeM3fub; // why tho??????
        // const nharv_bsr = vharv_bsr / v_bsr;
        // const nharv = nharv_bsr + nharv_sr;

        getHarvestTime(
            v_bsr, // v_bsr alltid lik v?
            harvestStrengthPercent,
            volumeHarvestedPerHectare,
            volumeHarvestedPerHectareOnStripRoad,
            volumeHarvestedPrHectareBetweenStripRoads,
            meanTreeVolumeM3fub,
            v_sr,
            treatment,
            stripRoadExists
        )

    } else {
        const sr_sp = 22;
        const sr_share_harvest_area = stripRoadWidthMeters / sr_sp;

        stripRoadExists = false;

        // const sr_share_tot_area = sr_share_harvest_area; // ser ikke ut til å bli brukt
        // const nharv_sr = stems_ha * sr_share_harvest_area;
        const v_sr = meanTreeVolumeM3fub;
        const vharv_sr = stemsPerHectare * sr_share_harvest_area * v_sr;
        const vharv_bsr = volumeHarvestedPerHectare - vharv_sr;
        const v_bsr = meanTreeVolumeM3fub * 1.3; // selektivt valg av trør 30% over snitt av v
        // const nharv_bsr = vharv_bsr / v_bsr;
        // const nharv = parseInt((nharv_bsr + nharv_sr).toString());
        volumeHarvestedPerHectare = vharv_sr * vharv_bsr;
        // const v_hrv = parseFloat((vharv * nharv).toFixed(3));

        getHarvestTime(
            v_bsr,
            harvestStrengthPercent,
            volumeHarvestedPerHectare,
            vharv_sr,
            vharv_bsr,
            meanTreeVolumeM3fub,
            v_sr,
            treatment,
            stripRoadExists
        )
    }
}

function getHarvestTimeLong(
    v_bsr: number,
    harvestStrengthPercentage: number,
    volumeHarvestedPrHectare: number,
    volumeHarvestedPrHectareOnStripRoad: number,
    volumeHarvestedPrHectareBetweenStripRoads: number,
    meanTreeVolumem3fub: number,
    v_sr: number,
    type: TreatmentType,
    stripRoadExists: boolean
) {
    // Jeg antar cmin er centiminutter
    const timeProcessingInCminPrM3 = 81.537 / (29.4662 / v_bsr) + 31.12 * ((type === TreatmentType.PATCH_HARVEST)? 1 : 2);
    const timeMovingInCminPrM3 = 5.756 + (539.574 / (v_bsr * harvestStrengthPercentage));
    const timeSpentClearingAndPreparingInCminPrM3 = 15.84;
    const cminPrM3BetweenStripRoads = (timeProcessingInCminPrM3 + timeMovingInCminPrM3 + timeSpentClearingAndPreparingInCminPrM3);
    const cminSpentPerHectareBetweenStripRoads = cminPrM3BetweenStripRoads * volumeHarvestedPrHectareBetweenStripRoads;
    const cminSpentPrM3OnStripRoads = stripRoadExists? 81.537 + (29.4662/v_sr)  + 31.12 * 1.5 + 23.9 / v_sr + 15.84 : 0;
    const cminSpentPrHectareOnStripRoads = stripRoadExists? cminSpentPrM3OnStripRoads * volumeHarvestedPrHectareOnStripRoad : 0;
    const cminSpentPrHectare = cminSpentPrHectareOnStripRoads + cminSpentPerHectareBetweenStripRoads;
    const cminSpentPrM3 = cminSpentPrHectare/volumeHarvestedPrHectare;


    const cminSpentPerTree = cminSpentPrM3 * meanTreeVolumem3fub;
    const g15MinPrTree = cminSpentPerTree * 1.5 / 100; // omregning fra centiminutt til g15 minutt
    const g15MinPrHectare = cminSpentPrHectare * 1.5 / 100;
    const g15HoursPrHectare = g15MinPrHectare / 60;
    const volumeHarvestedPrG15min = g15MinPrHectare / volumeHarvestedPrHectare;
    const m3HarvestedPerG15Hour = 60 / volumeHarvestedPrG15min;

    console.log("cmin_tree", cminSpentPerTree);
    console.log("harv_G15min_tree", g15MinPrTree);
    console.log("harv_G15min_ha", g15MinPrHectare);
    console.log("harv_G15h_ha", g15HoursPrHectare);
    console.log("harv_G15min_m3", volumeHarvestedPrG15min);
    console.log("harv_m3_g15h", m3HarvestedPerG15Hour);
}