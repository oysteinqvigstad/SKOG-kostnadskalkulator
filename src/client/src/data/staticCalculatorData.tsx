import {CalculatorData} from "../types/CalculatorData";
import {renderToString} from "react-dom/server";
import {MdBarChart, MdForest, MdLandscape, MdPrecisionManufacturing} from "react-icons/md";

export const staticCalculatorData: CalculatorData[] = [
    {
        id: 0,
        name: "Skogkursv1",
        description: renderToString(skogkursv1desctiption()),
    },
    {
        id: 1,
        name: "Test",
        description: renderToString(testdescription()),
    }
]

function skogkursv1desctiption() {
    return (
        <>
            <h2>
                Velkommen til Skogkurs sin kostnadskalkulator
            </h2>
            <p>
                Kalkulatoren inneholder tre kategorier, bestand, terreng og maskin:
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <MdForest/> Bestand: Her legger du inn informasjon om skogen som skal hogges, eksempelvis antall tømmertrær og ryddetrær.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <MdLandscape/> Terreng: Her legger du inn informasjon om helling, avstand og terrengforhold for vei og hogstfelt.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <MdPrecisionManufacturing/>  Maskin: Her legger du inn timeskostnad og andre maskindata.
                            </td>
                        </tr>
                        </tbody>
                    </table>
            </p>
            <p>
                <MdBarChart/> På resultatsiden: her finner du en beregning for kostnad per kubikk for lassbærer og hogstmaskin, et estimat av middeldimensjon, samt et estimat for kubikk per G<sub>15</sub>-time.
            </p>
        </>
    )
}

function testdescription() {
    return (
        <>
            <h2>
                Velkommen til test
            </h2>
            <p>
                Dette er en test for dynamisk beskrivelse
            </p>
        </>
    )
}