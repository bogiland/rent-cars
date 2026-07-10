"use client"; // dialog open state + demo login form

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronDown, Mail, LogOut, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Country dial codes offered in the WhatsApp field — Cyprus first (our market). */
const DIAL_CODES = [
  { code: "+357", label: "Cyprus" },
  { code: "+971", label: "UAE" },
  { code: "+7", label: "Russia" },
  { code: "+380", label: "Ukraine" },
  { code: "+40", label: "Romania" },
] as const;

/**
 * OneClickDrive-style login. Portfolio demo only — never authenticates or
 * transmits anything. "Continue" just marks the local session as logged in so
 * favourites (hearts) can be gated behind it, exactly like OCD.
 */
export function LoginModal({
  open,
  onOpenChange,
  loggedIn,
  phone,
  onLogin,
  onLogout,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  loggedIn: boolean;
  phone: string | null;
  onLogin: (phone: string) => void;
  onLogout: () => void;
}) {
  const [dial, setDial] = useState<string>(DIAL_CODES[0].code);
  const [number, setNumber] = useState("");
  const [signUp, setSignUp] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = number.replace(/[^\d]/g, "");
    onLogin(`${dial} ${digits}`.trim());
    setNumber("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-[var(--color-overlay)]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-32px)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-elevated)] focus:outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Close
            aria-label="Close"
            className="absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <X size={18} />
          </Dialog.Close>

          {loggedIn ? (
            /* ── Signed-in view ── */
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <CheckCircle2 size={44} className="text-[var(--color-success)]" />
              <Dialog.Title className="text-lg font-semibold text-[var(--color-fg)]">
                You&apos;re signed in
              </Dialog.Title>
              <p className="max-w-[280px] text-sm text-[var(--color-fg-muted)]">
                {phone ? (
                  <>Signed in as <span className="font-medium text-[var(--color-fg)]">{phone}</span>.</>
                ) : (
                  "Your favourites and deals are now saved on this device."
                )}
              </p>
              <p className="max-w-[280px] text-xs text-[var(--color-fg-dim)]">
                Portfolio demo — no account was created and nothing was sent.
              </p>
              <button
                onClick={onLogout}
                className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-6 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          ) : (
            /* ── Login form ── */
            <div className="px-6 pb-6 pt-8">
              <Dialog.Title className="text-center text-[19px] font-semibold leading-snug text-[var(--color-fg)]">
                Log in to access your favorites, track deals, and book faster
              </Dialog.Title>

              <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
                <label className="text-sm font-medium text-[var(--color-fg)]" htmlFor="wa-number">
                  Your WhatsApp number
                </label>
                <div className="flex h-12 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] transition-colors focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-input-focus)]">
                  <div className="relative flex items-center border-r border-[var(--color-input-border)] pr-1">
                    <select
                      aria-label="Country code"
                      value={dial}
                      onChange={(e) => setDial(e.target.value)}
                      className="h-full appearance-none bg-transparent pl-3.5 pr-6 text-sm font-medium text-[var(--color-fg)] outline-none focus:outline-none focus-visible:outline-none"
                    >
                      {DIAL_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-1.5 text-[var(--color-fg-muted)]" />
                  </div>
                  <input
                    id="wa-number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="99 000 000"
                    className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm text-[var(--color-fg)] outline-none focus:outline-none focus-visible:outline-none placeholder:text-[var(--color-fg-muted)]"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[15px] font-semibold text-[var(--color-cta-fg)] transition-colors hover:bg-[var(--color-cta-hover)]"
                >
                  Continue
                </button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-fg-dim)]">
                <span className="h-px flex-1 bg-[var(--color-border)]" />
                Or
                <span className="h-px flex-1 bg-[var(--color-border)]" />
              </div>

              <div className="flex items-center justify-center gap-4">
                <SocialButton label="Apple">
                  <AppleGlyph />
                </SocialButton>
                <SocialButton label="Facebook">
                  <FacebookGlyph />
                </SocialButton>
                <SocialButton label="Google">
                  <GoogleGlyph />
                </SocialButton>
                <SocialButton label="Email">
                  <Mail size={20} className="text-[var(--color-fg)]" />
                </SocialButton>
              </div>

              <p className="mt-6 text-center text-sm text-[var(--color-fg-muted)]">
                {signUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setSignUp((v) => !v)}
                  className="font-semibold text-[var(--color-accent)] hover:underline"
                >
                  {signUp ? "Log in" : "Sign up"}
                </button>
              </p>

              <p className="mt-3 text-center text-xs leading-relaxed text-[var(--color-fg-dim)]">
                By continuing, you accept our{" "}
                <span className="underline">Terms of Service</span> and{" "}
                <span className="underline">Privacy Policy</span>.
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SocialButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => {}}
      aria-label={`Continue with ${label}`}
      title={`Continue with ${label}`}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white transition-colors hover:bg-[var(--color-surface-2)]"
      )}
    >
      {children}
    </button>
  );
}

function AppleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-fg)]" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.99-.77.85-2.02 1.5-3.05 1.42-.13-1.11.43-2.28 1.09-3 .74-.82 2.04-1.44 3.08-1.41zM20.5 17.1c-.55 1.27-.82 1.83-1.53 2.95-.99 1.56-2.39 3.5-4.12 3.51-1.54.02-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.73-.02-3.05-1.78-4.04-3.34C.03 15.9-.29 11.1 1.4 8.55 2.6 6.74 4.5 5.68 6.28 5.68c1.82 0 2.96 1 4.46 1 1.46 0 2.35-1 4.46-1 1.59 0 3.28.87 4.48 2.37-3.94 2.16-3.3 7.79.82 9.05z" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08V12h3.05V9.36c0-3.01 1.79-4.68 4.53-4.68 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87V12h3.33l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12z"
      />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1-.34-2.11c0-.73.13-1.44.34-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
      <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.37 14.97.4 12 .4A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75z" />
    </svg>
  );
}
