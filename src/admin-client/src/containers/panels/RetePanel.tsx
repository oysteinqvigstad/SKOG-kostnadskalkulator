import React from "react";

export function RetePanel({reteRef}: {reteRef: React.RefObject<HTMLDivElement>}) {
   return (
       <div ref={reteRef} style={{height: "100vh", width: "80vw"}}></div>
   )
}