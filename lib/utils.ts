import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number, symbol = "€") {
  return `${symbol}${value}`;
}

export function formatPower(hp: number) {
  return `${hp} hp`;
}
