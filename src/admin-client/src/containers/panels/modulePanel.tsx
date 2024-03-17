import {Editor} from "../../rete/editorClass";
import {Button} from "react-bootstrap";
import {useState} from "react";


export function ModulePanel( props: { editor: Editor | undefined }) {
    const [modules, setModules] = useState<string[]>(props.editor?.getModuleNames() || []);
    const [selected, setSelected] = useState("main")

    return <>
        <Button
            disabled={selected === 'main'}
            onClick={ ()=>{
                props.editor?.loadMainGraph();
                setSelected('main');
            }}
        >Main</Button>

        {modules.map((name)=>{
            return <Button
                key={name}
                disabled={selected === name}
                onClick={()=>{
                    props.editor?.loadModule(name);
                    setSelected(name);
                }}
            >{name}</Button>
        })}
        <div>
            <Button onClick={()=>{
                const name = prompt("Module name");
                if(name) {
                    props.editor?.addNewModule(name);
                    setModules(props.editor?.getModuleNames || []);
                    setSelected(name);
                }
            }}>new</Button>
            <Button onClick={()=>{props.editor?.saveCurrentModule()}}>save</Button>
        </div>
        </>
}