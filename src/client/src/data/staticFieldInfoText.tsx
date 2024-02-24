import {Table} from "react-bootstrap";

export function forestTypeExplanationNOR() {
    return (
        <>
            <Table>
                <tbody>
                <tr>
                    <td>1. Dal- og fjellskog</td>
                    <td>Skog i dal- og fjellstrøk, med mindre middelstamme enn de andre skogtypene - vanlig i Norge, særlig Vestlandet og Trøndelag</td>
                </tr>
                <tr>
                    <td>2. Låglandsskog</td>
                    <td>Kjennetegner skogen i deler av østlandsområdet, med større gjennomsnittlig middelstamme enn dal- og fjellskog</td>
                </tr>
                <tr>
                    <td>3. Særlig velpleidd og jevn skog</td>
                    <td>Skog med særlig stor middelstamme, åpner for bruk av eksta store maskiner - forekommer sjelden i Norge, men vanlig i Sverige</td>
                </tr>
                </tbody>
            </Table>
        </>
    )
}

export function drivingConditionsExplanationNOR() {
    return (
        <>
            <Table>
                <tbody>
                <tr>
                    <td>1. Meget god</td>
                    <td>Meget jevnt terreng med sv&aelig;rt f&aring; hinder over 30cm</td>
                </tr>
                <tr>
                    <td>2. God</td>
                    <td>Sv&aelig;rt f&aring; hinder over 50cm. Hinder over 70cm kan forekomme.</td>
                </tr>
                <tr>
                    <td>3. Middels god</td>
                    <td>Sv&aelig;rt mmange mindre hinder. De fleste er mindre enn 40cm. F&aring; store hinder. Hinder over 70cm kan forekomme.</td>
                </tr>
                <tr>
                    <td>4. D&aring;rlig</td>
                    <td>Sv&aelig;rt mange sm&aring; hinder. Mange mellomstore og store hinder. Hinder p&aring; 50-70 cm kan forekomme.</td>
                </tr>
                <tr>
                    <td>5. Sv&aelig;rt D&aring;rlig</td>
                    <td>Alt d&aring;rligere enn klasse 4.</td>
                </tr>
                </tbody>
            </Table>
        </>
    )
}

export function drivingConditionsExplanationENG() {
    return (
        <>
            <Table>
                <tbody>
                <tr>
                    <td>1. Very Good</td>
                    <td>Very even terrain with very few obstacles over 30cm</td>
                </tr>
                <tr>
                    <td>2. Good</td>
                    <td>Very few obstacles over 50cm. Obstacles over 70cm may occur.</td>
                </tr>
                <tr>
                    <td>3. Moderately Good</td>
                    <td>Many small obstacles. Most are less than 40cm. Few large obstacles. Obstacles over 70cm may occur.</td>
                </tr>
                <tr>
                    <td>4. Poor</td>
                    <td>Many small obstacles. Many medium and large obstacles. Obstacles between 50-70cm may occur.</td>
                </tr>
                <tr>
                    <td>5. Very Poor</td>
                    <td>All terrain worse than class 4.</td>
                </tr>
                </tbody>
            </Table>
        </>
    )
}


export function terrainInclineNor() {
    return (
        <>
            <p>Gjennomsnittlig helling på hogstfelt</p>
            
        </>
    )
}

export function roadInclineNor() {
    return (
        <>
            <p>Gjennomsnittlig helling på traktorvei</p>

        </>
    )
}

export function terrainDistanceNor() {
    return (
        <>
            <p>Kjøreavstand i hogstfelt - én vei</p>
        </>
    )
}

export function roadDistanceNor() {
    return (
        <>
            <p>Kjøreavstand på traktorvei i én retning</p>
        </>
    )
}

export function timberLoadSizeNor() {
    return (
        <>
            <p>Gjennomsnittlig antall m<sup>3</sup> pr lassbærerlass</p>
        </>
    )
}

export function assortmentsNor() {
    return (
        <>
            <p>Antall tømmersortiment</p>
        </>
    )
}

export function harvesterCostNor() {
    return (
        <>
            <p>Gjennomsnittlig timekostnad for hogstmaskin - kr pr G<sub>15</sub>-time</p>
        </>
    )
}

export function logCarrierCostNor() {
    return (
        <>
            <p>Gjennomsnittlig timekostnad for lassbærer - kr pr G<sub>15</sub>-time</p>
        </>
    )
}

export function sellableVolumeNor() {
    return (
        <>
            <p>Salgsvolum pr dekar, uten bark, topp og bult</p>
        </>
    )
}

export function timberTreesNor() {
    return (
        <>
            <p>Antall tømmertrær pr dekar</p>
        </>
    )
}

export function clearanceTreesNor() {
    return (
        <>
            <p>Antall ryddetrær pr dekar</p>
        </>
    )
}

export function terrainInclineEng() {
    return (
        <>
            <p>Average slope on clear-cutting area</p>
        </>
    )
}

export function roadInclineEng() {
    return (
        <>
            <p>Average slope on tractor road</p>
        </>
    )
}

export function terrainDistanceEng() {
    return (
        <>
            <p>Driving distance in clear-cutting area - one way</p>
        </>
    )
}

export function roadDistanceEng() {
    return (
        <>
            <p>Driving distance on tractor road - one way</p>
        </>
    )
}

export function timberLoadSizeEng() {
    return (
        <>
            <p>Average number of m<sup>3</sup> per log carrier load</p>
        </>
    )
}

export function assortmentsEng() {
    return (
        <>
            <p>Number of timber assortments</p>
        </>
    )
}

export function harvesterCostEng() {
    return (
        <>
            <p>Average hourly cost for harvesting machine - NOK per G<sub>15</sub>-hour</p>
        </>
    )
}

export function logCarrierCostEng() {
    return (
        <>
            <p>Average hourly cost for log carrier - NOK per G<sub>15</sub>-hour</p>
        </>
    )
}

export function sellableVolumeEng() {
    return (
        <>
            <p>Sellable volume per hectare, without bark, top, and base</p>
        </>
    )
}

export function timberTreesEng() {
    return (
        <>
            <p>Number of timber trees per 1000m<sup>2</sup></p>
        </>
    )
}

export function clearanceTreesEng() {
    return (
        <>
            <p>Number of clearance trees per 1000m<sup>2</sup></p>
        </>
    )
}
