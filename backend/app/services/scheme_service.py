import os
import json
from typing import List, Dict, Any, Optional
from app.core.config import DATA_RAW
from app.schemas import SchemeItem, SchemeSearchResponse, EntrepreneurProfile

class GovernmentSchemeService:
    def __init__(self):
        self.schemes_path = os.path.join(DATA_RAW, "mosje_schemes.json")
        self.schemes_raw = []

        if os.path.exists(self.schemes_path):
            with open(self.schemes_path, "r", encoding="utf-8") as f:
                self.schemes_raw = json.load(f)

        print(f"[Entre Help] Loaded {len(self.schemes_raw)} schemes from {self.schemes_path}")

    def get_all_schemes(self) -> List[SchemeItem]:
        return [SchemeItem(**s) for s in self.schemes_raw]

    def get_scheme_by_id(self, scheme_id: str) -> Optional[Dict[str, Any]]:
        for s in self.schemes_raw:
            if s["id"] == scheme_id:
                return s
        return None

    def search_schemes(self, query: Optional[str] = None, category: Optional[str] = None) -> SchemeSearchResponse:
        results = []
        categories = sorted(list(set([s["category"] for s in self.schemes_raw])))

        q_tokens = query.lower().split() if query else []

        for s in self.schemes_raw:
            # Category filter
            if category and category != "All" and s["category"].lower() != category.lower():
                continue

            # Search query matching
            if q_tokens:
                blob = f"{s['scheme_name']} {s['short_name']} {s['category']} {s['description']} {s['benefits']} {s['target_beneficiaries']}".lower()
                matches = sum([1 for tok in q_tokens if tok in blob])
                if matches == 0:
                    continue
                score = round(matches / len(q_tokens), 2)
            else:
                score = 1.0

            item = SchemeItem(**s)
            item.match_score = score
            results.append(item)

        results.sort(key=lambda x: x.match_score or 0.0, reverse=True)

        return SchemeSearchResponse(
            total_schemes=len(results),
            results=results,
            categories=["All"] + categories,
            disclaimer=f"Showing {len(results)} of {len(self.schemes_raw)} schemes."
        )

    def match_for_profile(self, profile: EntrepreneurProfile) -> List[SchemeItem]:
        """
        Core AI-driven matching engine. Scores each scheme against the entrepreneur's profile
        using deterministic rule-based scoring across multiple eligibility dimensions.
        """
        matched = []

        for s in self.schemes_raw:
            reasons = []
            score = 0.0
            crit = s.get("eligibility_criteria", {})

            # ── 1. Social Category Match (Critical — disqualifying if no match) ──
            scheme_categories = crit.get("social_category", [])
            cat_match = False
            if not scheme_categories or "All" in scheme_categories:
                cat_match = True
                score += 0.10
            else:
                prof_cat = profile.social_category.upper().strip()
                for sc in scheme_categories:
                    sc_upper = sc.upper().strip()
                    if prof_cat == sc_upper or (prof_cat == "EWS" and sc_upper in ["EWS", "GENERAL"]):
                        cat_match = True
                        break
                    if sc_upper == "WOMEN" and profile.gender.lower() == "female":
                        cat_match = True
                        break

                if cat_match:
                    score += 0.25
                    reasons.append(f"Designated for {profile.social_category} beneficiaries.")
                else:
                    # Hard disqualification — category doesn't match
                    continue

            # ── 2. Income Eligibility ──
            max_income = crit.get("max_annual_income", 0)
            if max_income and max_income > 0:
                if profile.annual_income <= max_income:
                    score += 0.20
                    reasons.append(f"Income ₹{profile.annual_income:,.0f} is within ₹{max_income:,.0f} limit.")
                else:
                    # Income exceeds — disqualify
                    continue
            else:
                # No income restriction
                score += 0.10

            # ── 3. Gender Match ──
            scheme_genders = crit.get("gender", [])
            if scheme_genders:
                gender_match = any(g.lower() == profile.gender.lower() for g in scheme_genders)
                if gender_match:
                    score += 0.10
                    if profile.gender.lower() == "female" and any(
                        kw in s.get("scheme_name", "").lower()
                        for kw in ["mahila", "women", "nari", "swarnima"]
                    ):
                        score += 0.10
                        reasons.append("Women-specific scheme — enhanced eligibility.")
                else:
                    continue  # Gender disqualified

            # ── 4. Age Eligibility ──
            min_age = crit.get("min_age", 18)
            max_age = crit.get("max_age", 65)
            if min_age <= profile.age <= max_age:
                score += 0.05
            else:
                continue  # Age disqualified

            # ── 5. Project Cost / Loan Amount Feasibility ──
            max_project = s.get("max_project_cost", 0)
            if max_project and max_project > 0:
                if profile.project_cost <= max_project:
                    score += 0.15
                    reasons.append(f"Project cost ₹{profile.project_cost:,.0f} within scheme limit ₹{max_project:,.0f}.")
                else:
                    score += 0.02  # Over limit but don't hard disqualify
                    reasons.append(f"⚠️ Project cost exceeds ₹{max_project:,.0f} cap — partial coverage possible.")

            # ── 6. Business Type Alignment ──
            project_types = crit.get("project_types", [])
            if project_types:
                bt_match = any(
                    profile.business_type.lower() in pt.lower() or pt.lower() in profile.business_type.lower()
                    for pt in project_types
                )
                if bt_match:
                    score += 0.10
                    reasons.append(f"Business type '{profile.business_type}' is eligible.")
                else:
                    score += 0.02  # Not exact match but don't disqualify

            # ── 7. State Applicability ──
            states = crit.get("states", [])
            if states:
                state_match = "All States" in states or any(
                    profile.state.lower() in st.lower() for st in states
                )
                if state_match:
                    score += 0.05
                    if "All States" not in states:
                        reasons.append(f"State specific scheme active in {profile.state}.")
                else:
                    # State restricted scheme — disqualify if applicant lives in a different state
                    continue

            # ── 8. PwD Bonus ──
            if profile.is_pwd:
                scheme_name_lower = s.get("scheme_name", "").lower()
                if "divyang" in scheme_name_lower or "pwd" in scheme_name_lower or "disab" in scheme_name_lower:
                    score += 0.15
                    reasons.append("PwD-specific scheme — priority eligibility.")

            # ── 9. SHG Member Bonus ──
            if profile.is_shg_member:
                if "shg" in s.get("target_beneficiaries", "").lower() or "svep" in s.get("id", ""):
                    score += 0.10
                    reasons.append("SHG member — eligible for community enterprise support.")

            # Normalize score to 0-1 range, cap at 0.98
            score = min(0.98, round(score, 2))

            if not reasons:
                reasons = ["Meets general eligibility criteria for this scheme."]

            item = SchemeItem(**s)
            item.match_score = score
            item.match_reasons = reasons
            matched.append(item)

        matched.sort(key=lambda x: x.match_score or 0.0, reverse=True)
        return matched


scheme_service = GovernmentSchemeService()
