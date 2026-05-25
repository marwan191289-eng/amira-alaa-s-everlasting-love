// Shared password for upload/delete actions on the wedding album.
// Note: this is a client-side convenience gate, not a real security boundary.
export const WEDDING_PASSWORD = "Amira2024";
const KEY = "wedding-unlocked";

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEY) === "1";
}

export function unlock(password: string): boolean {
  if (password === WEDDING_PASSWORD) {
    sessionStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function lock() {
  if (typeof window !== "undefined") sessionStorage.removeItem(KEY);
}
