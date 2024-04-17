import {NodeControl} from "../../nodeControl";
import {GraphDisplayNodeControlData} from "./graphDisplayNodeControlData";
import {ResultGraph} from "@skogkalk/common/dist/src/visual/ResultGraph";
import {getNodeByID} from "@skogkalk/common/dist/src/parseTree";
import {useAppSelector} from "../../../../state/hooks";
import {selectTreeState, store} from "../../../../state/store";
import {GraphDisplayNode as ParseGraphDisplayNode} from "@skogkalk/common/src/parseTree"
import {Provider} from "react-redux";
import {Drag} from "rete-react-plugin";


export function GraphDisplayNodeControlContainer(
    props: { data: NodeControl<GraphDisplayNodeControlData> }
) {
    return <Provider store={store}>
        <Drag.NoDrag>
            <GraphDisplayNodeControlContainerContent data={props.data}/>
        </Drag.NoDrag>
    </Provider>
}


function GraphDisplayNodeControlContainerContent(
    props: { data: NodeControl<GraphDisplayNodeControlData> }
) {
    const treeState = useAppSelector(selectTreeState);
    const nodeData = getNodeByID(treeState.tree, props.data.get('nodeID')) as ParseGraphDisplayNode;
    console.log("nodeData", nodeData, props.data.get('nodeID'), treeState.tree);
    return<>
        {( treeState.tree && nodeData) &&  <ResultGraph
            treeState={treeState.tree}
            displayData={nodeData}
        /> }

    </>
}










