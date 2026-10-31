import { create } from "zustand";
import { persist } from "zustand/middleware";

// Mock guest session (01 §4: local only, no real auth). No password is ever
// stored or checked; this is a demo identity so the UI can show a signed-in
// state. A real auth provider swaps in behind this interface later.
export interface Session {
  name: string;
  email: string;
  guest: boolean;
  createdISO: string;
}

interface SessionState {
  session: Session | null;
  signIn: (input: { name?: string; email?: string }) => void;
  continueAsGuest: () => void;
  signOut: () => void;
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Traveler";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ") || "Traveler";
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      signIn: ({ name, email }) =>
        set({
          session: {
            name: name?.trim() || (email ? nameFromEmail(email) : "Traveler"),
            email: email?.trim() || "",
            guest: false,
            createdISO: new Date().toISOString(),
          },
        }),
      continueAsGuest: () =>
        set({
          session: {
            name: "Guest",
            email: "",
            guest: true,
            createdISO: new Date().toISOString(),
          },
        }),
      signOut: () => set({ session: null }),
    }),
    { name: "bookcation.session" },
  ),
);
