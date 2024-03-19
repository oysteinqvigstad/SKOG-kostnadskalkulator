import Button from "react-bootstrap/Button";
import React from "react";

export function MinimizeButton(
    props: { onClick: ()=>void }
) {
    return <Button  onClick={props.onClick}>
        Minimize
    </Button>
}

export function HiddenOnMinimized(
    props: { minimized: boolean, content: React.ReactNode }
) {
    return props.minimized ? null : <>{props.content}</>;
}