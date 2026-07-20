# -*- coding: utf-8 -*-
"""
build_script_pdf.py

Transforme Script_Presentation_Jury_v3.txt en un PDF facile à lire
pendant la présentation :

- Une SLIDE = une page (pas de retour de page au milieu d'un passage).
- Gros titre de slide en haut + timing bien visible.
- Le TEXTE À DIRE en grande police (14 pt), noir, interligne aéré.
- Les indications techniques [entre crochets] en gris italique.
- Les Q/R et checklist mises en forme lisiblement.
- Marges généreuses pour lire depuis un écran ou un tirage papier.

Usage :
    py -3 build_script_pdf.py
"""

import re
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    KeepTogether,
)

SRC = Path("Script_Presentation_Jury_v3.txt")
DST = Path("Script_Presentation_Jury_v3.pdf")

# ---------------------------------------------------------------------------
# Couleurs
# ---------------------------------------------------------------------------
C_TITLE   = HexColor("#0B3D91")   # bleu profond pour les titres de slide
C_ACCENT  = HexColor("#B8860B")   # doré pour timing
C_CUE     = HexColor("#6B6B6B")   # gris pour indications techniques
C_SECTION = HexColor("#8B0000")   # rouge sombre pour sections spéciales
C_BODY    = HexColor("#111111")   # quasi noir pour le corps

# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
S_SLIDE_TITLE = ParagraphStyle(
    "SlideTitle",
    fontName="Helvetica-Bold",
    fontSize=20,
    leading=24,
    textColor=C_TITLE,
    spaceAfter=4,
    alignment=TA_LEFT,
)

S_TIMING = ParagraphStyle(
    "Timing",
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=16,
    textColor=C_ACCENT,
    spaceAfter=14,
    alignment=TA_LEFT,
)

S_BODY = ParagraphStyle(
    "Body",
    fontName="Helvetica",
    fontSize=14,
    leading=20,
    textColor=C_BODY,
    spaceAfter=10,
    alignment=TA_LEFT,
)

S_CUE = ParagraphStyle(
    "Cue",
    fontName="Helvetica-Oblique",
    fontSize=11,
    leading=15,
    textColor=C_CUE,
    leftIndent=12,
    spaceAfter=8,
    alignment=TA_LEFT,
)

S_LABEL = ParagraphStyle(
    "Label",
    fontName="Helvetica-Bold",
    fontSize=11,
    leading=14,
    textColor=C_SECTION,
    spaceAfter=6,
    alignment=TA_LEFT,
)

S_SECTION_TITLE = ParagraphStyle(
    "SectionTitle",
    fontName="Helvetica-Bold",
    fontSize=18,
    leading=22,
    textColor=C_SECTION,
    spaceAfter=14,
    alignment=TA_CENTER,
)

S_QA_Q = ParagraphStyle(
    "QA_Q",
    fontName="Helvetica-Bold",
    fontSize=12,
    leading=16,
    textColor=C_TITLE,
    spaceAfter=4,
    alignment=TA_LEFT,
)

S_QA_R = ParagraphStyle(
    "QA_R",
    fontName="Helvetica",
    fontSize=12,
    leading=17,
    textColor=C_BODY,
    spaceAfter=12,
    leftIndent=12,
    alignment=TA_LEFT,
)

S_CHECK = ParagraphStyle(
    "Check",
    fontName="Helvetica",
    fontSize=12,
    leading=18,
    textColor=C_BODY,
    spaceAfter=2,
    alignment=TA_LEFT,
)

S_COVER_TITLE = ParagraphStyle(
    "CoverTitle",
    fontName="Helvetica-Bold",
    fontSize=28,
    leading=34,
    textColor=C_TITLE,
    spaceAfter=18,
    alignment=TA_CENTER,
)

S_COVER_SUB = ParagraphStyle(
    "CoverSub",
    fontName="Helvetica",
    fontSize=14,
    leading=20,
    textColor=C_BODY,
    spaceAfter=10,
    alignment=TA_CENTER,
)

# ---------------------------------------------------------------------------
# Utils
# ---------------------------------------------------------------------------
def esc(text: str) -> str:
    """Échappe pour Paragraph."""
    return (
        text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
    )

def load_lines():
    return SRC.read_text(encoding="utf-8").splitlines()

# ---------------------------------------------------------------------------
# Parsing du script
# ---------------------------------------------------------------------------
# Un titre de slide ressemble à :
#   SLIDE 1 — COUVERTURE : AfriVoice AI · Voice-first · Vision Afrique de l'Ouest
#                                                                    (~45 sec)
# encadré par des lignes de ═══
#
# On construit une liste de "blocs" :
#   { "type": "slide", "title": "...", "timing": "~45 sec", "content": [lignes] }
#   { "type": "section", "title": "AVANT DE PRENDRE LA PAROLE", "content": [lignes] }

SEP_HEAVY = re.compile(r"^=+\s*$")
SLIDE_RE  = re.compile(r"^\s*SLIDE\s+\d+\s*[—-]\s*(.+?)\s*$")
TIMING_RE = re.compile(r"\(\s*(~?\d+\s*(?:sec|s|min)[^)]*)\)")

def parse_blocks(lines):
    """
    Découpe le script en blocs séparés par des lignes '===='.
    Chaque bloc a un titre (1re ou 2e ligne) et un contenu.
    """
    blocks = []
    i = 0
    n = len(lines)
    header_lines = []
    while i < n:
        if SEP_HEAVY.match(lines[i]):
            # début d'un bloc à titre : consommer titre(s) jusqu'au ==== suivant
            i += 1
            title_lines = []
            while i < n and not SEP_HEAVY.match(lines[i]):
                title_lines.append(lines[i])
                i += 1
            # fin de bloc-titre
            i += 1  # skip closing ====
            # collecter le contenu jusqu'au prochain ==== ou EOF
            body = []
            while i < n and not SEP_HEAVY.match(lines[i]):
                body.append(lines[i])
                i += 1
            blocks.append((title_lines, body))
        else:
            # préambule / en-tête initial : on l'accumule à part
            header_lines.append(lines[i])
            i += 1
    return header_lines, blocks

def classify(title_lines):
    """Détermine si le bloc est une slide, une section, etc."""
    joined = " ".join(t.strip() for t in title_lines if t.strip())
    m = SLIDE_RE.search(joined)
    if m:
        rest = m.group(1)
        tm = TIMING_RE.search(joined)
        timing = tm.group(1) if tm else ""
        # retirer la parenthèse de timing du titre visible
        title_clean = TIMING_RE.sub("", rest).strip(" —-·")
        # récupérer le numéro
        num_m = re.search(r"SLIDE\s+(\d+)", joined)
        num = num_m.group(1) if num_m else "?"
        return {"kind": "slide", "num": num, "title": title_clean, "timing": timing}
    return {"kind": "section", "title": joined.strip()}

# ---------------------------------------------------------------------------
# Rendu du contenu d'un bloc
# ---------------------------------------------------------------------------
def render_slide_body(body_lines, story):
    """
    Rend le corps d'une slide.
    - "TEXTE À DIRE :" devient un label.
    - Les paragraphes entre guillemets « » sont le texte à dire (grande police).
    - Les lignes [entre crochets] sont des cues (italique gris).
    - Les autres lignes sont du corps normal.
    """
    # normaliser : regrouper les paragraphes séparés par ligne vide
    paragraphs = []
    buf = []
    for ln in body_lines:
        if ln.strip() == "":
            if buf:
                paragraphs.append(buf)
                buf = []
        else:
            buf.append(ln.rstrip())
    if buf:
        paragraphs.append(buf)

    for para in paragraphs:
        text = " ".join(l.strip() for l in para).strip()
        if not text:
            continue

        # Label "TEXTE À DIRE :"
        if text.upper().startswith("TEXTE À DIRE"):
            story.append(Paragraph(esc(text), S_LABEL))
            continue

        # Cue technique : commence par [ et finit par ] (potentiellement multi-lignes déjà fusionnées)
        # On tolère plusieurs cues collés
        if text.startswith("[") and text.endswith("]"):
            # split en plusieurs cues si présents
            cues = re.findall(r"\[[^\]]+\]", text)
            for c in cues:
                story.append(Paragraph(esc(c), S_CUE))
            continue

        # Corps normal (généralement du texte à dire entre guillemets)
        story.append(Paragraph(esc(text), S_BODY))

def render_generic_body(body_lines, story, style=S_BODY):
    """Rendu simple : ligne à ligne, en conservant les blocs."""
    paragraphs = []
    buf = []
    for ln in body_lines:
        if ln.strip() == "":
            if buf:
                paragraphs.append(buf)
                buf = []
        else:
            buf.append(ln.rstrip())
    if buf:
        paragraphs.append(buf)

    for para in paragraphs:
        text = " ".join(l.strip() for l in para).strip()
        if not text:
            continue
        story.append(Paragraph(esc(text), style))

def render_qa_body(body_lines, story):
    """
    Bloc PRÉPARATION AUX QUESTIONS DU JURY : format Q : / R :.
    """
    # On regroupe par blocs Q/R (paragraphes)
    paragraphs = []
    buf = []
    for ln in body_lines:
        if ln.strip() == "":
            if buf:
                paragraphs.append(buf)
                buf = []
        else:
            buf.append(ln.rstrip())
    if buf:
        paragraphs.append(buf)

    for para in paragraphs:
        text = " ".join(l.strip() for l in para).strip()
        if not text:
            continue
        if text.startswith("Q :"):
            story.append(Paragraph(esc(text), S_QA_Q))
        elif text.startswith("R :"):
            story.append(Paragraph(esc(text), S_QA_R))
        else:
            story.append(Paragraph(esc(text), S_BODY))

def render_checklist_body(body_lines, story):
    """
    Bloc CHECKLIST JOUR J : lignes commençant par □.
    """
    for ln in body_lines:
        s = ln.rstrip()
        if not s.strip():
            story.append(Spacer(1, 4))
            continue
        # remplacer le □ par une case Unicode plus lisible
        s2 = s.replace("□", "☐ ").strip()
        # les titres genre "RAPPEL CLÉ POUR TOI :" en gras
        if s2.endswith(":") and s2.upper() == s2:
            story.append(Spacer(1, 6))
            story.append(Paragraph(esc(s2), S_LABEL))
            continue
        story.append(Paragraph(esc(s2), S_CHECK))

# ---------------------------------------------------------------------------
# En-têtes de page (footer discret avec numéro de page)
# ---------------------------------------------------------------------------
def _footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(C_CUE)
    canvas.drawRightString(
        A4[0] - 1.5 * cm,
        1.0 * cm,
        f"Script AfriVoice AI · STIC'26 · p. {doc.page}",
    )
    canvas.drawString(
        1.5 * cm,
        1.0 * cm,
        "AKOH N'DJARMA M. Sawanatou — Lomé",
    )
    canvas.restoreState()

# ---------------------------------------------------------------------------
# Construction du document
# ---------------------------------------------------------------------------
def build():
    lines = load_lines()
    header, blocks = parse_blocks(lines)

    doc = SimpleDocTemplate(
        str(DST),
        pagesize=A4,
        leftMargin=2.0 * cm,
        rightMargin=2.0 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title="Script de présentation — AfriVoice AI (STIC'26)",
        author="AKOH N'DJARMA M. Sawanatou",
    )

    story = []

    # ---------- Page de couverture ----------
    story.append(Spacer(1, 3 * cm))
    story.append(Paragraph("SCRIPT DE PRÉSENTATION", S_COVER_TITLE))
    story.append(Paragraph("AfriVoice AI — Version 3 (Finale)", S_COVER_TITLE))
    story.append(Spacer(1, 1.2 * cm))
    story.append(Paragraph("STIC'26 · Sahel Tech Innovation Challenge 2026", S_COVER_SUB))
    story.append(Paragraph("Finale en ligne · Durée : 10 minutes strictes", S_COVER_SUB))
    story.append(Paragraph("11 slides · ~55 secondes / slide", S_COVER_SUB))
    story.append(Spacer(1, 1.2 * cm))
    story.append(Paragraph("Présentatrice : AKOH N'DJARMA M. Sawanatou", S_COVER_SUB))
    story.append(Paragraph("Depuis Lomé, Togo", S_COVER_SUB))
    story.append(Spacer(1, 1.2 * cm))
    story.append(Paragraph("Démo (vision) : https://stic26.vercel.app", S_COVER_SUB))
    story.append(PageBreak())

    # ---------- Rendu des blocs ----------
    for title_lines, body in blocks:
        meta = classify(title_lines)

        if meta["kind"] == "slide":
            # En-tête de slide
            head = f"SLIDE {meta['num']} — {esc(meta['title'])}"
            story.append(Paragraph(head, S_SLIDE_TITLE))
            if meta["timing"]:
                story.append(Paragraph(f"⏱ Durée cible : {esc(meta['timing'])}", S_TIMING))
            render_slide_body(body, story)
            story.append(PageBreak())

        else:
            title = meta["title"]
            up = title.upper()
            # Nouveau bloc = nouvelle page pour tout ce qui n'est pas trivial
            story.append(Paragraph(esc(title), S_SECTION_TITLE))

            if "QUESTIONS DU JURY" in up:
                render_qa_body(body, story)
            elif "CHECKLIST" in up:
                render_checklist_body(body, story)
            elif "TIMING" in up:
                # Bloc timing récap : conserver l'alignement en police monospace
                mono = ParagraphStyle(
                    "Mono", fontName="Courier", fontSize=11, leading=15,
                    textColor=C_BODY, spaceAfter=2,
                )
                for ln in body:
                    if ln.strip() == "":
                        story.append(Spacer(1, 4))
                    else:
                        # préserver les espaces
                        safe = esc(ln.rstrip()).replace(" ", "&nbsp;")
                        story.append(Paragraph(safe, mono))
            elif "BONNE CHANCE" in up:
                render_generic_body(body, story, style=S_COVER_SUB)
            else:
                render_generic_body(body, story)

            story.append(PageBreak())

    # Retirer le PageBreak final éventuel pour éviter une page blanche
    while story and isinstance(story[-1], PageBreak):
        story.pop()

    doc.build(story, onFirstPage=_footer, onLaterPages=_footer)
    print(f"OK : {DST}  ({DST.stat().st_size / 1024:.1f} Ko)")

if __name__ == "__main__":
    build()
