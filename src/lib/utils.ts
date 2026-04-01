import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COOKIE_EXPIRY_DAYS = 365;
const COOKIE_PATH = "/";

export function truncateText(value: string, maxLength = 120): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}....`;
}

export function setCookie(name: string, value: string, days = COOKIE_EXPIRY_DAYS) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires};path=${COOKIE_PATH};SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name).replace(/[-.+*]/g, "\\$&")}=([^;]*)`)
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}

export function deleteCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${COOKIE_PATH};SameSite=Lax`;
}
