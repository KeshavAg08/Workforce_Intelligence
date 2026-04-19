"""
Generate a professional PowerPoint presentation for the
Workforce Pipeline Risk Forecasting System project.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ── Colour Palette ──────────────────────────────────────────────
DARK_BG      = RGBColor(0x0F, 0x17, 0x2A)   # deep navy
ACCENT_BLUE  = RGBColor(0x38, 0xBD, 0xF8)   # bright cyan-blue
ACCENT_PURPLE= RGBColor(0xA7, 0x8B, 0xFA)   # soft purple
WHITE        = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GRAY   = RGBColor(0xC8, 0xD6, 0xE5)
ORANGE       = RGBColor(0xFF, 0x9F, 0x43)
GREEN        = RGBColor(0x00, 0xD2, 0xD3)
CARD_BG      = RGBColor(0x1A, 0x25, 0x3C)   # slightly lighter navy

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

prs = Presentation()
prs.slide_width  = SLIDE_W
prs.slide_height = SLIDE_H

# ── Helper functions ────────────────────────────────────────────
def _add_bg(slide, color=DARK_BG):
    """Fill the entire slide background with a solid colour."""
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

def _add_shape(slide, left, top, width, height, fill_color, border_color=None, radius=None):
    """Add a rounded rectangle shape."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
    else:
        shape.line.fill.background()
    return shape

def _add_textbox(slide, left, top, width, height, text, font_size=18,
                 color=WHITE, bold=False, align=PP_ALIGN.LEFT, font_name="Calibri"):
    """Add a text box and return the paragraph for further tweaks."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = align
    return tf

def _add_multiline(slide, left, top, width, height, lines, font_size=16,
                   color=WHITE, bold=False, align=PP_ALIGN.LEFT,
                   font_name="Calibri", spacing=1.2, bullet=False):
    """Add a text box with multiple paragraphs."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True

    for i, line in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        display = ("•  " + line) if bullet else line
        p.text = display
        p.font.size = Pt(font_size)
        p.font.color.rgb = color
        p.font.bold = bold
        p.font.name = font_name
        p.alignment = align
        p.space_after = Pt(font_size * spacing * 0.5)
    return tf

def _accent_bar(slide, top, color=ACCENT_BLUE):
    """Thin horizontal accent bar across the slide."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(0.8), top, Inches(11.7), Pt(4)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()

def _section_number(slide, number, top):
    """Circular section number badge."""
    circle = slide.shapes.add_shape(
        MSO_SHAPE.OVAL,
        Inches(0.8), top, Inches(0.6), Inches(0.6)
    )
    circle.fill.solid()
    circle.fill.fore_color.rgb = ACCENT_BLUE
    circle.line.fill.background()
    tf = circle.text_frame
    tf.word_wrap = False
    p = tf.paragraphs[0]
    p.text = str(number)
    p.font.size = Pt(18)
    p.font.color.rgb = DARK_BG
    p.font.bold = True
    p.font.name = "Calibri"
    p.alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].space_before = Pt(0)


# ================================================================
# SLIDE 1 – TITLE SLIDE
# ================================================================
slide1 = prs.slides.add_slide(prs.slide_layouts[6])  # blank
_add_bg(slide1)

# Decorative top bar
shape = slide1.shapes.add_shape(
    MSO_SHAPE.RECTANGLE,
    Inches(0), Inches(0), SLIDE_W, Inches(0.08)
)
shape.fill.solid()
shape.fill.fore_color.rgb = ACCENT_BLUE
shape.line.fill.background()

_add_textbox(slide1, Inches(1.5), Inches(1.5), Inches(10.3), Inches(1.2),
             "WORKFORCE PIPELINE", font_size=48, color=ACCENT_BLUE,
             bold=True, align=PP_ALIGN.CENTER)

_add_textbox(slide1, Inches(1.5), Inches(2.5), Inches(10.3), Inches(1),
             "Risk Forecasting System", font_size=36, color=WHITE,
             bold=False, align=PP_ALIGN.CENTER)

_accent_bar(slide1, Inches(3.4))

_add_textbox(slide1, Inches(1.5), Inches(3.8), Inches(10.3), Inches(0.8),
             "An end-to-end Workforce Intelligence Platform that predicts talent\n"
             "shortages, hiring timelines, and skill gaps across industries.",
             font_size=18, color=LIGHT_GRAY, align=PP_ALIGN.CENTER)

# Team card
card = _add_shape(slide1, Inches(4), Inches(5), Inches(5.3), Inches(1.8),
                  CARD_BG, border_color=ACCENT_BLUE)
_add_textbox(slide1, Inches(4.2), Inches(5.1), Inches(5), Inches(0.5),
             "TEAM", font_size=14, color=ACCENT_BLUE, bold=True,
             align=PP_ALIGN.CENTER)

_add_textbox(slide1, Inches(4.2), Inches(5.5), Inches(5), Inches(1.2),
             "Keshav Agarwal", font_size=22, color=WHITE,
             bold=True, align=PP_ALIGN.CENTER)

# ================================================================
# SLIDE 2 – PROBLEM STATEMENT / OBJECTIVE
# ================================================================
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
_add_bg(slide2)
_section_number(slide2, 1, Inches(0.5))
_add_textbox(slide2, Inches(1.6), Inches(0.45), Inches(10), Inches(0.7),
             "Problem Statement & Objective", font_size=32,
             color=WHITE, bold=True)
_accent_bar(slide2, Inches(1.2))

# Industry side
card_l = _add_shape(slide2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
                    CARD_BG, border_color=ACCENT_BLUE)
_add_textbox(slide2, Inches(1.2), Inches(1.75), Inches(5), Inches(0.5),
             "🏢  Industries Struggle To Answer", font_size=18,
             color=ACCENT_BLUE, bold=True)
_add_multiline(slide2, Inches(1.2), Inches(2.4), Inches(5), Inches(2.5),
               ["When will we need to hire?",
                "Is our talent pipeline strong enough?",
                "Which companies face hiring pressure first?"],
               font_size=16, color=LIGHT_GRAY, bullet=True, spacing=1.8)

# Student side
card_r = _add_shape(slide2, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2),
                    CARD_BG, border_color=ACCENT_PURPLE)
_add_textbox(slide2, Inches(7.3), Inches(1.75), Inches(5), Inches(0.5),
             "🎓  Students / Job Seekers Struggle To Answer", font_size=18,
             color=ACCENT_PURPLE, bold=True)
_add_multiline(slide2, Inches(7.3), Inches(2.4), Inches(5), Inches(2.5),
               ["Which industries are hiring next?",
                "Which companies should I target?",
                "How ready is my resume for future jobs?"],
               font_size=16, color=LIGHT_GRAY, bullet=True, spacing=1.8)

# Objective
_add_shape(slide2, Inches(2.5), Inches(5.2), Inches(8.3), Inches(1.5),
           CARD_BG, border_color=GREEN)
_add_textbox(slide2, Inches(2.8), Inches(5.3), Inches(7.7), Inches(1.3),
             "🎯 Objective: Bridge the gap between workforce demand forecasting\n"
             "and career planning using explainable, rule-based AI logic.",
             font_size=17, color=GREEN, bold=True, align=PP_ALIGN.CENTER)

# ================================================================
# SLIDE 3 – DATASET ACQUISITION
# ================================================================
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
_add_bg(slide3)
_section_number(slide3, 2, Inches(0.5))
_add_textbox(slide3, Inches(1.6), Inches(0.45), Inches(10), Inches(0.7),
             "Dataset Acquisition", font_size=32, color=WHITE, bold=True)
_accent_bar(slide3, Inches(1.2))

datasets = [
    ("attrition_data.csv",   "Industry, Year, Attrition_Rate",
     "Tracks employee attrition rates across 5 industries (2022-2026)"),
    ("industry_growth.csv",  "Industry, Year, Growth_Rate",
     "Records year-over-year growth rates per industry"),
    ("internship_data.csv",  "Industry, Year, Interns_Intake,\nConversion_Rate, Top_Skills",
     "Measures talent supply via intern pipelines & conversion"),
    ("hiring_velocity.csv",  "Industry, Year, Avg_Time_To_Fill_Days,\nHiring_Rate_Per_Quarter",
     "Captures speed & volume of hiring activity"),
    ("company_profiles.csv", "Company_Name, Industry,\nCore_Skills, Emerging_Skills",
     "Maps 25 companies to industries with skill profiles"),
]

for i, (fname, cols, desc) in enumerate(datasets):
    y = Inches(1.55) + Inches(i * 1.12)
    _add_shape(slide3, Inches(0.8), y, Inches(11.7), Inches(1.0),
               CARD_BG, border_color=ACCENT_BLUE)
    _add_textbox(slide3, Inches(1.1), y + Pt(6), Inches(2.8), Inches(0.8),
                 fname, font_size=15, color=ACCENT_BLUE, bold=True)
    _add_textbox(slide3, Inches(4.0), y + Pt(6), Inches(3.5), Inches(0.8),
                 cols, font_size=13, color=LIGHT_GRAY)
    _add_textbox(slide3, Inches(7.8), y + Pt(6), Inches(4.5), Inches(0.8),
                 desc, font_size=13, color=WHITE)

_add_textbox(slide3, Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.4),
             "📌 All data is synthetic but deterministic — derived from real-world baselines. "
             "5 industries × 5 years × 5 companies each.",
             font_size=13, color=ORANGE, align=PP_ALIGN.LEFT)

# ================================================================
# SLIDE 4 – EXPLORATORY DATA ANALYSIS (EDA)
# ================================================================
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
_add_bg(slide4)
_section_number(slide4, 3, Inches(0.5))
_add_textbox(slide4, Inches(1.6), Inches(0.45), Inches(10), Inches(0.7),
             "Exploratory Data Analysis (EDA)", font_size=32,
             color=WHITE, bold=True)
_accent_bar(slide4, Inches(1.2))

eda_items = [
    ("Growth Trends",
     "EV sector leads with 22–30% annual growth.\n"
     "IT shows consistent ~9-13% growth.\n"
     "Manufacturing grows the slowest at 1-5%."),
    ("Attrition Analysis",
     "IT has the highest attrition (14-19%).\n"
     "Manufacturing is the most stable (4-11%).\n"
     "All industries show a spike in 2025."),
    ("Talent Supply Pipeline",
     "IT has the largest intern intake (~1500 in 2026).\n"
     "EV has the lowest conversion rate (~24%).\n"
     "Finance has the best conversion rate (~46%)."),
    ("Hiring Velocity",
     "Healthcare takes the longest to fill roles (~58 days).\n"
     "Manufacturing is the fastest (~20 days in 2026).\n"
     "EV & Manufacturing show rising hiring rates."),
]

for i, (title, body) in enumerate(eda_items):
    col = i % 2
    row = i // 2
    x = Inches(0.8) + Inches(col * 6.15)
    y = Inches(1.55) + Inches(row * 2.85)
    _add_shape(slide4, x, y, Inches(5.85), Inches(2.55),
               CARD_BG, border_color=[ACCENT_BLUE, ACCENT_PURPLE, GREEN, ORANGE][i])
    _add_textbox(slide4, x + Inches(0.3), y + Inches(0.15), Inches(5.2), Inches(0.4),
                 title, font_size=18,
                 color=[ACCENT_BLUE, ACCENT_PURPLE, GREEN, ORANGE][i], bold=True)
    _add_textbox(slide4, x + Inches(0.3), y + Inches(0.65), Inches(5.2), Inches(1.8),
                 body, font_size=14, color=LIGHT_GRAY)

# ================================================================
# SLIDE 5 – DATA PREPROCESSING STEPS
# ================================================================
slide5 = prs.slides.add_slide(prs.slide_layouts[6])
_add_bg(slide5)
_section_number(slide5, 4, Inches(0.5))
_add_textbox(slide5, Inches(1.6), Inches(0.45), Inches(10), Inches(0.7),
             "Data Preprocessing Steps", font_size=32,
             color=WHITE, bold=True)
_accent_bar(slide5, Inches(1.2))

steps = [
    ("01", "Data Loading & Merging",
     "All 5 CSVs loaded via Pandas and merged on Industry + Year keys to create a unified analysis dataframe."),
    ("02", "Talent Supply Calculation",
     "Supply = Interns_Intake × Conversion_Rate\nComputed for every industry-year pair to quantify the talent pipeline output."),
    ("03", "Talent Demand Calculation",
     "Demand = Growth_Rate + (Attrition_Rate × 1.5)\nCombines industry expansion with replacement needs due to attrition."),
    ("04", "Percentile Normalization (P5–P95)",
     "Supply and Demand scores normalized to 0-100 using 5th–95th percentile bounds per industry. Prevents artificial 0/100 spikes."),
    ("05", "Workforce Risk Scoring",
     "Core_Risk = (Demand − Supply) + (Attrition × 15)\nBaseline_Risk = 5 + (Attrition × 10) + (Trend × 0.5)\nFinal_Risk = max(Core, Baseline)"),
    ("06", "Hiring Pressure Index (HPI)",
     "HPI = (Demand − Supply) + (Attrition × 20) + (Trend × 0.8)\nMapped to hiring timeline: 1-3 / 4-6 / 6-12 months."),
]

for i, (num, title, desc) in enumerate(steps):
    col = i % 3
    row = i // 3
    x = Inches(0.8) + Inches(col * 4.05)
    y = Inches(1.55) + Inches(row * 2.85)
    _add_shape(slide5, x, y, Inches(3.75), Inches(2.65), CARD_BG, border_color=ACCENT_BLUE)
    # Number badge
    badge = slide5.shapes.add_shape(MSO_SHAPE.OVAL, x + Inches(0.15), y + Inches(0.15),
                                     Inches(0.45), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = ACCENT_BLUE
    badge.line.fill.background()
    tf = badge.text_frame
    p = tf.paragraphs[0]
    p.text = num
    p.font.size = Pt(14)
    p.font.color.rgb = DARK_BG
    p.font.bold = True
    p.alignment = PP_ALIGN.CENTER

    _add_textbox(slide5, x + Inches(0.7), y + Inches(0.15), Inches(2.8), Inches(0.45),
                 title, font_size=15, color=ACCENT_BLUE, bold=True)
    _add_textbox(slide5, x + Inches(0.2), y + Inches(0.7), Inches(3.3), Inches(1.8),
                 desc, font_size=12, color=LIGHT_GRAY)

# ================================================================
# SLIDE 6 – KEY FINDINGS / INSIGHTS
# ================================================================
slide6 = prs.slides.add_slide(prs.slide_layouts[6])
_add_bg(slide6)
_section_number(slide6, 5, Inches(0.5))
_add_textbox(slide6, Inches(1.6), Inches(0.45), Inches(10), Inches(0.7),
             "Key Findings & Insights", font_size=32,
             color=WHITE, bold=True)
_accent_bar(slide6, Inches(1.2))

findings = [
    ("🔴", "IT has the highest workforce risk",
     "Combination of high attrition (14-19%) and strong demand creates persistent talent shortages.",
     ACCENT_BLUE),
    ("🟡", "EV is the fastest-growing sector",
     "22-30% annual growth rate but low intern conversion (24%) signals a widening supply-demand gap.",
     ACCENT_PURPLE),
    ("🟢", "Manufacturing is the most stable",
     "Low attrition, fastest hiring velocity, and moderate growth make it the most resilient.",
     GREEN),
    ("🔵", "Finance has the strongest talent pipeline",
     "Highest intern conversion rate (~46%) effectively translates supply into workforce.",
     ORANGE),
    ("📊", "2025 shows a cross-industry attrition spike",
     "All industries experienced elevated attrition in 2025, suggesting macro-economic pressure.",
     ACCENT_BLUE),
    ("🎯", "Hiring surge predicted for EV & Manufacturing in early 2026",
     "High HPI scores place these industries in the 1-3 month immediate hiring window.",
     GREEN),
]

for i, (icon, title, desc, color) in enumerate(findings):
    col = i % 2
    row = i // 2
    x = Inches(0.8) + Inches(col * 6.15)
    y = Inches(1.55) + Inches(row * 1.9)
    _add_shape(slide6, x, y, Inches(5.85), Inches(1.7), CARD_BG, border_color=color)
    _add_textbox(slide6, x + Inches(0.2), y + Inches(0.1), Inches(5.4), Inches(0.4),
                 f"{icon}  {title}", font_size=16, color=color, bold=True)
    _add_textbox(slide6, x + Inches(0.2), y + Inches(0.55), Inches(5.4), Inches(1.0),
                 desc, font_size=13, color=LIGHT_GRAY)

# ================================================================
# SLIDE 7 – CONTRIBUTION OF EACH TEAM MEMBER
# ================================================================
slide7 = prs.slides.add_slide(prs.slide_layouts[6])
_add_bg(slide7)
_section_number(slide7, 6, Inches(0.5))
_add_textbox(slide7, Inches(1.6), Inches(0.45), Inches(10), Inches(0.7),
             "Team Contributions", font_size=32,
             color=WHITE, bold=True)
_accent_bar(slide7, Inches(1.2))

# Since there's one author, show contributions as areas of work
_add_shape(slide7, Inches(1.5), Inches(1.7), Inches(10.3), Inches(5.2),
           CARD_BG, border_color=ACCENT_BLUE)

_add_textbox(slide7, Inches(2), Inches(1.9), Inches(9.3), Inches(0.6),
             "Keshav Agarwal  — Full-Stack Developer & Data Analyst",
             font_size=24, color=ACCENT_BLUE, bold=True, align=PP_ALIGN.CENTER)

contribs = [
    ("📊  Data Engineering", "Designed synthetic datasets, preprocessing pipeline, percentile normalization"),
    ("🧠  Analytics Engine", "Built workforce risk scoring, HPI calculation, hiring surge prediction logic"),
    ("🔙  Backend (FastAPI)", "REST APIs, JWT auth, RBAC, resume analyzer, company comparison endpoints"),
    ("🎨  Frontend (React)", "Industry & Student dashboards, What-If simulator, Company comparisons, Resume Analyzer UI"),
    ("🔐  Security", "JWT-based authentication, role-based access (INDUSTRY_USER / STUDENT_USER)"),
    ("📄  Documentation", "README, architecture docs, formula documentation, presentation"),
]

for i, (area, detail) in enumerate(contribs):
    y = Inches(2.7) + Inches(i * 0.68)
    _add_textbox(slide7, Inches(2.2), y, Inches(3.5), Inches(0.6),
                 area, font_size=16, color=WHITE, bold=True)
    _add_textbox(slide7, Inches(5.8), y, Inches(5.5), Inches(0.6),
                 detail, font_size=14, color=LIGHT_GRAY)

# ================================================================
# SLIDE 8 – CONCLUSION / NEXT STEPS
# ================================================================
slide8 = prs.slides.add_slide(prs.slide_layouts[6])
_add_bg(slide8)
_section_number(slide8, 7, Inches(0.5))
_add_textbox(slide8, Inches(1.6), Inches(0.45), Inches(10), Inches(0.7),
             "Conclusion & Next Steps", font_size=32,
             color=WHITE, bold=True)
_accent_bar(slide8, Inches(1.2))

# Conclusion card
_add_shape(slide8, Inches(0.8), Inches(1.55), Inches(5.6), Inches(5.3),
           CARD_BG, border_color=GREEN)
_add_textbox(slide8, Inches(1.1), Inches(1.7), Inches(5), Inches(0.5),
             "✅  Conclusion", font_size=22, color=GREEN, bold=True)
_add_multiline(slide8, Inches(1.1), Inches(2.3), Inches(5), Inches(4),
               [
                   "Built an end-to-end workforce intelligence platform",
                   "Explainable AI (no black-box models) — full transparency",
                   "Dual dashboards for Industries AND Job Seekers",
                   "Deterministic outputs — same inputs always yield same results",
                   "Resume analyzer aligned with future hiring trends",
                   "Company-level comparison within industries",
               ],
               font_size=14, color=LIGHT_GRAY, bullet=True, spacing=2.0)

# Next Steps card
_add_shape(slide8, Inches(6.9), Inches(1.55), Inches(5.6), Inches(5.3),
           CARD_BG, border_color=ACCENT_PURPLE)
_add_textbox(slide8, Inches(7.2), Inches(1.7), Inches(5), Inches(0.5),
             "🚀  Next Steps", font_size=22, color=ACCENT_PURPLE, bold=True)
_add_multiline(slide8, Inches(7.2), Inches(2.3), Inches(5), Inches(4),
               [
                   "Integrate real job postings from live job boards",
                   "Add resume versioning to track iteration improvements",
                   "Build skill similarity mapping visualizations",
                   "Add admin analytics for institutional insights",
                   "Deploy to cloud (AWS / GCP / Azure)",
                   "Expand dataset to more industries & geographies",
               ],
               font_size=14, color=LIGHT_GRAY, bullet=True, spacing=2.0)

# Thank you footer
_add_textbox(slide8, Inches(1.5), Inches(7.0), Inches(10.3), Inches(0.4),
             "Thank You!", font_size=20, color=ACCENT_BLUE,
             bold=True, align=PP_ALIGN.CENTER)

# ── Save ────────────────────────────────────────────────────────
output_path = r"d:\Project\Workforce_Pipeline on git\Workforce_Pipeline_Presentation.pptx"
prs.save(output_path)
print(f"✅ Presentation saved to: {output_path}")
