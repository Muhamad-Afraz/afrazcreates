"use client";

import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import Image from "next/image";

type LaptopProps = {
  lidAngle: MotionValue<number>;
  className?: string;
};

export default function Laptop({ lidAngle, className = "" }: LaptopProps) {
  const open = useTransform(lidAngle, (a) => {
    const t = (90 - a) / 102;
    return Math.min(1, Math.max(0, t));
  });

  const closedOpacity = useTransform(open, (t) =>
    Math.min(1, Math.max(0, 1 - t / 0.55)),
  );

  const closedScale = useTransform(open, (t) => 1 - t * 0.12);

  const openOpacity = useTransform(open, (t) =>
    Math.min(1, Math.max(0, (t - 0.2) / 0.6)),
  );

  const openY = useTransform(open, (t) => (1 - t) * 12);

  const openScale = useTransform(open, (t) => 1.04 - t * 0.04);

  return (
    <div className={`laptop-img ${className}`}>
      <div className="laptop-img-stage">
        <motion.div
          className="laptop-img-closed"
          style={{ opacity: closedOpacity, scale: closedScale }}
        >
          <Image
            src="/images/Laptop%20Closed.png"
            alt="Closed laptop"
            fill
            sizes="(max-width: 768px) 72vw, 300px"
            className="object-contain select-none"
            draggable={false}
            priority
          />
        </motion.div>

        <motion.div
          className="laptop-img-open"
          style={{ opacity: openOpacity, y: openY, scale: openScale }}
        >
          <Image
            src="/images/Laptop_Opened-removebg-preview%20(1).png"
            alt="Open laptop"
            fill
            sizes="(max-width: 768px) 72vw, 300px"
            className="object-contain select-none"
            draggable={false}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
