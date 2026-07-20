export default function Footer() {
  return (
    <footer className="relative z-10 mt-4 border-t border-white/5">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-slate-400 sm:flex-row sm:text-sm">
        <p>
          © {new Date().getFullYear()} AfriVoice AI · Candidature STIC&apos;26
        </p>
        <p className="text-center text-slate-500 sm:text-right">
          Prototype de vision · Fondatrice AKOH N&apos;DJARMA M. Sawanatou · Lomé, Togo
        </p>
      </div>
    </footer>
  );
}
