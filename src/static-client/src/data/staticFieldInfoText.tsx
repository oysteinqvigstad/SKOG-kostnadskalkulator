import {Table} from "react-bootstrap";

export function forestTypeExplanationNOR() {
    return (
        <>
            <Table>
                <tbody>
                <tr>
                    <td>1. Dal- og fjellskog</td>
                    <td>Skog i dal- og fjellstrøk, med mindre middelstamme, større avsmalning og vanskeligere driftsforhold enn de andre skogtypene</td>
                </tr>
                <tr>
                    <td>2. Lavlandsskog</td>
                    <td>Kjennetegner skogen i deler av østlandsområdet</td>
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
            <p>Kjøreavstand i hogstfelt - én vei. Ren terrengkjøring; - ikke langs bas-/ traktorvei.</p>
            <p>Kan kombineres med kjøring på basveg (hvis forskjellig helling eller overflatsstruktur).</p>
        </>
    )
}

export function roadDistanceNor() {
    return (
        <>
            <p>Kjøreavstand én vei fra hogstfelt til velteplass. Volmveid avstand, basert på hvor hoveddelen av tømmeret fraktes fra/til.</p>
            <p><strong>NB! Husk «slingrefaktoren» (den reelle avstanden inkl svinger og bakker)</strong></p>
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
            <p>Antall sortiment tømmeret skal sorteres i fordelt på treslag. Det kan være ett eller flere både sagtømmersortiment, massevirksortiment og ved.</p>
        </>
    )
}

export function harvesterCostNor() {
    return (
        <>
            <p>Gjennomsnittlig timekostnad for hogstmaskin - kr pr G<sub>15</sub>-time</p>
            <p>I utgangspunktet er dette en kostnadskalkulator. Legge inn enhetskostnader med eller uten
                fortjenestemargin til entreprenøren.</p>
            <p>En G-15 time inkluderer all ståtid på inntil 15 minutter. Dette er en del av <a
                href={"https://www.skogforsk.se/english/projects/stanford/"} target={"_blank"}
                rel="noreferrer">StanForD</a>-standarden som alle moderne skogsmaskiner er utstyrt med, og en vanlig
                måte å registrere maskintiden på. Entreprenøren kan selv velge hva slags Grunntid (G-tid) som skal
                registreres; G<sub>0-</sub>time, G<sub>10</sub>-time eller G<sub>15</sub>-time. Grunnen til at
                G<sub>15</sub> er valgt her er at de svenske produktivitetsnormene er basert på G<sub>15</sub>.</p>
        </>
    )
}

export function logCarrierCostNor() {
    return (
        <>
            <p>Gjennomsnittlig timekostnad for lassbærer - kr pr G<sub>15</sub>-time</p>
            <p>I utgangspunktet er dette en kostnadskalkulator. Legge inn enhetskostnader med eller uten
                fortjenestemargin til entreprenøren.</p>
            <p>En G-15 time inkluderer all ståtid på inntil 15 minutter. Dette er en del av <a
                href={"https://www.skogforsk.se/english/projects/stanford/"} target={"_blank"}
                rel="noreferrer">StanForD</a>-standarden som alle moderne skogsmaskiner er utstyrt med, og en vanlig
                måte å registrere maskintiden på. Entreprenøren kan selv velge hva slags Grunntid (G-tid) som skal
                registreres; G<sub>0-</sub>time, G<sub>10</sub>-time eller G<sub>15</sub>-time. Grunnen til at
                G<sub>15</sub> er valgt her er at de svenske produktivitetsnormene er basert på G<sub>15</sub>.</p>
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
            <p>Antall trær som skal felles og opparbeides</p>
        </>
    )
}

export function clearanceTreesNor() {
    return (
        <>
            <p>Småtrær som ikke skal opparbeides, men som hindrer effektiviteten for hogstmaskinen.</p>
            <p><strong>NB: Tell med alle trær med diameter under 8 cm i brysthøyde og som er over 1 meter høye, også de
                som ikke vil bli ryddet vekk.</strong></p>
            <p>Kalkylen beregner kun for hogstmaskin. Påvirker også lassbæreren dersom f.eks. 10 % opparbeides og kjøres til velteplass.</p>
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

export function midlertidigeBroer() {
    return (
        <>
            <p>Antall bruer som entreprenøren bygger for å unngå skader ved kryssing av bekker eller små elver.</p>
        </>
    )
}

export function klopplegging() {
    return (
        <>
            <p>Antall meter hvor det legges ut tømmer og hogstavfall i basvegen for å øke bæreevnen. Tømmeret blir plukket opp av lassbæreren nå drifta avsluttes.</p>
        </>
    )
}
