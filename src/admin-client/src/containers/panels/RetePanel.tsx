import React from "react";

export function RetePanel({reteRef}: {reteRef: React.RefObject<HTMLDivElement>}) {
   return (
       <div ref={reteRef} className={"h-100 w-100"} />
   )
}