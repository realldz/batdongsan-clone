import React from "react";
import Link from "next/link";
import { BdsLogo } from "../Icon/custom-icons";

export interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 32, className }: LogoProps) => {
  return (
    <Link href="/" className="inline-flex">
      <BdsLogo size={size} className={className} />
    </Link>
  );
};
