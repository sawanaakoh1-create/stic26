import pypdf
r = pypdf.PdfReader("Fiche_Projet_AfriVoiceAI.pdf")
out = []
for i, p in enumerate(r.pages):
    out.append(f"\n=== PAGE {i+1} ===\n")
    out.append(p.extract_text() or "")
with open("_fiche_dump.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("OK", len(r.pages), "pages")
