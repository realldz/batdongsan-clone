import { toNumber, formatCompactNumber } from "./currency";

export function formatArea(value: number | string | undefined): string {
  const area = toNumber(value);
  return area > 0 ? `${formatCompactNumber(area)} m²` : "--";
}
