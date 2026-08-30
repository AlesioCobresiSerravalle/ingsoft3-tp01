import type { ReactNode } from "react";

interface Props {
  tono: "loading" | "empty" | "error";
  children: ReactNode;
}

export function StateMessage({ tono, children }: Props) {
  return (
    <div className={`state-message state-message-${tono}`} role={tono === "error" ? "alert" : undefined}>
      {children}
    </div>
  );
}
