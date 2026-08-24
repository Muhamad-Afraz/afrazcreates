"use client";

import { useEffect, useState } from "react";
import TechnologiesOrbit from "./technologies/TechnologiesOrbit";
import TechnologiesCompact from "./technologies/TechnologiesCompact";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export default function Technologies() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <TechnologiesOrbit /> : <TechnologiesCompact />;
}
