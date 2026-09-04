import os
import json
from typing import List, Optional
from app.core.config import DATA_RAW
from app.schemas import ChannelPartnerItem, ChannelPartnerSearchResponse

class ChannelPartnerService:
    def __init__(self):
        self.partners_path = os.path.join(DATA_RAW, "channel_partners.json")
        self.partners_raw = []

        if os.path.exists(self.partners_path):
            with open(self.partners_path, "r", encoding="utf-8") as f:
                self.partners_raw = json.load(f)

        print(f"[Entre Help] Loaded {len(self.partners_raw)} channel partners.")

    def get_all_partners(self) -> List[ChannelPartnerItem]:
        return [ChannelPartnerItem(**p) for p in self.partners_raw]

    def search_partners(
        self,
        state: Optional[str] = None,
        partner_type: Optional[str] = None
    ) -> ChannelPartnerSearchResponse:
        results = []

        for p in self.partners_raw:
            # State filter
            p_state = p.get("state", "")
            if state and state.lower() not in p_state.lower() and p_state.lower() != "all states":
                continue

            # Type filter (SCA, PSB, RRB, NBFC-MFI)
            if partner_type and partner_type.upper() != p.get("type", "").upper():
                continue

            results.append(ChannelPartnerItem(**p))

        return ChannelPartnerSearchResponse(
            total=len(results),
            state=state or "All States",
            results=results
        )

    def get_partners_for_state(self, state: str) -> List[ChannelPartnerItem]:
        """Get all channel partners operating in a given state."""
        results = []
        for p in self.partners_raw:
            if state.lower() in p.get("state", "").lower():
                results.append(ChannelPartnerItem(**p))
        
        # Also include national-level PSBs (they operate in all states)
        for p in self.partners_raw:
            if p.get("type") == "PSB" and p not in [r.model_dump() for r in results]:
                results.append(ChannelPartnerItem(**p))

        return results

    def get_unique_states(self) -> List[str]:
        states = [
            "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
            "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
            "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
            "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
            "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
            "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
        ]
        return sorted(states)


channel_partner_service = ChannelPartnerService()
