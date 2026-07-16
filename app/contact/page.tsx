import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — AfriVoice AI",
  description:
    "Contactez l'équipe AfriVoice AI : partenariats, presse, contributions linguistiques ou opportunités STIC'26.",
};

const CHANNELS = [
  {
    label: "Email",
    value: "contact@afrivoice.ai",
    href: "mailto:contact@afrivoice.ai",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M4 4h16v16H4z" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "AfriVoice AI",
    href: "https://www.linkedin.com/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56z" />
      </svg>
    ),
  },
  {
    label: "Localisation",
    value: "Afrique de l'Ouest",
    href: null,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact · Parlons de la voix"
      title={
        <>
          Une idée, un partenariat,{" "}
          <span className="text-gradient">une langue</span> à ajouter ?
        </>
      }
      intro="Nous accueillons les collaborations : institutionnelles, académiques, communautaires et techniques. Écrivez-nous — nous répondons rapidement."
    >
      <div className="grid gap-6 md:grid-cols-5">
        {/* FORMULAIRE */}
        <div className="glass rounded-3xl p-6 sm:p-8 md:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Formulaire de contact
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100 sm:text-2xl">
            Envoyez-nous un message
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Réponse sous 48 h ouvrées. Vos informations ne sont ni revendues ni
            partagées.
          </p>

          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        {/* COORDONNÉES */}
        <div className="space-y-5 md:col-span-2">
          <div className="glass rounded-3xl p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
              Canaux directs
            </p>
            <ul className="mt-4 space-y-3">
              {CHANNELS.map((c) => {
                const content = (
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-400/15 text-sky-200">
                      {c.icon}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {c.label}
                      </p>
                      <p className="text-sm font-medium text-slate-100">
                        {c.value}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <li key={c.label}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          c.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="block rounded-xl border border-white/5 p-3 transition hover:border-sky-400/30 hover:bg-white/5"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="rounded-xl border border-white/5 p-3">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="glass rounded-3xl p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
              Contribuer
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-100">
              Vous parlez une langue locale ?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Nous constituons un corpus vocal ouvert. Enregistrer quelques
              phrases dans votre langue peut aider des millions de personnes à
              accéder au numérique.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
