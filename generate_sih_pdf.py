from fpdf import FPDF
from fpdf.enums import XPos, YPos

class SIHPresentation(FPDF):
    def header(self):
        # Adding a title header similar to SIH format for subsequent pages
        if self.page_no() > 1:
            self.set_font("helvetica", "B", 16)
            self.set_text_color(0, 51, 102)
            self.cell(0, 10, self.title_text, border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(128)
        self.cell(0, 10, f"Page {self.page_no()}", 0, 0, align="C")

def add_title_page(pdf):
    pdf.add_page()
    pdf.set_font("helvetica", "B", 24)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 20, "SMART INDIA HACKATHON 2025", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.ln(20)
    
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 10, "TITLE PAGE", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.ln(15)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 0, 0)
    
    details = [
        "- Problem Statement ID - [Enter ID]",
        "- Problem Statement Title - AI-Driven Scheme Matching & Bankable DPR Generator",
        "- Theme - Smart Automation / Financial Inclusion",
        "- PS Category - Software",
        "- Team ID - [Enter Team ID]",
        "- Team Name - [Enter Team Name]"
    ]
    
    for detail in details:
        pdf.cell(0, 12, detail, border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

def add_problem_solution_page(pdf):
    pdf.title_text = "Problem & Proposed Solution"
    pdf.add_page()
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Problem:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    problem_text = ("Thousands of crores in affirmative financing schemes remain underutilized. "
                   "Grassroots entrepreneurs face information asymmetry, high consultant costs (Rs 5k-25k for DPR), "
                   "and high rejection rates (65%) for commercial bank loans.")
    pdf.multi_cell(0, 6, problem_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Our Idea:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    idea_text = ("Entre Help is a financial inclusion platform that bridges the gap using AI scheme matching, "
                 "automated bank-ready DPR generation, and smart application auditing.")
    pdf.multi_cell(0, 6, idea_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Proposed Solution:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    solution_text = (
        "- Smart Scheme Recommender (44+ schemes) with profile-driven matching.\n"
        "- Bankable DPR Generator with 1-click PDF export.\n"
        "- Application Auditor & Readiness Score.\n"
        "- Concessional Loan & EMI Calculator."
    )
    pdf.multi_cell(0, 6, solution_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Innovation/Uniqueness:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    innovation_text = (
        "- India's first end-to-end DPR generation engine for marginalized groups.\n"
        "- Real-time profile-driven match score mapping 44+ schemes.\n"
        "- Integrated directory of State Channelizing Agencies (SCAs), PSBs, and RRBs."
    )
    pdf.multi_cell(0, 6, innovation_text)

def add_technical_approach_page(pdf):
    pdf.title_text = "TECHNICAL APPROACH"
    pdf.add_page()
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Hardware & Software:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    tech_text = (
        "- Frontend Framework: React 19 + Vite 8\n"
        "- Styling & UI: Vanilla CSS Design System, Lucide React, Recharts\n"
        "- Backend Framework: FastAPI (Python 3.10+), Uvicorn\n"
        "- Data Handling: Pydantic v2, SQLite Relational Engine\n"
        "- Document Generation: html2pdf.js + Print CSS for browser-side PDF generation"
    )
    pdf.multi_cell(0, 6, tech_text)
    pdf.ln(10)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Flow Chart (Architecture):", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    flow_text = (
        "1. Entrepreneur Profile Engine -> Collects user data.\n"
        "2. Context-Aware AI Scheme Assistant -> Real-time sync.\n"
        "3. Smart Scheme Recommender -> Scheme Compare Engine.\n"
        "4. Application Auditor -> Readiness Score.\n"
        "5. Project & Finance -> Bankable DPR Generator & Loan Calculator.\n"
        "6. Institutional Routing -> State Channel Partner Locator."
    )
    pdf.multi_cell(0, 6, flow_text)

def add_feasibility_viability_page(pdf):
    pdf.title_text = "FEASIBILITY AND VIABILITY"
    pdf.add_page()
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Feasibility:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    feasibility_text = (
        "- Technically robust using standard modern web stack (React + FastAPI).\n"
        "- Easy deployment on cloud platforms with SQLite keeping footprint minimal."
    )
    pdf.multi_cell(0, 6, feasibility_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Commercial Feasibility:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    comm_text = (
        "- Targets a massive demographic (SC/ST/OBC/Women/PwD).\n"
        "- Can be adopted by government bodies (MoSJE, MSME) or NGO networks to deploy at scale."
    )
    pdf.multi_cell(0, 6, comm_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Challenges:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    challenges_text = (
        "- Keeping scheme data and parameters updated with frequent government circulars.\n"
        "- Ensuring vernacular/regional language support for true grassroots reach."
    )
    pdf.multi_cell(0, 6, challenges_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Strategy:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    strategy_text = (
        "- Modular backend architecture for quick data updates.\n"
        "- Future integration with Bhashini/AI translation tools for multi-language support."
    )
    pdf.multi_cell(0, 6, strategy_text)

def add_impact_benefits_page(pdf):
    pdf.title_text = "IMPACT AND BENEFITS"
    pdf.add_page()
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Direct Impact on Target Users:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    direct_impact = (
        "- Eliminates the Rs 5,000 to Rs 25,000 cost barrier for DPR preparation.\n"
        "- Drastically reduces loan application rejection rates by auditing document completeness before filing."
    )
    pdf.multi_cell(0, 6, direct_impact)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Strategic Impact:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    strategic_impact = (
        "- Increases utilization of government allocated funds that currently lapse.\n"
        "- Promotes self-reliance and entrepreneurship among marginalized communities."
    )
    pdf.multi_cell(0, 6, strategic_impact)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Economic & Strategic Benefits:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    econ_impact = (
        "- Accelerates job creation at the grassroots level.\n"
        "- Fosters inclusive economic growth in alignment with Atmanirbhar Bharat vision."
    )
    pdf.multi_cell(0, 6, econ_impact)

def add_research_analysis_page(pdf):
    pdf.title_text = "Research and Analysis"
    pdf.add_page()
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Gap & Problem Identification:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    gap_text = (
        "- Lack of centralized, simplified scheme discovery for specific demographics.\n"
        "- High barrier to entry for formal credit due to complex documentation."
    )
    pdf.multi_cell(0, 6, gap_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Literature Survey & Competitive Analysis:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    lit_text = (
        "- Existing portals like JanSamarth are broad and lack automated DPR generation "
        "and detailed application auditing specific to affirmative action schemes."
    )
    pdf.multi_cell(0, 6, lit_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(0, 8, "Technology Benchmarking:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(0, 0, 0)
    bench_text = (
        "- Modern reactive UI (React 19) vs traditional static government portals.\n"
        "- Automated browser-side document generation vs manual consultant drafting."
    )
    pdf.multi_cell(0, 6, bench_text)

def generate_pdf():
    pdf = SIHPresentation(orientation='L', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=True, margin=15)
    
    add_title_page(pdf)
    add_problem_solution_page(pdf)
    add_technical_approach_page(pdf)
    add_feasibility_viability_page(pdf)
    add_impact_benefits_page(pdf)
    add_research_analysis_page(pdf)
    
    pdf.output("SIH2025_Entre_Help_Presentation.pdf")
    print("PDF generated successfully: SIH2025_Entre_Help_Presentation.pdf")

if __name__ == "__main__":
    generate_pdf()
