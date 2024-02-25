import {BaseNode} from "./baseNode";
import {ClassicPreset} from "rete";
import {NodeType} from "@skogkalk/common/dist/src/parseTree";


class ExampleNode extends BaseNode<
    {inputKeyName: ClassicPreset.Socket}, // Objekt med inn-"sockets", dvs punkt en annen node kan koble til.
    {outputKeyName: ClassicPreset.Socket}, // Objekt med ut-"sockets", utganger man kan plugge inn i andre noder
    {
        controllerKeyName: ClassicPreset.InputControl<"text">, // ferdiglagde kontrollere håndterer number eller string
        controllerKeyName2: ClassicPreset.InputControl<"number">
    }  // Objekt med InputControl objekter, objekter som knytter en state til en rendret kontroller på noden.
        // Et grunnleggende eksempel er feltet hvor man kan skrive inn et tall.

> {

    constructor(
        // Om tilstand endres pga kalkulering eller lignende må React oppdateres med en callback
        private oppdaterRendringVedStateEndring:
            (c:  ClassicPreset.InputControl<"number", number>
                | ClassicPreset.InputControl<"text", string>) => void, //  area.update("control", c.id) er et eksempel på hvordan man kan oppdatere React rendering.
        // Og i andre retning, om manuell endring av verdien skal trigge en oppdatering i DataFlow trengs også en funksjon
        private oppdaterDataFlyt: () => void
    ) {
        super(NodeType.Number);

        // Input og Ouput sockets forteller editoren hvordan noder kan kobles sammen.

        // Uten denne snutten dukker ikke de grænne kontaktpunktene på noden opp.
        this.addInput(
            "inputKeyName", // må matche key i {inputKeyName: ClassicPreset.Socket}
            new ClassicPreset.Input(new ClassicPreset.Socket("socket"), "In"),
        )
        this.addOutput(
            "outputKeyName",                                // "socket" virker å være teksten man får ved hover
            new ClassicPreset.Output(new ClassicPreset.Socket("socket"), "Out")
        )



        this.addControl( // Et tekstfelt
            "controllerKeyName",
            new ClassicPreset.InputControl(
                "text",
                {
                    readonly: false,
                }
            )
        )

        this.addControl(
            "controllerKeyName2",
            new ClassicPreset.InputControl(
            "number",
                {
                    readonly: false,
                    change: this.oppdaterDataFlyt // endres verdien av brukeren, vil DataFlow gjøre en oppdatering av verdier
                }
                )
        )



        // Controllere er de som faktisk har, eller kontrollerer, en state. Verdien den har kan være readonly eller ikke.

    }

    /**
     * Funksjon som kalles av DataFlow for å videresende data og gjøre databehandling.
     *
     * 1. data må returnere et objekt { value: any } hvor typen matcher typen til input data videresendes til
     * 2. funksjonen tar ett parameter, objektet input med properties med key = inputKeyName.
     *    Antall felt i inputs og deres navn er helt opp til en selv så lenge de matcher keys i klassens
     *    input objekt.
     * 3. Fører kall av data() til endring av state må man oppdatere rendering ved et callback
     * 4. Noder som er blader bør ha 0 parameter, trenger kun videresende innhold som value
     * 5. Noder som er røtter bør ha {} som return for klarhetens skyld.
     */
    data( inputs: { inputKeyName: number }) : { value: number } {

        // state kan endres ved kall av data, og vi må oppdatere React for å reflektere dette.
        this.oppdaterRendringVedStateEndring(this.controls.controllerKeyName2);
        this.oppdaterRendringVedStateEndring(this.controls.controllerKeyName);



        return {value: 0}
    }

}