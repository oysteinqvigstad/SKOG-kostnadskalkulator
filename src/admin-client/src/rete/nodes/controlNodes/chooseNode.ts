import {ParseableBaseNode} from "../parseableBaseNode";
import {NumberSocket} from "../../sockets";
import {ChooseNodeComparisonData, ChooseNodeControlData} from "./ChooseNodeControlData";
import {compare, Comparison, NodeType, ParseNode} from "@skogkalk/common/dist/src/parseTree";
import {ClassicPreset} from "rete";
import {NodeControl} from "../nodeControl";
import {ChooseNodeContainer, ComparisonControlContainer} from "./ChooseNodeContainer";
import {ChooseNode as ParseChooseNode} from "@skogkalk/common/dist/src/parseTree/nodes/chooseNode";


export class ChooseNode extends ParseableBaseNode<
    Record<string, NumberSocket>,
    { result: NumberSocket },
    ChooseNodeControlData
> {

    constructor(
        protected updateNodeRendering: (nodeID: string) => void,
        protected updateDataFlow: () => void,
        private removeConnection: (nodeId: string, connection?:{input?:string, output?:string}) => Promise<void>,
        id?: string
    ) {
        super(NodeType.Choose, 400,400, "Choose", id);

        const initialData: ChooseNodeControlData = {
            leftHandValue: 0,
            comparisons: []
        }
        this.addInput("left", new ClassicPreset.Input(new NumberSocket(), "Left hand", false));
        this.addInput("right", new ClassicPreset.Input(new NumberSocket(), "Default", false));
        this.addOutput("result", new ClassicPreset.Output(new NumberSocket(), "Result"));

        const control = new NodeControl<ChooseNodeControlData>(
            initialData,
            {
                onUpdate: (newValue: Partial<ChooseNodeControlData>) => {
                    if(newValue.comparisons !== undefined) {
                        const newComparisonCount = newValue.comparisons.length;
                        const oldComparisonCount = Object.keys(this.inputs).length - 1;

                        const difference = newComparisonCount - oldComparisonCount;
                        const leftHand = this.controls.c.get('leftHandValue');
                        if(difference > 0) {
                            for(let i = 0; i < difference; i++) {
                                const comparison = this.controls.c.get('comparisons')[i + oldComparisonCount];
                                const initial: ChooseNodeComparisonData = {lh: leftHand, rh: comparison.rh, comparison: comparison.comparison};
                                this.addNumberedInput(i + oldComparisonCount, initial);
                            }
                        } else if(difference < 0) {
                            for(let i = 0; i < -difference; i++) {
                                console.log('removing input', oldComparisonCount - i);
                                this.removeNumberedInput(oldComparisonCount - i - 1);
                            }
                        }
                    }
                    Object.keys(this.inputs).forEach((key) => {
                        if(key !== "left" && key !== "right") {
                            const inputControl = this.inputs[key]?.control as NodeControl<ChooseNodeComparisonData>;
                            inputControl.setNoUpdate({lh: this.controls.c.get('leftHandValue')});
                        }
                    });
                    this.updateNodeRendering(this.id);
                },
                minimized: false
            },
            this.type,
            ChooseNodeContainer
        )
        this.addControl(
            "c",
            control
        )
    }


    private addNumberedInput(number: number, initial?: {lh: number, rh: number, comparison: Comparison}){
        const input = new ClassicPreset.Input(new NumberSocket());
        const options = {
            onUpdate: (newValue: Partial<ChooseNodeComparisonData>) => {
                console.log("updating comparison", newValue, number, this.controls.c.get('comparisons'));
                const comparisons = [...this.controls.c.get('comparisons')];
                if('rh' in newValue) {
                    comparisons[number].rh = newValue.rh || 0;
                }
                if('comparison' in newValue) {
                    comparisons[number].comparison = newValue.comparison || Comparison.EQ;
                }
                this.controls.c.setNoUpdate({comparisons});
                this.updateDataFlow();
                this.updateNodeRendering(this.id);
            },
            minimized: false
        };
        input.addControl(new NodeControl<ChooseNodeComparisonData>(
            initial ?? {lh: 0, rh: 0, comparison: Comparison.EQ},
            options,
            NodeType.Number,
            ComparisonControlContainer
        ));
        this.addInput("input" + number.toString(), input);
    }

    private removeNumberedInput(number: number) {
        console.log('removing input')
        const inputName = "input" + number.toString();
        this.removeInput(inputName);
        this.removeConnection(this.id, {input: inputName});
        this.updateNodeRendering(this.id);
    }



    data( inputs: Record<string, any>): { result: number } {
        let result: { result: number } | undefined;
        if(inputs.left && inputs.left.length > 0) {
            const leftHand = inputs.left[0];
            this.controls.c.setNoUpdate({leftHandValue: leftHand});
            Object.keys(this.inputs).forEach((key) => {
                if(key !== "left" && key !== "right") {
                    const control = this.inputs[key]?.control as NodeControl<ChooseNodeComparisonData>;
                    control.setNoUpdate({lh: leftHand});
                    console.log('comparing', leftHand, control.get('rh'), control.get('comparison'), compare(leftHand, control.get('rh'), control.get('comparison')));
                    if(compare(leftHand, control.get('rh'), control.get('comparison'))) {
                        console.log('result found', inputs[key][0]);
                        if(result === undefined) { result = {result: inputs[key][0]} }
                    }
                }
            });
        }
        this.updateNodeRendering(this.id);
        return result ?? {result: inputs.right[0] || 0};
    }

    toParseNode(): ParseChooseNode {
        return {
            id: this.id,
            type: NodeType.Choose,
            value: 0,
            inputs: [],
            comparisons: [],
        };
    }
}