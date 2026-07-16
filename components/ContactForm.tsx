"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent";

const REASONS = [
  "Partenariat institutionnel",
  "Contribution linguistique",
  "Presse / média",
  "Question technique",
  "Autre",
];

/**
 * Formulaire de contact côté client. Aucune donnée n'est réellement envoyée :
 * l'objectif est de fournir une expérience UX crédible pour la démo MVP.
 * L'intégration à un endpoint (Resend, API route, etc.) se fera ultérieurement.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    // Simulation d'un envoi asynchrone
    await new Promise((r) => setTimeout(r, 1200));

    setStatus("sent");
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setReason(REASONS[0]);
    setMessage("");
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div
        className="animate-fade-in-up rounded-2xl border border-sky-400/30 bg-sky-400/10 p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sky-400/20 text-sky-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">
          Message envoyé — merci !
        </h3>
        <p className="mt-2 text-sm text-slate-300">
          Nous revenons vers vous sous 48 h ouvrées.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-5 rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-100 transition hover:bg-sky-400/20"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const isSending = status === "sending";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Nom complet">
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Aïcha Diallo"
          />
        </Field>

        <Field id="email" label="Email">
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="vous@exemple.org"
          />
        </Field>
      </div>

      <Field id="reason" label="Objet">
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input"
        >
          {REASONS.map((r) => (
            <option key={r} value={r} className="bg-navy-900 text-slate-100">
              {r}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Message">
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input resize-y"
          placeholder="Parlez-nous de votre projet, votre langue ou votre question…"
        />
      </Field>

      <button
        type="submit"
        disabled={isSending}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 px-5 py-3 text-sm font-semibold text-navy-950 shadow-glow transition sm:text-base ${
          isSending
            ? "cursor-wait opacity-80"
            : "hover:scale-[1.01] active:scale-100"
        }`}
      >
        {isSending ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" />
            </svg>
            Envoi en cours…
          </>
        ) : (
          <>
            Envoyer le message
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-slate-500">
        En envoyant ce message, vous acceptez que vos coordonnées soient
        utilisées uniquement pour vous répondre.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
