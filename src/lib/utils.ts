import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRCompact(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: amount >= 10000000 ? 2 : 1,
  }).format(amount);
}

export function formatPriceWithUnitINR(
  amount: number,
  unit: "month" | "total",
) {
  return `${formatINRCompact(amount)}${unit === "month" ? "/mo" : ""}`;
}
