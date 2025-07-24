import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const jwtDecode = (t) => {
  if (t.includes(".")) {
    let token = {};
    token.raw = t;
    token.header = JSON.parse(window.atob(t.split(".")[0]));
    token.payload = JSON.parse(window.atob(t.split(".")[1]));
    return token;
  }
  return t;
};

// Simple cookie functions that store JWT tokens exactly as they are
export const setCookie = (name, value, days = 7) => {
  if (!value) return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Store the JWT token exactly as it is - no encoding, no JSON.stringify
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      // Return the JWT token exactly as it was stored
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name) {
      deleteCookie(name);
    }
  }
};
