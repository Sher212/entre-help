// In production (Vercel), VITE_API_URL points to the deployed backend (e.g. https://entrehelp-backend.onrender.com/api)
// In local dev, the Vite proxy handles /api -> localhost:8000
export const API_BASE = import.meta.env.VITE_API_URL || "/api";
export const BACKEND_HOST = API_BASE.replace(/\/api$/, "");

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || `API Error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Error calling ${endpoint}:`, err);
    throw err;
  }
}

// ─── Scheme Matching ───
export const searchSchemes = (query = "", category = "All") => {
  let url = "/schemes/search?";
  if (query) url += `query=${encodeURIComponent(query)}&`;
  if (category && category !== "All") url += `category=${encodeURIComponent(category)}&`;
  return fetchApi(url);
};

export const matchSchemesProfile = (profile) =>
  fetchApi("/schemes/match-profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });

export const getSchemeDetail = (schemeId) =>
  fetchApi(`/schemes/${schemeId}`);

export const getSchemeCategories = () =>
  fetchApi("/schemes/categories");

// ─── Channel Partners ───
export const searchChannelPartners = (state = "", type = "") => {
  let url = "/channel-partners/search?";
  if (state) url += `state=${encodeURIComponent(state)}&`;
  if (type) url += `type=${encodeURIComponent(type)}&`;
  return fetchApi(url);
};

export const getChannelPartnerStates = () =>
  fetchApi("/channel-partners/states");

export const getPartnersForState = (state) =>
  fetchApi(`/channel-partners/for-state/${encodeURIComponent(state)}`);

// ─── Loan Calculator ───
export const calculateLoan = (data) =>
  fetchApi("/loan/calculate", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Entrepreneur Profile ───
export const getEntrepreneurProfile = () =>
  fetchApi("/profile");

export const updateEntrepreneurProfile = (profile) =>
  fetchApi("/profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });

export const getProfilePresets = () =>
  fetchApi("/profile/presets");

export const loadProfilePreset = (presetId) =>
  fetchApi(`/profile/presets/${presetId}`, {
    method: "POST",
  });

// ─── AI Assistant ───
export const askAssistant = (message, history = [], farmerProfile = null) =>
  fetchApi("/assistant/chat", {
    method: "POST",
    body: JSON.stringify({ message, history, farmer_profile: farmerProfile }),
  });

// Keep backward compat aliases
export const getFarmerProfile = getEntrepreneurProfile;
export const updateFarmerProfile = updateEntrepreneurProfile;
