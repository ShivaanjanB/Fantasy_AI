import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â
// FANTASYCOACH AI ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â COMPLETE FRONTEND
// FUT-inspired squad builder with RAG-powered AI assistant
// ÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â

const BASE = "http://localhost:8000";
const BUDGET = 100.0;

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ FORMATIONS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const FORMATIONS = {
  "433": [[{pos:"GK"}],[{pos:"RB"},{pos:"CB"},{pos:"CB"},{pos:"LB"}],[{pos:"RM"},{pos:"CM"},{pos:"LM"}],[{pos:"RW"},{pos:"ST"},{pos:"LW"}]],
  "442": [[{pos:"GK"}],[{pos:"RB"},{pos:"CB"},{pos:"CB"},{pos:"LB"}],[{pos:"RM"},{pos:"CM"},{pos:"CM"},{pos:"LM"}],[{pos:"ST"},{pos:"ST"}]],
  "4231":[[{pos:"GK"}],[{pos:"RB"},{pos:"CB"},{pos:"CB"},{pos:"LB"}],[{pos:"CDM"},{pos:"CDM"}],[{pos:"RW"},{pos:"CAM"},{pos:"LW"}],[{pos:"ST"}]],
  "352": [[{pos:"GK"}],[{pos:"CB"},{pos:"CB"},{pos:"CB"}],[{pos:"RM"},{pos:"CM"},{pos:"CM"},{pos:"CM"},{pos:"LM"}],[{pos:"ST"},{pos:"ST"}]],
  "532": [[{pos:"GK"}],[{pos:"RWB"},{pos:"CB"},{pos:"CB"},{pos:"CB"},{pos:"LWB"}],[{pos:"CM"},{pos:"CM"},{pos:"CM"}],[{pos:"ST"},{pos:"ST"}]],
};
const FORMAT_LABELS = {"433":"4-3-3","442":"4-4-2","4231":"4-2-3-1","352":"3-5-2","532":"5-3-2"};

function normCost(p) { const c = parseFloat(p.cost) || 0; return c > 50 ? c / 10 : c; }

const POS_MAP = {
  GK:"GK",RB:"DEF",LB:"DEF",CB:"DEF",RWB:"DEF",LWB:"DEF",
  CDM:"MID",CM:"MID",RM:"MID",LM:"MID",CAM:"MID",RW:"MID",LW:"MID",
  ST:"FWD",CF:"FWD",
};

function getTier(pts) {
  if (pts >= 150) return "elite";
  if (pts >= 80) return "special";
  return "gold";
}

const tierColors = {
  gold:    { bg: "linear-gradient(162deg,#1a160a 0%,#2a2010 50%,#1e1a0c 100%)", border: "#6a5020", accent: "#e8cc70", dimAccent: "rgba(232,204,112,0.5)" },
  special: { bg: "linear-gradient(162deg,#080c1e 0%,#0e1635 50%,#08102a 100%)", border: "#2a4080", accent: "#a0c4f8", dimAccent: "rgba(160,196,248,0.5)" },
  elite:   { bg: "linear-gradient(162deg,#080c1e 0%,#12185a 50%,#0a0e2a 100%)", border: "var(--gold)", accent: "var(--gold2)", dimAccent: "rgba(240,208,128,0.5)" },
};

const POS_COLORS = { GK: "#c8a84b", DEF: "#5adb8a", MID: "#3b8ae2", FWD: "#e25a5a" };

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ API ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
async function fetchPlayers(params = {}) {
  const q = new URLSearchParams({ sort_by: "total_points", limit: 300, ...params });
  try {
    const r = await fetch(`${BASE}/api/players?${q}`);
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : d.players || [];
  } catch { return []; }
}
async function fetchStandings() {
  try { const r = await fetch(`${BASE}/api/standings`); return r.json(); } catch { return null; }
}
async function fetchNews() {
  try { const r = await fetch(`${BASE}/api/news`); const d = await r.json(); return d.articles || []; } catch { return []; }
}
async function fetchInjuries() {
  try { const r = await fetch(`${BASE}/api/injuries`); const d = await r.json(); return d.injuries || []; } catch { return []; }
}
async function checkHealth() {
  try { const r = await fetch(`${BASE}/api/health`); return r.json(); } catch { return { status: "offline" }; }
}
async function* streamChat(query, teamContext = []) {
  const res = await fetch(`${BASE}/api/chat/stream`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_n: 5, team_context: teamContext }),
  });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value).split("\n")) {
      if (!line.startsWith("data: ")) continue;
      try { yield JSON.parse(line.slice(6)); } catch {}
    }
  }
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ IMAGE HELPERS (Sportmonks-first) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function playerPhoto(p) { return p.photo_url || p.photo || ""; }
function playerBadge(p) { return p.badge_url || p.badge || ""; }
function playerFlag(p) { return p.flag_url || p.flag || ""; }
function ImgSafe({ src, alt = "", style, className }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return <img src={src} alt={alt} style={style} className={className} onError={() => setFailed(true)} loading="lazy" />;
}
function ClubBadge({ player, size = 16 }) {
  const [err, setErr] = useState(false);
  const src = playerBadge(player);
  const abbr = (player.team_name || player.team || "?").slice(0, 3).toUpperCase();
  if (!src || err) return (
    <div style={{ width: size, height: size, borderRadius: 2, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "Oswald,sans-serif", fontSize: size * 0.45, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{abbr.slice(0,1)}</span>
    </div>
  );
  return <img src={src} alt={abbr} style={{ width: size, height: size, objectFit: "contain" }} onError={() => setErr(true)} loading="lazy" />;
}
function NatFlag({ player, width = 18, height = 12 }) {
  const [err, setErr] = useState(false);
  const src = playerFlag(player);
  const nat = (player.nationality || "").slice(0, 3).toUpperCase();
  if (!src || err) return nat ? <span style={{ fontSize: 8, fontFamily: "Oswald,sans-serif", color: "rgba(255,255,255,0.35)", letterSpacing: 0.5, lineHeight: 1 }}>{nat}</span> : null;
  return <img src={src} alt={nat} style={{ width, height, objectFit: "cover", borderRadius: 1, border: "1px solid rgba(255,255,255,0.12)" }} onError={() => setErr(true)} loading="lazy" />;
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ PLAYSTYLE TAGS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function getPlaystyles(p) {
  const tags = [];
  const xg = parseFloat(p.xg || 0), xa = parseFloat(p.xa || 0);
  const goals = p.goals || 0, assists = p.assists || 0, cs = p.clean_sheets || 0;
  if (p.position === "GK") { if (cs > 10) tags.push("Clean Sheet King"); tags.push("Shot Stopper"); return tags; }
  if (p.position === "DEF") { if (cs > 8) tags.push("Defensive Wall"); if (xa > 2) tags.push("Ball Playing"); if (goals > 2) tags.push("Set Piece Threat"); return tags; }
  if (p.position === "MID") { if (xg > 8) tags.push("Goal Threat"); if (xa > 5) tags.push("Playmaker"); if (goals > 8 && assists > 5) tags.push("Complete Mid"); return tags; }
  if (p.position === "FWD") { if (xg > 15) tags.push("Elite Striker"); if (goals > 15) tags.push("Prolific"); if (xa > 4) tags.push("Creative FWD"); return tags; }
  return tags;
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ CHEMISTRY ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
// Playstyle compatibility: certain playstyle combos boost chemistry
function areCompatible(a, b) {
  const tA = getPlaystyles(a), tB = getPlaystyles(b);
  if ((tA.includes("Playmaker") || tA.includes("Creative FWD") || tA.includes("Ball Playing")) &&
      (tB.includes("Prolific") || tB.includes("Elite Striker") || tB.includes("Goal Threat"))) return true;
  if ((tB.includes("Playmaker") || tB.includes("Creative FWD") || tB.includes("Ball Playing")) &&
      (tA.includes("Prolific") || tA.includes("Elite Striker") || tA.includes("Goal Threat"))) return true;
  if ((tA.includes("Defensive Wall") || tA.includes("Clean Sheet King")) &&
      (tB.includes("Defensive Wall") || tB.includes("Clean Sheet King"))) return true;
  if (tA.includes("Complete Mid") || tB.includes("Complete Mid")) return true;
  return false;
}

function calcChemistry(squad, formation) {
  const rows = FORMATIONS[formation] || [];
  const allKeys = rows.flatMap((row, ri) => row.map((_, si) => `${ri}_${si}`));
  const filled = allKeys.filter(k => squad[k]);
  if (!filled.length) return 0;
  let total = 0, n = 0;
  for (const key of allKeys) {
    const p = squad[key]; if (!p) continue;
    const [r1, c1] = key.split("_").map(Number);
    const neighbors = allKeys.filter(k2 => {
      if (k2 === key || !squad[k2]) return false;
      const [r2, c2] = k2.split("_").map(Number);
      const dr = Math.abs(r1 - r2), dc = Math.abs(c1 - c2);
      return (dr === 0 && dc === 1) || (dr === 1 && dc <= 1);
    }).map(k2 => squad[k2]);
    if (!neighbors.length) { total += 10; n++; continue; }
    let score = 0;
    for (const nb of neighbors) {
      if (nb.team_id === p.team_id || nb.team === p.team) score += 3;
      else if (nb.nationality && p.nationality && nb.nationality === p.nationality && p.nationality !== "Unknown") score += 2;
      else if (areCompatible(p, nb)) score += 2;
      else score += 1;
    }
    total += Math.min(10, Math.round((score / (neighbors.length * 3)) * 10));
    n++;
  }
  return n ? Math.round((total / n) * 10) : 0;
}

// ÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â
// COMPONENTS
// ÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ TOP BAR ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
// BUG 3 FIX: No conflicting border:"none" + borderBottom. Use specific border sides.
function TopBar({ activeTab, onTab, chemistry, backendOnline }) {
  const tabs = ["My Squad", "Stats", "News", "Leagues", "Eval"];
  const chemColor = chemistry >= 70 ? "var(--green)" : chemistry >= 40 ? "var(--amber)" : "var(--red)";
  return (
    <header style={{ gridColumn: "1/-1", gridRow: 1, display: "flex", alignItems: "center", padding: "0 20px", background: "rgba(0,0,0,0.55)", borderBottom: "1px solid var(--border)", zIndex: 20 }}>
      <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: 2, color: "var(--gold)", textTransform: "uppercase", marginRight: 32 }}>
        Fantasy<span style={{ color: "var(--text2)", fontWeight: 300 }}>Coach</span>
        <span style={{ fontSize: 9, color: "var(--blue)", marginLeft: 6, fontWeight: 400, letterSpacing: 1, verticalAlign: "super" }}>AI</span>
      </div>
      <nav style={{ display: "flex", gap: 0, height: 48 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => onTab(tab)} style={{
            height: 48, padding: "0 20px", display: "flex", alignItems: "center",
            fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 400, letterSpacing: 1.5,
            color: activeTab === tab ? "#fff" : "var(--text2)", cursor: "pointer",
            textTransform: "uppercase", transition: "all .18s", background: "none",
            borderTop: "none", borderLeft: "none", borderRight: "none",
            borderBottom: activeTab === tab ? "2px solid var(--gold)" : "2px solid transparent",
          }}>{tab}</button>
        ))}
      </nav>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {chemistry > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase" }}>Chemistry</span>
            <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, color: chemColor }}>{chemistry}</span>
            <div style={{ display: "flex", gap: 2 }}>
              {Array(10).fill(0).map((_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < Math.round(chemistry / 10) ? chemColor : "rgba(255,255,255,0.1)", boxShadow: i < Math.round(chemistry / 10) ? `0 0 4px ${chemColor}66` : "none" }} />
              ))}
            </div>
          </div>
        )}
        <div style={{ position: "relative", width: 30, height: 30, borderRadius: "50%", background: "var(--gold-dim)", border: "1px solid rgba(200,168,75,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 700, color: "var(--gold)" }}>
          RS
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: backendOnline ? "var(--green)" : "var(--red)", border: "1.5px solid var(--bg)" }} />
        </div>
      </div>
    </header>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ PITCH CONTROLS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
// BUG 2 FIX: Encoding fixed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â proper Ã‚Â£ and Ã‚Â· characters
function PitchControls({ formation, onFormation, onAutoPick, onClear, spent, remaining, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "rgba(0,0,0,0.25)", borderBottom: "1px solid var(--border)", flexShrink: 0, flexWrap: "wrap" }}>
      <div style={{ position: "relative", display: "inline-block" }}><select value={formation} onChange={e => onFormation(e.target.value)} style={{ appearance: "none", WebkitAppearance: "none", background: "rgba(200,168,75,0.15)", border: "1px solid rgba(200,168,75,0.4)", borderRadius: 5, color: "#c8a84b", fontFamily: "Oswald,sans-serif", fontSize: 12, letterSpacing: 1, padding: "5px 24px 5px 10px", outline: "none", cursor: "pointer", colorScheme: "dark" }}>
        {Object.keys(FORMATIONS).map(f => <option key={f} value={f} style={{ background: "#0f1118", color: "#c8a84b" }}>{FORMAT_LABELS[f]}</option>)}
      </select></div>
      <BtnSmall onClick={onAutoPick}>Auto Pick</BtnSmall>
      <BtnSmall onClick={onClear} hoverColor="var(--red)">Clear</BtnSmall>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "var(--text3)", textTransform: "uppercase" }}>
          {count}/11 {"\u00b7"} {"\u00a3"}{spent.toFixed(1)}m spent {"\u00b7"} <span style={{ color: remaining < 0 ? "var(--red)" : "var(--green)" }}>{"\u00a3"}{remaining.toFixed(1)}m left</span>
        </span>
      </div>
    </div>
  );
}
function BtnSmall({ children, onClick, hoverColor }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "transparent", border: `1px solid ${hov && hoverColor ? hoverColor + "66" : "var(--border2)"}`, borderRadius: 5,
      padding: "5px 12px", fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1,
      color: hov ? (hoverColor || "var(--text)") : "var(--text2)", cursor: "pointer", textTransform: "uppercase", transition: "all .15s",
    }}>{children}</button>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ PLAYER CARD ON PITCH ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
// BUG 4 FIX: Added onDoubleClick for quick remove
function PitchCard({ player, slotPos, chemScore, onRemove, onClick, onDoubleClick, cardHeight }) {
  const [hov, setHov] = useState(false);
  const tier = getTier(player.total_points);
  const tc = tierColors[tier];
  const surname = player.display_name || player.name?.split(" ").pop() || "";
  const photo = playerPhoto(player);
  const chemColor = chemScore >= 7 ? "var(--green)" : chemScore >= 4 ? "var(--amber)" : "var(--red)";
  const h = cardHeight || 118;
  const photoH = Math.max(h - 60, 42);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      draggable
      onDragStart={e => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("player", JSON.stringify(player));
        const ghost = document.createElement("div");
        ghost.style.cssText = "position:fixed;top:-200px;left:-200px;width:88px;padding:8px;border-radius:7px;background:#1a1a2e;border:1px solid #c8a84b;color:#e8cc70;font-family:Oswald,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;text-align:center;";
        ghost.textContent = surname;
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 44, 20);
        setTimeout(() => ghost.remove(), 0);
      }}
      style={{ position: "relative", cursor: "grab", zIndex: hov ? 20 : 1 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onClick(player)}
      onDoubleClick={e => { e.stopPropagation(); if (onDoubleClick) onDoubleClick(); }}
    >
      <motion.div animate={{ y: hov ? -5 : 0 }} transition={{ duration: 0.15 }} style={{
        width: 88, height: h, borderRadius: 7, position: "relative", overflow: "hidden",
        background: tc.bg, border: `1px solid ${tc.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
      }}>
        {/* Position badge + identity */}
        <div style={{ padding: "5px 6px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 3 }}>
          <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: 1, padding: "1px 4px", borderRadius: 3, textTransform: "uppercase", background: "rgba(200,168,75,0.15)", color: "var(--gold)", border: "1px solid rgba(200,168,75,0.3)" }}>{slotPos}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <NatFlag player={player} width={16} height={11} />
            <ClubBadge player={player} size={16} />
          </div>
        </div>
        {/* Photo */}
        <div style={{ position: "absolute", top: 10, left: 0, right: 0, height: photoH, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", zIndex: 2 }}>
          {photo && <ImgSafe src={photo} style={{ width: 54, height: photoH - 4, objectFit: "cover", objectPosition: "top center", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.65))" }} />}
        </div>
        {/* Name */}
        <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, zIndex: 3, textAlign: "center", padding: "2px 4px", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 2px", color: tc.accent, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{surname}</div>
        </div>
        {/* Stats strip */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 30, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(0,0,0,0.25)", zIndex: 3 }}>
          {getCardStats(player).map((st, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2px 0" }}>
              <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 600, lineHeight: 1, color: tc.accent }}>{st.v}</div>
              <div style={{ fontSize: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginTop: 1, color: tc.dimAccent }}>{st.l}</div>
            </div>
          ))}
        </div>
        {/* Chem score badge */}
        <div style={{ position: "absolute", top: 2, left: "50%", transform: "translateX(-50%)", fontFamily: "Oswald,sans-serif", fontSize: 8, fontWeight: 700, color: chemColor, zIndex: 4 }}>{chemScore}</div>
        {/* Bottom accent line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${tc.accent},transparent)` }} />
      </motion.div>
      {/* Form dots */}
      <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 4 }}>
        {Array(5).fill(0).map((_, i) => {
          const filled = Math.round(parseFloat(player.form || 0) / 2);
          const c = filled >= 4 ? "var(--green)" : filled >= 2 ? "#f0c040" : "#f06060";
          return <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i < filled ? c : "rgba(255,255,255,0.12)" }} />;
        })}
      </div>
      {/* Remove button */}
      <AnimatePresence>
        {hov && (
          <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            onClick={e => { e.stopPropagation(); onRemove(player.id || player.sm_id); }}
            style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "rgba(226,90,90,0.9)", border: "none", color: "#fff", fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>{"\u2715"}</motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function getCardStats(p) {
  if (p.position === "GK") return [{ v: p.clean_sheets || 0, l: "CS" }, { v: p.total_points, l: "PTS" }, { v: parseFloat(p.form || 0).toFixed(1), l: "FRM" }];
  if (p.position === "DEF") return [{ v: p.clean_sheets || 0, l: "CS" }, { v: p.goals || 0, l: "GLS" }, { v: p.total_points, l: "PTS" }];
  return [{ v: p.goals || 0, l: "GLS" }, { v: p.assists || 0, l: "AST" }, { v: parseFloat(p.xg || 0).toFixed(1), l: "xG" }];
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ EMPTY PITCH SLOT ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
// BUG 4 FIX: Gold border glow on drag over
function EmptySlot({ slotPos, onDrop, cardHeight }) {
  const [dragOver, setDragOver] = useState(false);
  const h = cardHeight || 118;
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); onDrop(e); }}
      style={{
        width: 88, height: h, borderRadius: 7,
        background: dragOver ? "rgba(200,168,75,0.08)" : "rgba(255,255,255,0.03)",
        border: `1.5px dashed ${dragOver ? "rgba(200,168,75,0.6)" : "rgba(255,255,255,0.1)"}`,
        boxShadow: dragOver ? "0 0 18px rgba(200,168,75,0.4), inset 0 0 12px rgba(200,168,75,0.08)" : "none",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s",
      }}
    >
      <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: dragOver ? "var(--gold)" : "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>{slotPos}</span>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ FOOTBALL PITCH ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
// Full pitch with SVG chemistry lines, pitch markings, center circle, formation ghost text
function FootballPitch({ formation, squad, onRemove, onPlayerClick, onDropToSlot }) {
  const rows = FORMATIONS[formation] || [];
  const rowCount = rows.length;
  const cardHeight = rowCount >= 5 ? 98 : 118;

  const keyedRows = useMemo(() =>
    rows.map((row, ri) => row.map((slot, si) => ({ ...slot, _key: `${ri}_${si}`, _ri: ri, _si: si }))),
    [formation]
  );
  const reversed = useMemo(() => [...keyedRows].reverse(), [keyedRows]);

  function getChemScore(key) {
    const p = squad[key]; if (!p) return 0;
    const [r1, c1] = key.split("_").map(Number);
    const all = keyedRows.flat();
    const neighbors = all.filter(s => {
      if (s._key === key || !squad[s._key]) return false;
      const dr = Math.abs(s._ri - r1), dc = Math.abs(s._si - c1);
      return (dr === 0 && dc === 1) || (dr === 1 && dc <= 1);
    }).map(s => squad[s._key]);
    if (!neighbors.length) return 10;
    let score = 0;
    for (const nb of neighbors) {
      if ((nb.team_id === p.team_id) || (nb.team === p.team)) score += 3;
      else if (nb.nationality && p.nationality && nb.nationality === p.nationality && p.nationality !== "Unknown") score += 2;
      else if (areCompatible(p, nb)) score += 2;
      else score += 1;
    }
    return Math.min(10, Math.round((score / (neighbors.length * 3)) * 10));
  }

  // Chemistry lines SVG
  const pitchRef = useRef(null);
  const [lines, setLines] = useState([]);
  useEffect(() => {
    if (!pitchRef.current) return;
    const timer = setTimeout(() => {
      const pr = pitchRef.current.getBoundingClientRect();
      const els = pitchRef.current.querySelectorAll("[data-slotkey]");
      const posMap = {};
      els.forEach(el => {
        const key = el.getAttribute("data-slotkey");
        const r = el.getBoundingClientRect();
        posMap[key] = { x: r.left - pr.left + r.width / 2, y: r.top - pr.top + r.height / 2 };
      });
      const newLines = [], seen = new Set();
      const all = keyedRows.flat();
      for (const slotA of all) {
        for (const slotB of all) {
          if (slotA._key >= slotB._key) continue;
          const pk = `${slotA._key}-${slotB._key}`;
          if (seen.has(pk)) continue;
          const a = posMap[slotA._key], b = posMap[slotB._key];
          if (!a || !b) continue;
          if (Math.abs(a.x - b.x) > 200 || Math.abs(a.y - b.y) > 160) continue;
          seen.add(pk);
          const pA = squad[slotA._key], pB = squad[slotB._key];
          const both = pA && pB;
          const sameClub = both && ((pA.team_id === pB.team_id) || (pA.team === pB.team));
          const sameNat = both && !sameClub && pA.nationality && pB.nationality && pA.nationality === pB.nationality && pA.nationality !== "Unknown";
          const compat = both && !sameClub && !sameNat && areCompatible(pA, pB);
          const color = both ? (sameClub ? "rgba(90,219,138,0.8)" : sameNat ? "rgba(100,149,237,0.6)" : compat ? "rgba(180,130,255,0.55)" : "rgba(240,160,40,0.35)") : "rgba(255,255,255,0.04)";
          newLines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, color, dashed: !both, width: sameClub ? 2 : sameNat || compat ? 1.5 : 1 });
        }
      }
      setLines(newLines);
    }, 120);
    return () => clearTimeout(timer);
  }, [squad, formation]);

  return (
    <div ref={pitchRef} style={{
      flex: 1, position: "relative", overflow: "visible",
      background: `repeating-linear-gradient(180deg,rgba(0,0,0,0.06) 0px,rgba(0,0,0,0.06) 1px,transparent 1px,transparent 48px),
        linear-gradient(180deg,#1a3a1a 0%,#1e421e 9%,#1a3a1a 18%,#1e421e 27%,#1a3a1a 36%,#1e421e 45%,#1a3a1a 54%,#1e421e 63%,#1a3a1a 72%,#1e421e 81%,#1a3a1a 90%,#1e421e 100%)`,
      borderRadius: 4,
    }}>
      {/* Pitch markings */}
      <div style={{ position: "absolute", inset: 12, border: "1.5px solid rgba(255,255,255,0.13)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", left: "50%", top: 12, bottom: 12, width: 1.5, background: "rgba(255,255,255,0.1)", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 80, height: 80, border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 0 }} />
      {/* Formation ghost text */}
      <div style={{ position: "absolute", left: "50%", bottom: "15%", transform: "translateX(-50%)", fontFamily: "Oswald,sans-serif", fontSize: 40, fontWeight: 300, color: "rgba(255,255,255,0.04)", letterSpacing: 6, pointerEvents: "none", zIndex: 0, whiteSpace: "nowrap" }}>
        {FORMAT_LABELS[formation]}
      </div>
      {/* Chemistry SVG */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, overflow: "visible" }}>
        {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={l.width} strokeDasharray={l.dashed ? "4 4" : "0"} />)}
      </svg>
      {/* Formation rows */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "space-evenly", padding: rowCount >= 5 ? "4px 20px" : "8px 20px" }}>
        {reversed.map((row, revRi) => (
          <div key={revRi} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
            {row.map(slot => {
              const player = squad[slot._key];
              const chem = player ? getChemScore(slot._key) : 0;
              return (
                <div key={slot._key} data-slotkey={slot._key}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); try { const p = JSON.parse(e.dataTransfer.getData("player")); onDropToSlot(slot._key, p); } catch {} }}
                >
                  {player ? (
                    <PitchCard
                      player={player} slotPos={slot.pos} chemScore={chem}
                      onRemove={onRemove} onClick={onPlayerClick} cardHeight={cardHeight}
                      onDoubleClick={() => onRemove(player.id || player.sm_id)}
                    />
                  ) : (
                    <EmptySlot slotPos={slot.pos} cardHeight={cardHeight}
                      onDrop={e => {
                        try {
                          const p = JSON.parse(e.dataTransfer.getData("player"));
                          onDropToSlot(slot._key, p);
                        } catch {}
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ LEFT PANEL (Player List) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function LeftPanel({ players, squad, remaining, onAdd, onRemove, onPlayerClick }) {
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState("ALL");
  const [sortBy, setSortBy] = useState("total_points");
  const squadIds = useMemo(() => new Set(Object.values(squad).filter(Boolean).map(p => String(p.id || p.sm_id))), [squad]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return players
      .filter(p => {
        const name = (p.name || p.full_name || p.display_name || "").toLowerCase();
        const team = (p.team || p.team_name || "").toLowerCase();
        return (!q || name.includes(q) || team.includes(q)) && (pos === "ALL" || p.position === pos);
      })
      .sort((a, b) => (parseFloat(b[sortBy]) || 0) - (parseFloat(a[sortBy]) || 0));
  }, [players, search, pos, sortBy]);

  const posFilters = ["ALL", "GK", "DEF", "MID", "FWD"];
  const sortOpts = [{ v: "total_points", l: "PTS" }, { v: "form", l: "Form" }, { v: "xg", l: "xG" }, { v: "cost", l: "Cost" }];

  return (
    <aside style={{ gridColumn: 1, gridRow: 2, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "var(--text2)", textTransform: "uppercase" }}>Players</div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{filtered.length} available {"\u00b7"} {squadIds.size}/11 selected</div>
      </div>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players or clubs..." style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border2)", borderRadius: 6, padding: "7px 10px", fontFamily: "Barlow,sans-serif", fontSize: 12, color: "var(--text)", outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: 5, padding: "7px 12px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
        {posFilters.map(p => <Chip key={p} label={p} active={pos === p} onClick={() => setPos(p)} />)}
      </div>
      <div style={{ display: "flex", gap: 5, padding: "6px 12px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
        {sortOpts.map(o => <Chip key={o.v} label={o.l} active={sortBy === o.v} onClick={() => setSortBy(o.v)} />)}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px" }}>
        {filtered.slice(0, 100).map((p, i) => (
          <motion.div key={p.id || p.sm_id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}>
            <PlayerRow player={p} inSquad={squadIds.has(String(p.id || p.sm_id))} onClick={onPlayerClick}
              draggable onDragStart={e => e.dataTransfer.setData("player", JSON.stringify(p))} />
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, padding: "3px 8px", borderRadius: 3, cursor: "pointer", textTransform: "uppercase", transition: "all .15s",
      background: active ? "var(--gold-dim)" : "transparent",
      border: `1px solid ${active ? "rgba(200,168,75,0.4)" : "var(--border2)"}`,
      color: active ? "var(--gold)" : "var(--text2)",
    }}>{label}</button>
  );
}
// BUG 5 FIX: Added NatFlag to PlayerRow
function PlayerRow({ player, inSquad, onClick, draggable, onDragStart }) {
  const surname = player.display_name || player.name?.split(" ").pop() || player.web_name || "";
  const photo = playerPhoto(player);
  const badge = playerBadge(player);
  return (
    <div draggable={draggable} onDragStart={onDragStart} onClick={() => onClick(player)}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 6,
        cursor: "grab", marginBottom: 2, border: `1px solid ${inSquad ? "rgba(90,219,138,0.25)" : "transparent"}`,
        background: inSquad ? "rgba(90,219,138,0.06)" : "transparent", transition: "background .15s",
      }}
    >
      <div style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border2)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {photo ? <ImgSafe src={photo} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, color: "var(--text2)" }}>{surname.slice(0, 2).toUpperCase()}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>{surname}</div>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 9, fontWeight: 700, background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(200,168,75,0.25)", borderRadius: 2, padding: "1px 4px", letterSpacing: 0.5 }}>{player.position}</span>
          <span>{player.team || player.team_name}</span>
          <span>{"\u00a3"}{((player.cost > 50 ? player.cost / 10 : player.cost) || 0).toFixed(1)}m</span>
        </div>
      </div>
      <NatFlag player={player} width={16} height={11} />
      {badge && <ImgSafe src={badge} style={{ width: 16, height: 16, objectFit: "contain", flexShrink: 0 }} />}
      <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, fontWeight: 600, color: "var(--green)", minWidth: 28, textAlign: "right", flexShrink: 0 }}>{player.total_points || 0}</div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ PLAYER MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function PlayerModal({ player, inSquad, onClose, onAdd, onRemove, onAskAI }) {
  if (!player) return null;
  const tier = getTier(player.total_points || 0);
  const tc = tierColors[tier];
  const styles = getPlaystyles(player);
  const form = parseFloat(player.form || 0);
  const formStars = Math.min(5, Math.round(form / 2));

  const stats = player.position === "GK" ? [
    { v: player.total_points, l: "FPL Pts", hi: player.total_points > 100 }, { v: player.clean_sheets || 0, l: "CS", hi: (player.clean_sheets || 0) > 8 }, { v: form.toFixed(1), l: "Form", hi: form > 6 },
    { v: `\u00a3${(player.cost > 50 ? player.cost / 10 : player.cost || 0).toFixed(1)}m`, l: "Price" }, { v: player.minutes || 0, l: "Minutes" }, { v: player.bonus || 0, l: "Bonus" },
  ] : player.position === "DEF" ? [
    { v: player.total_points, l: "FPL Pts", hi: player.total_points > 100 }, { v: player.clean_sheets || 0, l: "CS" }, { v: player.goals || 0, l: "Goals" },
    { v: player.assists || 0, l: "Assists" }, { v: parseFloat(player.xg || 0).toFixed(1), l: "xG" }, { v: `\u00a3${(player.cost > 50 ? player.cost / 10 : player.cost || 0).toFixed(1)}m`, l: "Price" },
  ] : [
    { v: player.total_points, l: "FPL Pts", hi: (player.total_points || 0) > 120 }, { v: player.goals || 0, l: "Goals", hi: (player.goals || 0) > 8 }, { v: player.assists || 0, l: "Assists" },
    { v: parseFloat(player.xg || 0).toFixed(1), l: "xG" }, { v: parseFloat(player.xa || 0).toFixed(1), l: "xA" }, { v: `\u00a3${(player.cost > 50 ? player.cost / 10 : player.cost || 0).toFixed(1)}m`, l: "Price" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 12, width: 480, maxWidth: "95vw", overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.8)" }}>
        {/* Header */}
        <div style={{ background: tc.bg, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: `2px solid ${tc.accent}`, flexShrink: 0 }}>
            <ImgSafe src={playerPhoto(player)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 22, fontWeight: 700, color: tc.accent, letterSpacing: 0.5 }}>{player.name || player.full_name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 700, background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(200,168,75,0.25)", borderRadius: 2, padding: "2px 6px" }}>{player.position}</span>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{player.team || player.team_name}</span>
              <NatFlag player={player} width={20} height={13} />
              <ClubBadge player={player} size={20} />
            </div>
            <div style={{ display: "flex", gap: 2, marginTop: 6 }}>
              {Array(5).fill(0).map((_, i) => <span key={i} style={{ fontSize: 12, color: i < formStars ? "#f0c040" : "rgba(255,255,255,0.15)" }}>{"\u2605"}</span>)}
              <span style={{ fontSize: 10, color: "var(--text3)", marginLeft: 4 }}>Form</span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 32, fontWeight: 700, color: "var(--green)", lineHeight: 1 }}>{player.total_points || 0}</div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>FPL pts</div>
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 18 }}>{"\u2715"}</button>
        </div>
        {/* Tags */}
        {styles.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "10px 16px 6px" }}>
            {styles.map((ps, i) => <span key={i} style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, padding: "3px 8px", borderRadius: 10, textTransform: "uppercase", background: "rgba(90,219,138,0.1)", color: "var(--green)", border: "1px solid rgba(90,219,138,0.2)" }}>{ps}</span>)}
          </div>
        )}
        {/* Stats grid */}
        <div style={{ padding: "12px 16px 8px" }}>
          <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: 2, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Season Stats</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {stats.map((c, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 6px", textAlign: "center" }}>
                <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 18, fontWeight: 700, lineHeight: 1, color: c.hi ? "var(--green)" : "var(--gold)" }}>{c.v}</div>
                <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: 0.5, color: "var(--text3)", textTransform: "uppercase", marginTop: 3 }}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Actions */}
        <div style={{ display: "flex", gap: 8, padding: "8px 16px 16px" }}>
          <button onClick={() => { inSquad ? onRemove(player.id || player.sm_id) : onAdd(player); onClose(); }} style={{ flex: 1, padding: 10, borderRadius: 7, fontFamily: "Barlow Condensed,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer", textTransform: "uppercase", border: inSquad ? "1px solid rgba(226,90,90,0.4)" : "1px solid rgba(200,168,75,0.4)", background: inSquad ? "rgba(226,90,90,0.15)" : "var(--gold-dim)", color: inSquad ? "#e07070" : "var(--gold)" }}>
            {inSquad ? "\u2013 Remove" : "+ Add to Squad"}
          </button>
          <button onClick={() => { onAskAI(`Tell me about ${player.name || player.full_name}. Should I pick them for FPL? Include form, stats, and alternatives.`); onClose(); }} style={{ padding: "10px 16px", borderRadius: 7, fontFamily: "Barlow Condensed,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer", textTransform: "uppercase", background: "rgba(59,138,226,0.1)", border: "1px solid rgba(59,138,226,0.3)", color: "#7ab0f5" }}>
            Ask AI {"\u2192"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ AI ASSISTANT ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const QUICK_ASKS = [
  "Who should I captain this gameweek?",
  "Which players are injured or doubtful?",
  "Best value midfielder under \u00a37m?",
  "Analyse my squad and give me a rating",
];

function AIFloat({ squad, sendRef }) {
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Hey! I'm your FantasyCoach AI. Ask me anything about your squad.", time: "Now" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mini, setMini] = useState(false);
  const [floatPos, setFloatPos] = useState({ right: 20, bottom: 20 });
  const dragging = useRef(false);
  const dragStart = useRef({});
  const msgsEnd = useRef(null);
  function onDragMouseDown(e) {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, right: floatPos.right, bottom: floatPos.bottom };
    const onMove = ev => { if (!dragging.current) return; const dx = ev.clientX - dragStart.current.x; const dy = ev.clientY - dragStart.current.y; setFloatPos({ right: Math.max(0, dragStart.current.right - dx), bottom: Math.max(0, dragStart.current.bottom + dy) }); };
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    e.preventDefault();
  }
  const filledCount = Object.values(squad).filter(Boolean).length;

  useEffect(() => { msgsEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = useCallback(async (text) => {
    if (!text?.trim() || loading) return;
    setInput("");
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setMsgs(prev => [...prev, { role: "user", text: text.trim(), time }]);
    setLoading(true);
    const teamContext = Object.values(squad).filter(Boolean).map(p => p.name || p.full_name || p.display_name || "");
    try {
      let full = "";
      let sources = [];
      setMsgs(prev => [...prev, { role: "ai", text: "...", time, streaming: true }]);
      for await (const chunk of streamChat(text.trim(), teamContext)) {
        if (chunk.type === "text") { full += chunk.content; setMsgs(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, text: full.replace(/\*\*/g, "").replace(/#{1,6}\s/g, "").replace(/`/g, "").trim() } : m)); }
        if (chunk.type === "sources") sources = chunk.content || [];
        if (chunk.type === "verification") setMsgs(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, verification: chunk.content } : m));
        if (chunk.type === "done") setMsgs(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, streaming: false, sources } : m));
      }
    } catch {
      setMsgs(prev => [...prev, { role: "ai", text: "Connection error \u2014 make sure the backend is running.", time }]);
    }
    setLoading(false);
  }, [loading, squad]);

  useEffect(() => { if (sendRef) sendRef.current = send; }, [send, sendRef]);

  return (
    <motion.div drag dragMomentum={false} dragElastic={0} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
      style={{ position: "fixed", right: 20, bottom: 20, width: 320, zIndex: 300, background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", maxHeight: mini ? 44 : 520, overflow: "hidden", transition: "max-height .2s" }}>
      {/* Header */}
      <div style={{ padding: "10px 14px", borderBottom: mini ? "none" : "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "grab", flexShrink: 0 }} onClick={() => setMini(m => !m)}>
        <span onClick={() => setMini(m => !m)} style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "var(--text2)", textTransform: "uppercase", cursor: "pointer" }}>AI Assistant</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ background: "rgba(59,138,226,0.1)", border: "1px solid rgba(59,138,226,0.3)", borderRadius: 3, padding: "2px 7px", fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, color: "#7ab0f5", textTransform: "uppercase" }}>Claude</span>
          <button onClick={e => { e.stopPropagation(); setMini(m => !m); }} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16, padding: "0 2px", lineHeight: 1 }}>{mini ? "+" : "\u2013"}</button>
        </div>
      </div>
      {!mini && <>
        {/* Squad dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <span style={{ fontSize: 9, letterSpacing: 1, color: "var(--text3)", fontFamily: "Barlow Condensed,sans-serif", textTransform: "uppercase" }}>Squad</span>
          <div style={{ display: "flex", gap: 2 }}>{Array(11).fill(0).map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < filledCount ? "var(--green)" : "rgba(255,255,255,0.1)" }} />)}</div>
          <span style={{ fontSize: 9, color: "var(--text3)" }}>{filledCount}/11</span>
        </div>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: m.role === "ai" ? "flex-start" : "flex-end" }}>
              <div style={{ padding: "9px 12px", borderRadius: m.role === "ai" ? "8px 8px 8px 3px" : "8px 8px 3px 8px", fontSize: 12, lineHeight: 1.6, maxWidth: "90%", background: m.role === "ai" ? "var(--bg3)" : "var(--gold-dim)", border: `1px solid ${m.role === "ai" ? "var(--border)" : "rgba(200,168,75,0.25)"}`, color: "var(--text)", whiteSpace: "pre-wrap" }}>{m.text}</div>
              {m.sources?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3, paddingLeft: 2 }}>
                  {m.sources.slice(0, 4).map((s, j) => <span key={j} style={{ background: "rgba(59,138,226,0.1)", border: "1px solid rgba(59,138,226,0.2)", borderRadius: 3, padding: "1px 5px", fontSize: 8, color: "#7ab0f5", fontFamily: "Oswald,sans-serif", letterSpacing: 0.5, textTransform: "uppercase" }}>{s.player_name || s.type || "data"}</span>)}
                </div>
              )}
              {m.verification && m.verification.total_claims > 0 && (
                <div style={{ background: "rgba(90,219,138,0.1)", borderRadius: 3, padding: "2px 6px", display: "inline-block" }}>
                  <span style={{ fontSize: 9, color: "var(--green)", fontFamily: "Barlow Condensed,sans-serif", fontWeight: 600 }}>
                    Grounded: {Math.round(m.verification.faithfulness_score * 100)}% ({m.verification.verified}/{m.verification.total_claims} claims)
                  </span>
                </div>
              )}
              <div style={{ fontSize: 9, color: "var(--text3)" }}>{m.time}</div>
            </div>
          ))}
          {loading && <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 12px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "8px 8px 8px 3px", width: "fit-content" }}>{[0, 1, 2].map(i => <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text2)" }} />)}</div>}
          <div ref={msgsEnd} />
        </div>
        {/* Quick asks */}
        <div style={{ padding: "6px 10px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Barlow Condensed,sans-serif", fontWeight: 600, marginBottom: 2 }}>Quick asks</div>
          {QUICK_ASKS.slice(0, 3).map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 5, padding: "5px 8px", fontSize: 11, color: "var(--text2)", cursor: "pointer", textAlign: "left", fontFamily: "Barlow,sans-serif", transition: "all .15s" }}
              onMouseEnter={e => { e.target.style.background = "var(--gold-dim)"; e.target.style.color = "var(--gold)"; }}
              onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.color = "var(--text2)"; }}
            >{q} {"\u2192"}</button>
          ))}
        </div>
        {/* Input */}
        <div style={{ display: "flex", gap: 6, padding: "8px 10px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask about your squad..." style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border2)", borderRadius: 6, padding: "7px 10px", fontFamily: "Barlow,sans-serif", fontSize: 12, color: "var(--text)", outline: "none" }} />
          <button onClick={() => send(input)} style={{ background: "var(--gold-dim)", border: "1px solid rgba(200,168,75,0.4)", borderRadius: 6, padding: "0 12px", fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--gold)", cursor: "pointer", height: 36, textTransform: "uppercase" }}>Send</button>
        </div>
      </>}
    </motion.div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ NEWS TAB ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function NewsTab() {
  const [articles, setArticles] = useState([]);
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("news");

  useEffect(() => {
    Promise.all([fetchNews(), fetchInjuries()]).then(([a, inj]) => { setArticles(a); setInjuries(inj); }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: 20 }}>
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
        {[{ k: "news", l: "Recent News" }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ padding: "8px 16px", fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: `2px solid ${tab === t.k ? "var(--gold)" : "transparent"}`, color: tab === t.k ? "#fff" : "var(--text2)", transition: "all .15s" }}>{t.l}</button>
        ))}
      </div>
      {loading ? <div style={{ color: "var(--text3)", fontSize: 12 }}>Loading...</div> : (
        <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <AnimatePresence>
            {tab === "news" && articles.map((a, i) => (
              <motion.a key={i} href={a.url} target="_blank" rel="noopener" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ display: "flex", gap: 12, padding: "10px 12px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, textDecoration: "none", transition: "border-color .15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(200,168,75,0.3)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                {a.thumbnail && <ImgSafe src={a.thumbnail} style={{ width: 60, height: 45, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{a.published?.slice(0, 10)}</div>
                </div>
              </motion.a>
            ))}
            {tab === "injuries" && injuries.slice(0, 50).map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7 }}>
                <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 2, background: "rgba(226,90,90,0.1)", color: "var(--red)", border: "1px solid rgba(226,90,90,0.2)", textTransform: "uppercase", flexShrink: 0 }}>{p.status || p.injury_status || "INJ"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{p.player_name || p.player?.common_name || p.name || "Unknown"}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{p.team?.name || p.team || ""} {"\u00b7"} {p.reason || p.injury_news || p.news || "Injury"}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ LEAGUES TAB ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function LeaguesTab() {
  const [data, setData] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState("standings");
  useEffect(() => {
    Promise.all([
      fetchStandings(),
      fetch(`${BASE}/api/fixtures`).then(r => r.json()).then(d => d.fixtures || []).catch(() => []),
    ]).then(([d, fx]) => { setData(d); setFixtures(fx); }).finally(() => setLoading(false));
  }, []);

  // Group fixtures by date (must be before any early return to satisfy Rules of Hooks)
  const gwGroups = useMemo(() => {
    const groups = {};
    for (const fx of fixtures) {
      const dateKey = fx.kickoff ? fx.kickoff.split(" ")[0] : fx.gw || "Unknown";
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(fx);
    }
    return groups;
  }, [fixtures]);

  if (loading) return <div style={{ padding: 20, color: "var(--text3)", fontSize: 12 }}>Loading...</div>;
  const rows = data?.pl_standings || data?.standings || [];
  const standings = rows;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", flexShrink: 0, padding: "0 20px" }}>
        {[{k:"standings",l:"Standings"},{k:"fixtures",l:"Fixtures"}].map(t => (
          <button key={t.k} onClick={() => setSub(t.k)} style={{
            padding: "10px 18px", fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.2,
            textTransform: "uppercase", cursor: "pointer", background: "none",
            borderTop: "none", borderLeft: "none", borderRight: "none",
            borderBottom: sub === t.k ? "2px solid var(--gold)" : "2px solid transparent",
            color: sub === t.k ? "var(--gold)" : "var(--text2)",
          }}>{t.l}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        {sub === "standings" && (
          <>
            <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "var(--gold)", textTransform: "uppercase", marginBottom: 10, borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>Premier League 2025/26</div>
            {!rows.length ? <div style={{ color: "var(--text3)", fontSize: 12 }}>No standings data.</div> : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ color: "var(--text3)", fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    <th style={{ textAlign: "left", padding: "4px 8px", width: 30 }}>#</th>
                    <th style={{ textAlign: "left", padding: "4px 8px" }}>Team</th>
                    <th style={{ textAlign: "center", padding: "4px 8px", width: 30 }}>P</th>
                    <th style={{ textAlign: "center", padding: "4px 8px", width: 30 }}>W</th>
                    <th style={{ textAlign: "center", padding: "4px 8px", width: 30 }}>D</th>
                    <th style={{ textAlign: "center", padding: "4px 8px", width: 30 }}>L</th>
                    <th style={{ textAlign: "center", padding: "4px 8px", width: 40 }}>GD</th>
                    <th style={{ textAlign: "center", padding: "4px 8px", width: 40, color: "var(--gold)" }}>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      style={{ borderTop: "1px solid var(--border)", background: i < 4 ? "rgba(59,138,226,0.04)" : i >= 17 ? "rgba(226,90,90,0.04)" : "transparent" }}>
                      <td style={{ padding: "6px 8px", color: "var(--text3)", fontFamily: "Oswald,sans-serif", fontSize: 11, textAlign: "center" }}>{r.position || i + 1}</td>
                      <td style={{ padding: "6px 8px", fontFamily: "Barlow Condensed,sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {r.badge_url && <img src={r.badge_url} style={{ width: 20, height: 20, objectFit: "contain" }} onError={e => e.target.style.display="none"} />}
                          {r.team_name || r.team || ""}
                        </div>
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "center", color: "var(--text2)", fontFamily: "Oswald,sans-serif" }}>{r.played || 0}</td>
                      <td style={{ padding: "6px 8px", textAlign: "center", color: "var(--green)", fontFamily: "Oswald,sans-serif" }}>{r.won || 0}</td>
                      <td style={{ padding: "6px 8px", textAlign: "center", color: "var(--text2)", fontFamily: "Oswald,sans-serif" }}>{r.drawn || 0}</td>
                      <td style={{ padding: "6px 8px", textAlign: "center", color: "var(--red)", fontFamily: "Oswald,sans-serif" }}>{r.lost || 0}</td>
                      <td style={{ padding: "6px 8px", textAlign: "center", color: "var(--text2)", fontFamily: "Oswald,sans-serif" }}>{r.goal_difference > 0 ? "+" : ""}{r.goal_difference || 0}</td>
                      <td style={{ padding: "6px 8px", textAlign: "center", color: "var(--gold)", fontFamily: "Oswald,sans-serif", fontSize: 14, fontWeight: 700 }}>{r.points || 0}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {sub === "fixtures" && (
          <>
            {!fixtures.length ? <div style={{ color: "var(--text3)", fontSize: 12 }}>No fixtures data. FPL bootstrap may not include fixtures array.</div> : (
              Object.entries(gwGroups).map(([gw, fxList]) => (
                <div key={gw} style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8, borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>{gw}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
                    {fxList.map((fx, i) => {
                      const kickoffTime = fx.kickoff ? fx.kickoff.split(" ")[1]?.slice(0,5) : "";
                      const homeBadge = fx.home_badge || standings.find(s => s.team_name === fx.home)?.badge_url || "";
                      const awayBadge = fx.away_badge || standings.find(s => s.team_name === fx.away)?.badge_url || "";
                      return (
                        <motion.div key={fx.id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                          style={{ background: "var(--bg3)", border: `1px solid ${fx.finished ? "var(--border)" : "rgba(200,168,75,0.15)"}`, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center" }}>
                          {/* Home */}
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                            {homeBadge && <img src={homeBadge} style={{ width: 32, height: 32, objectFit: "contain" }} onError={e => e.target.style.display="none"} />}
                            <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 12, fontWeight: 600, color: "var(--text)", textAlign: "right", lineHeight: 1.2 }}>{fx.home}</div>
                          </div>
                          {/* Middle */}
                          <div style={{ padding: "0 10px", textAlign: "center", flexShrink: 0, minWidth: 56 }}>
                            <div style={{ fontFamily: "Oswald,sans-serif", fontSize: fx.finished ? 10 : 11, color: fx.finished ? "var(--green)" : "var(--gold)", letterSpacing: 1, fontWeight: 600 }}>{fx.finished ? "FT" : kickoffTime || "vs"}</div>
                            {fx.finished && fx.result && <div style={{ fontSize: 8, color: "var(--text3)", fontFamily: "Barlow Condensed,sans-serif", marginTop: 3, maxWidth: 56, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fx.result.split(" won")[0].split(" draw")[0]}</div>}
                          </div>
                          {/* Away */}
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 5 }}>
                            {awayBadge && <img src={awayBadge} style={{ width: 32, height: 32, objectFit: "contain" }} onError={e => e.target.style.display="none"} />}
                            <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 12, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>{fx.away}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â
// NEW FEATURES ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â STATS TAB
// ÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SCATTER CHART (Price vs Performance) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function ScatterChart({ players }) {
  const [posFilter, setPosFilter] = useState("ALL");
  const [minPts, setMinPts] = useState(0);
  const [hover, setHover] = useState(null);

  const POS_COL = { GK: "#c8a84b", DEF: "#5adb8a", MID: "#3b8ae2", FWD: "#e25a5a" };

  const filtered = useMemo(() => {
    return players.filter(p => {
      const pts = p.total_points || 0;
      const cost = normCost(p);
      return pts > minPts && cost >= 3.5 && cost <= 16 && pts <= 300;
    }).filter(p => posFilter === "ALL" || p.position === posFilter);
  }, [players, posFilter, minPts]);

  const costs = filtered.map(p => normCost(p));
  const pts = filtered.map(p => p.total_points || 0);
  const minCost = 3.5, maxCost = 16;
  const maxPts = Math.max(...pts, 50);

  const ppmList = useMemo(() =>
    [...players.filter(p => (p.cost||0)>0 && (p.total_points||0)>0 && (posFilter==="ALL"||p.position===posFilter))]
      .map(p => ({ ...p, ppm: (p.total_points||0) / Math.max(normCost(p), 0.1) }))
      .sort((a,b) => b.ppm - a.ppm).slice(0, 20),
    [players, posFilter]
  );

  const W = 620, H = 380, M = { t: 20, r: 20, b: 50, l: 55 };
  const cw = W - M.l - M.r, ch = H - M.t - M.b;

  function toX(cost) { return M.l + ((cost - minCost) / (maxCost - minCost)) * cw; }
  function toY(p)    { return M.t + ch - (p / maxPts) * ch; }

  // Avg value line: pts = avgPPM * cost
  const avgPPM = players.length ? players.reduce((s,p) => s + (p.total_points||0)/Math.max(normCost(p),0.1), 0) / players.filter(p=>normCost(p)>0).length : 13;
  const lineX1 = toX(minCost), lineY1 = toY(avgPPM * minCost);
  const lineX2 = toX(maxCost), lineY2 = toY(Math.min(avgPPM * maxCost, maxPts));

  const xTicks = [4, 6, 8, 10, 12, 14];
  const yTicks = [0, 50, 100, 150, 200, 250].filter(v => v <= maxPts + 10);

  return (
    <div style={{ padding: "16px 20px", display: "flex", gap: 20, flex: 1, overflow: "hidden", minHeight: 0, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          {["ALL","GK","DEF","MID","FWD"].map(p => <Chip key={p} label={p} active={posFilter===p} onClick={() => setPosFilter(p)} />)}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase" }}>Min Pts</span>
            <input type="range" min={0} max={150} step={10} value={minPts} onChange={e => setMinPts(+e.target.value)}
              style={{ width: 80, accentColor: "var(--gold)" }} />
            <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, color: "var(--gold)", minWidth: 20 }}>{minPts}</span>
          </div>
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
          {Object.entries({ GK: "#c8a84b", DEF: "#5adb8a", MID: "#3b8ae2", FWD: "#e25a5a" }).map(([pos, col]) => (
            <div key={pos} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", opacity: posFilter === "ALL" || posFilter === pos ? 1 : 0.35 }}
              onClick={() => setPosFilter(posFilter === pos ? "ALL" : pos)}>
              <svg width={10} height={10}><circle cx={5} cy={5} r={5} fill={col} /></svg>
              <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 1, textTransform: "uppercase" }}>{pos}</span>
            </div>
          ))}
          <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", marginLeft: "auto", alignSelf: "center" }}>
            click to filter
          </span>
        </div>
        {/* Chart */}
        <div style={{ flex: 1, position: "relative" }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 6, border: "1px solid var(--border)" }}>
            {/* Grid */}
            {yTicks.map(v => (
              <g key={v}>
                <line x1={M.l} y1={toY(v)} x2={M.l+cw} y2={toY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                <text x={M.l-8} y={toY(v)+4} fill="rgba(255,255,255,0.25)" fontSize={10} textAnchor="end" fontFamily="Oswald,sans-serif">{v}</text>
              </g>
            ))}
            {xTicks.map(v => (
              <g key={v}>
                <line x1={toX(v)} y1={M.t} x2={toX(v)} y2={M.t+ch} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                <text x={toX(v)} y={M.t+ch+18} fill="rgba(255,255,255,0.25)" fontSize={10} textAnchor="middle" fontFamily="Oswald,sans-serif">{"\u00a3"}{v}m</text>
              </g>
            ))}
            {/* Avg value dashed line */}
            <line x1={lineX1} y1={lineY1} x2={lineX2} y2={Math.max(lineY2, M.t)} stroke="rgba(255,255,255,0.18)" strokeWidth={1} strokeDasharray="5 4" />
            <text x={lineX2-2} y={Math.max(lineY2, M.t)-5} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="end" fontFamily="Barlow Condensed,sans-serif">avg value</text>
            {/* Axis labels */}
            <text x={M.l+cw/2} y={H-4} fill="rgba(255,255,255,0.3)" fontSize={10} textAnchor="middle" fontFamily="Barlow Condensed,sans-serif" letterSpacing={1.5}>PRICE ({"\u00a3"}m)</text>
            <text x={14} y={M.t+ch/2} fill="rgba(255,255,255,0.3)" fontSize={10} textAnchor="middle" fontFamily="Barlow Condensed,sans-serif" letterSpacing={1.5} transform={`rotate(-90,14,${M.t+ch/2})`}>FPL POINTS</text>
            {/* Dots */}
            {filtered.map((p, i) => {
              const x = toX(normCost(p));
              const y = toY(p.total_points || 0);
              const col = POS_COL[p.position] || "#888";
              const r = hover === i ? 7 : 5;
              return (
                <circle key={i} cx={x} cy={y} r={r} fill={col} fillOpacity={hover===i?1:0.75}
                  stroke={hover===i?"#fff":"rgba(0,0,0,0.3)"} strokeWidth={hover===i?1.5:0.5}
                  style={{ cursor: "pointer", transition: "r .1s, fill-opacity .1s" }}
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
              );
            })}
            {/* Tooltip */}
            {hover !== null && filtered[hover] && (() => {
              const p = filtered[hover];
              const rx = Math.min(Math.max(toX(normCost(p)) + 8, M.l), M.l+cw-130);
              const ry = Math.max(toY(p.total_points||0) - 56, M.t);
              return (
                <g>
                  <rect x={rx} y={ry} width={130} height={50} rx={5} fill="rgba(10,12,18,0.97)" stroke="var(--gold)" strokeWidth={0.75} />
                  <text x={rx+8} y={ry+15} fill="var(--gold)" fontSize={11} fontWeight={600} fontFamily="Oswald,sans-serif">{p.display_name||p.name}</text>
                  <text x={rx+8} y={ry+27} fill="rgba(255,255,255,0.45)" fontSize={9} fontFamily="Barlow Condensed,sans-serif">{p.team_name||p.team} {"\u00b7"} {p.position}</text>
                  <text x={rx+8} y={ry+41} fill="rgba(255,255,255,0.55)" fontSize={9} fontFamily="Barlow Condensed,sans-serif">{p.total_points}pts {"\u00b7"} {"\u00a3"}{normCost(p).toFixed(1)}m {"\u00b7"} {((p.total_points||0)/Math.max(normCost(p),0.1)).toFixed(1)} PPM</text>
                </g>
              );
            })()}
          </svg>
          {/* Legend */}
          <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "center" }}>
            {Object.entries(POS_COL).map(([pos, col]) => (
              <div key={pos} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
                <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>{pos}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* PPM Leaderboard */}
      <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>Top 20 by Points Per Million</div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {ppmList.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 4px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, color: "var(--text3)", width: 18, flexShrink: 0 }}>{i+1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 12 }}>{p.display_name||p.name}</div>
                <div style={{ fontSize: 9, color: "var(--text3)" }}>{p.position} {"\u00b7"} {"\u00a3"}{normCost(p).toFixed(1)}m</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, fontWeight: 700, color: "var(--green)", lineHeight: 1 }}>{p.ppm.toFixed(1)}</div>
                <div style={{ fontSize: 8, color: "var(--text3)" }}>{p.total_points}pts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ COMPARE TAB ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function CompareTab({ players }) {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);
  const [showDropA, setShowDropA] = useState(false);
  const [showDropB, setShowDropB] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);

  const suggestA = useMemo(() => searchA.length < 2 ? [] : players.filter(p => (p.display_name || p.name || "").toLowerCase().includes(searchA.toLowerCase())).slice(0, 8), [searchA, players]);
  const suggestB = useMemo(() => searchB.length < 2 ? [] : players.filter(p => (p.display_name || p.name || "").toLowerCase().includes(searchB.toLowerCase())).slice(0, 8), [searchB, players]);

  const compare = async () => {
    if (!playerA || !playerB) return;
    setLoading(true); setVerdict(""); setStreaming(false);
    try {
      let text = "";
      setStreaming(true);
      for await (const chunk of streamChat(
        `Compare ${playerA.name || playerA.full_name} vs ${playerB.name || playerB.full_name}. Who is the better FPL pick and why? Compare form, points, xG, fixtures, value.`,
        [playerA.name || playerA.full_name, playerB.name || playerB.full_name]
      )) {
        if (chunk.type === "text") { text += chunk.content; setVerdict(text.replace(/\*\*/g, "").replace(/#{1,6}\s/g, "").replace(/\u2022/g, "-")); }
        if (chunk.type === "done") setStreaming(false);
      }
    } catch { setVerdict("Failed to get AI verdict. Make sure the backend is running."); setStreaming(false); }
    setLoading(false);
  };

  const StatRow = ({ label, a, b, higherIsBetter = true }) => {
    const na = parseFloat(a) || 0, nb = parseFloat(b) || 0;
    const aWins = higherIsBetter ? na > nb : na < nb;
    const bWins = higherIsBetter ? nb > na : nb < na;
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
        <div style={{ textAlign: "right", fontFamily: "Oswald,sans-serif", fontSize: 15, fontWeight: 700, color: aWins ? "var(--green)" : "var(--text)", paddingRight: 16 }}>{a}</div>
        <div style={{ textAlign: "center", fontSize: 9, color: "var(--text3)", fontFamily: "Barlow Condensed,sans-serif", letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</div>
        <div style={{ textAlign: "left", fontFamily: "Oswald,sans-serif", fontSize: 15, fontWeight: 700, color: bWins ? "var(--green)" : "var(--text)", paddingLeft: 16 }}>{b}</div>
      </div>
    );
  };

  const PlayerPhoto = ({ player, accentColor }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: `2px solid ${accentColor}` }}>
        <ImgSafe src={playerPhoto(player)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          fallback={<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)" }}>
            <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 22, color: accentColor, fontWeight: 700 }}>
              {(player.display_name || player.name || "?").slice(0,1)}
            </span>
          </div>}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, color: accentColor, letterSpacing: 0.5 }}>
          {(player.display_name || player.name || "").split(" ").pop()}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 3 }}>
          <ClubBadge player={player} size={14} />
          <span style={{ fontSize: 10, color: "var(--text3)" }}>{player.team || player.team_name}</span>
        </div>
        <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>
          {player.position} {" Â· "} {"Â£"}{normCost(player).toFixed(1)}m
        </div>
      </div>
    </div>
  );

  const presets = [["Haaland", "Salah"], ["Palmer", "Saka"], ["Fernandes", "Rice"], ["Isak", "Watkins"]];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "16px 20px", gap: 12 }}>
      {/* Search row */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input value={searchA} onChange={e => { setSearchA(e.target.value); setShowDropA(true); setPlayerA(null); }} onFocus={() => setShowDropA(true)}
            placeholder="Player 1 (e.g. Haaland)"
            style={{ width: "100%", background: "var(--bg2)", border: `1px solid ${playerA ? "rgba(200,168,75,0.4)" : "var(--border2)"}`, borderRadius: 6, padding: "9px 12px", fontFamily: "Barlow,sans-serif", fontSize: 13, color: "var(--text)", outline: "none" }} />
          {showDropA && suggestA.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, zIndex: 50, maxHeight: 200, overflowY: "auto" }}>
              {suggestA.map(p => (
                <div key={p.id || p.sm_id} onClick={() => { setPlayerA(p); setSearchA(p.display_name || p.name); setShowDropA(false); }}
                  style={{ padding: "7px 12px", cursor: "pointer", fontSize: 12, color: "var(--text)", fontFamily: "Barlow,sans-serif", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--gold-dim)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span>{p.display_name || p.name}</span>
                  <span style={{ color: "var(--text3)", fontSize: 10 }}>{p.position} {"\u00b7"} {p.team || p.team_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, color: "var(--text3)", letterSpacing: 2, flexShrink: 0 }}>VS</span>
        <div style={{ flex: 1, position: "relative" }}>
          <input value={searchB} onChange={e => { setSearchB(e.target.value); setShowDropB(true); setPlayerB(null); }} onFocus={() => setShowDropB(true)}
            placeholder="Player 2 (e.g. Salah)"
            style={{ width: "100%", background: "var(--bg2)", border: `1px solid ${playerB ? "rgba(59,138,226,0.4)" : "var(--border2)"}`, borderRadius: 6, padding: "9px 12px", fontFamily: "Barlow,sans-serif", fontSize: 13, color: "var(--text)", outline: "none" }} />
          {showDropB && suggestB.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, zIndex: 50, maxHeight: 200, overflowY: "auto" }}>
              {suggestB.map(p => (
                <div key={p.id || p.sm_id} onClick={() => { setPlayerB(p); setSearchB(p.display_name || p.name); setShowDropB(false); }}
                  style={{ padding: "7px 12px", cursor: "pointer", fontSize: 12, color: "var(--text)", fontFamily: "Barlow,sans-serif", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--blue-dim)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span>{p.display_name || p.name}</span>
                  <span style={{ color: "var(--text3)", fontSize: 10 }}>{p.position} {"\u00b7"} {p.team || p.team_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={compare} disabled={!playerA || !playerB || loading}
          style={{ padding: "9px 18px", borderRadius: 6, fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: playerA && playerB ? "pointer" : "default", textTransform: "uppercase", background: "var(--gold-dim)", border: "1px solid rgba(200,168,75,0.4)", color: "var(--gold)", opacity: playerA && playerB ? 1 : 0.4, flexShrink: 0 }}>
          {loading ? "Loading..." : streaming ? "Analysing..." : "AI Verdict \u2192"}
        </button>
      </div>
      {/* Presets */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {presets.map(([a, b], i) => (
          <button key={i} onClick={() => {
            const pA = players.find(p => (p.display_name || p.name || "").toLowerCase().includes(a.toLowerCase()));
            const pB = players.find(p => (p.display_name || p.name || "").toLowerCase().includes(b.toLowerCase()));
            if (pA) { setPlayerA(pA); setSearchA(pA.display_name || pA.name); }
            if (pB) { setPlayerB(pB); setSearchB(pB.display_name || pB.name); }
          }} style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, padding: "3px 10px", borderRadius: 4, cursor: "pointer", textTransform: "uppercase", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border2)", color: "var(--text2)" }}>{a} vs {b}</button>
        ))}
      </div>

      {playerA && playerB ? (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, overflow: "hidden", minHeight: 0 }}>
          {/* LEFT: Player photos + stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, overflow: "auto" }}>
            {/* Player headers â€” centered, no bg, no border */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 8 }}>
                <PlayerPhoto player={playerA} accentColor="var(--gold)" />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, color: "var(--text3)", letterSpacing: 3 }}>VS</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 8 }}>
                <PlayerPhoto player={playerB} accentColor="#7ab0f5" />
              </div>
            </div>
            {/* Stats */}
            <StatRow label="FPL Points" a={playerA.total_points || 0} b={playerB.total_points || 0} />
            <StatRow label="Goals" a={playerA.goals || 0} b={playerB.goals || 0} />
            <StatRow label="Assists" a={playerA.assists || 0} b={playerB.assists || 0} />
            <StatRow label="xG" a={parseFloat(playerA.xg || 0).toFixed(1)} b={parseFloat(playerB.xg || 0).toFixed(1)} />
            <StatRow label="xA" a={parseFloat(playerA.xa || 0).toFixed(1)} b={parseFloat(playerB.xa || 0).toFixed(1)} />
            <StatRow label="Form" a={parseFloat(playerA.form || 0).toFixed(1)} b={parseFloat(playerB.form || 0).toFixed(1)} />
            <StatRow label="Price" a={"\u00a3" + normCost(playerA).toFixed(1) + "m"} b={"\u00a3" + normCost(playerB).toFixed(1) + "m"} higherIsBetter={false} />
            <StatRow label="PPM" a={((playerA.total_points||0)/Math.max(normCost(playerA),0.1)).toFixed(1)} b={((playerB.total_points||0)/Math.max(normCost(playerB),0.1)).toFixed(1)} />
            <StatRow label="Own %" a={(playerA.ownership_pct || 0) + "%"} b={(playerB.ownership_pct || 0) + "%"} higherIsBetter={false} />
          </div>

          {/* RIGHT: AI Verdict */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexShrink: 0 }}>
              <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, color: "var(--text3)", textTransform: "uppercase" }}>AI Verdict</span>
              <span style={{ background: "var(--blue-dim)", border: "1px solid rgba(59,138,226,0.3)", borderRadius: 3, padding: "1px 6px", fontSize: 8, color: "#7ab0f5", fontFamily: "Barlow Condensed,sans-serif", letterSpacing: 1 }}>RAG</span>
              {streaming && <span style={{ fontSize: 9, color: "var(--green)" }}>{"\u25cf"} live</span>}
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {verdict
                ? <div style={{ fontSize: 12, lineHeight: 1.75, color: "var(--text)", whiteSpace: "pre-wrap", fontFamily: "Barlow,sans-serif" }}>{verdict}</div>
                : <div style={{ color: "var(--text3)", fontSize: 12, fontFamily: "Barlow,sans-serif" }}>
                    Click "AI Verdict" to get a RAG-powered analysis grounded in real player data.
                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                      {["Form and recent gameweek returns", "xG vs actual goals â€” who is over/underperforming?", "Fixture difficulty for next 5 GWs", "Value for money and ownership considerations"].map((hint, i) => (
                        <div key={i} style={{ fontSize: 10, color: "var(--text3)", display: "flex", gap: 6, alignItems: "flex-start" }}>
                          <span style={{ color: "var(--gold)", flexShrink: 0 }}>{"\u2022"}</span>{hint}
                        </div>
                      ))}
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.06)", letterSpacing: 4 }}>COMPARE PLAYERS</div>
          <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "Barlow Condensed,sans-serif", letterSpacing: 1 }}>Search two players above and click AI Verdict</div>
        </div>
      )}
    </div>
  );
}


// --- DIFFERENTIALS TAB ---
function DifferentialsTab({ players }) {
  const [maxOwn, setMaxOwn] = useState(10);
  const [minPts, setMinPts] = useState(50);
  const [pos, setPos] = useState("ALL");
  const [insight, setInsight] = useState("");
  const [streaming, setStreaming] = useState(false);

  const diffs = useMemo(() => {
    return players
      .filter(p => {
        const own = p.ownership_pct || p.selected_pct || 0;
        const pts = p.total_points || 0;
        return own <= maxOwn && pts >= minPts && (pos === "ALL" || p.position === pos);
      })
      .map(p => ({
        ...p,
        diff_score: ((p.total_points || 0) / Math.max(p.ownership_pct || p.selected_pct || 0.1, 0.1)).toFixed(1),
      }))
      .sort((a, b) => parseFloat(b.diff_score) - parseFloat(a.diff_score))
      .slice(0, 30);
  }, [players, maxOwn, minPts, pos]);

  const getInsight = async () => {
    const top5 = diffs.slice(0, 5).map(p => p.display_name || p.name).join(", ");
    setInsight(""); setStreaming(true);
    try {
      let text = "";
      for await (const chunk of streamChat(`Analyse these differential FPL picks: ${top5}. Who is the best differential and why? Consider form, fixtures, and underlying stats.`)) {
        if (chunk.type === "text") { text += chunk.content; setInsight(text.replace(/\*\*/g, "").replace(/#{1,6}\s/g, "")); }
        if (chunk.type === "done") setStreaming(false);
      }
    } catch { setInsight("Failed to get AI insight."); setStreaming(false); }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "16px 20px", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {["ALL","GK","DEF","MID","FWD"].map(p => <Chip key={p} label={p} active={pos===p} onClick={() => setPos(p)} />)}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase" }}>Max Own%</span>
          <input type="range" min={1} max={30} value={maxOwn} onChange={e => setMaxOwn(+e.target.value)} style={{ width: 80, accentColor: "var(--gold)" }} />
          <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, color: "var(--gold)", minWidth: 24 }}>{maxOwn}%</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase" }}>Min Pts</span>
          <input type="range" min={0} max={150} step={10} value={minPts} onChange={e => setMinPts(+e.target.value)} style={{ width: 80, accentColor: "var(--gold)" }} />
          <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, color: "var(--gold)", minWidth: 24 }}>{minPts}</span>
        </div>
        <button onClick={getInsight} disabled={streaming || !diffs.length}
          style={{ padding: "5px 14px", borderRadius: 5, fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, cursor: "pointer", textTransform: "uppercase", background: "rgba(59,138,226,0.1)", border: "1px solid rgba(59,138,226,0.3)", color: "#7ab0f5" }}>
          AI Insight {"\u2192"}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {diffs.map((p, i) => (
          <div key={p.id || p.sm_id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, color: "var(--text3)", width: 24, flexShrink: 0, textAlign: "center" }}>{i + 1}</span>
            <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border2)", flexShrink: 0 }}>
              <ImgSafe src={playerPhoto(p)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.display_name || p.name}</div>
              <div style={{ fontSize: 9, color: "var(--text3)" }}>{p.position} {"\u00b7"} {p.team || p.team_name}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, color: "var(--green)" }}>{p.total_points} pts</div>
              <div style={{ fontSize: 9, color: "var(--text3)" }}>{p.ownership_pct || p.selected_pct || 0}% owned</div>
            </div>
            <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 14, fontWeight: 700, color: "var(--gold)", minWidth: 40, textAlign: "right" }}>{p.diff_score}</div>
          </div>
        ))}
        {!diffs.length && <div style={{ padding: 20, color: "var(--text3)", fontSize: 12 }}>No differentials match your filters.</div>}
      </div>
      {insight && (
        <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", fontSize: 12, lineHeight: 1.7, color: "var(--text)", fontFamily: "Barlow,sans-serif", whiteSpace: "pre-wrap", maxHeight: 180, overflowY: "auto", flexShrink: 0 }}>
          <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: 2, color: "var(--blue)", textTransform: "uppercase", marginBottom: 6 }}>AI Insight {streaming && "\u2026"}</div>
          {insight}
        </div>
      )}
    </div>
  );
}

// --- FORM TABLE TAB ---
function FormTableTab({ players, onPlayerClick }) {
  const [pos, setPos] = useState("ALL");
  const sorted = useMemo(() => {
    return players
      .filter(p => (p.form > 0 || p.total_points > 0) && (pos === "ALL" || p.position === pos))
      .sort((a, b) => parseFloat(b.form || 0) - parseFloat(a.form || 0))
      .slice(0, 50);
  }, [players, pos]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "16px 20px" }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        {["ALL","GK","DEF","MID","FWD"].map(p => <Chip key={p} label={p} active={pos===p} onClick={() => setPos(p)} />)}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ color: "var(--text3)", fontFamily: "Barlow Condensed,sans-serif", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
              <th style={{ textAlign: "left", padding: "4px 6px", width: 30 }}>#</th>
              <th style={{ textAlign: "left", padding: "4px 6px", width: 30 }}></th>
              <th style={{ textAlign: "left", padding: "4px 6px" }}>Name</th>
              <th style={{ textAlign: "left", padding: "4px 6px" }}>Team</th>
              <th style={{ textAlign: "center", padding: "4px 6px", width: 40 }}>Pos</th>
              <th style={{ textAlign: "center", padding: "4px 6px", width: 50 }}>Form</th>
              <th style={{ textAlign: "center", padding: "4px 6px", width: 40 }}>Pts</th>
              <th style={{ textAlign: "center", padding: "4px 6px", width: 40 }}>xG</th>
              <th style={{ textAlign: "center", padding: "4px 6px", width: 50 }}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const form = parseFloat(p.form || 0);
              const formColor = form >= 6 ? "var(--green)" : form >= 4 ? "var(--amber)" : "var(--red)";
              return (
                <tr key={p.id || p.sm_id || i} onClick={() => onPlayerClick && onPlayerClick(p)}
                  style={{ borderTop: "1px solid var(--border)", cursor: "pointer", transition: "background .1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "6px", color: "var(--text3)", fontFamily: "Oswald,sans-serif", fontSize: 11 }}>{i + 1}</td>
                  <td style={{ padding: "6px" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                      <ImgSafe src={playerPhoto(p)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    </div>
                  </td>
                  <td style={{ padding: "6px", fontFamily: "Barlow Condensed,sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{p.display_name || p.name}</td>
                  <td style={{ padding: "6px", fontSize: 11, color: "var(--text2)" }}>{p.team || p.team_name}</td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 9, fontWeight: 700, background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(200,168,75,0.25)", borderRadius: 2, padding: "1px 4px" }}>{p.position}</span>
                  </td>
                  <td style={{ padding: "6px", textAlign: "center", fontFamily: "Oswald,sans-serif", fontSize: 14, fontWeight: 700, color: formColor }}>{form.toFixed(1)}</td>
                  <td style={{ padding: "6px", textAlign: "center", fontFamily: "Oswald,sans-serif", color: "var(--green)" }}>{p.total_points || 0}</td>
                  <td style={{ padding: "6px", textAlign: "center", fontFamily: "Oswald,sans-serif", color: "var(--text2)" }}>{parseFloat(p.xg || 0).toFixed(1)}</td>
                  <td style={{ padding: "6px", textAlign: "center", fontFamily: "Oswald,sans-serif", color: "var(--text2)" }}>{"\u00a3"}{normCost(p).toFixed(1)}m</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- STATS TAB (wrapper with 4 sub-tabs) ---
function StatsTab({ players, onPlayerClick }) {
  const [sub, setSub] = useState("scatter");
  const tabs = [
    { key: "scatter", label: "Price vs Performance", desc: "Points scored vs player cost â€” spots over/undervalued picks" },
    { key: "diff", label: "Player Differentials", desc: "Low-ownership players with strong underlying stats" },
    { key: "compare", label: "Compare Players", desc: "Head-to-head stat comparison between two players" },
    { key: "form", label: "Form Table", desc: "Recent gameweek form ranked across all positions" },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", flexShrink: 0, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setSub(t.key)} style={{
            padding: "10px 20px", fontFamily: "Barlow Condensed,sans-serif", cursor: "pointer", background: "none",
            borderTop: "none", borderLeft: "none", borderRight: "none", flexShrink: 0,
            borderBottom: sub === t.key ? "2px solid var(--gold)" : "2px solid transparent",
            textAlign: "left", minWidth: 0,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: sub === t.key ? "var(--gold)" : "var(--text2)", whiteSpace: "nowrap" }}>{t.label}</div>
            <div style={{ fontSize: 9, color: sub === t.key ? "rgba(200,168,75,0.6)" : "var(--text3)", marginTop: 2, whiteSpace: "nowrap", letterSpacing: 0.3, fontFamily: "Barlow Condensed,sans-serif" }}>{t.desc}</div>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sub} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
          {sub === "scatter" && <ScatterChart players={players} />}
          {sub === "diff" && <DifferentialsTab players={players} />}
          {sub === "compare" && <CompareTab players={players} />}
          {sub === "form" && <FormTableTab players={players} onPlayerClick={onPlayerClick} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- EVAL TAB ---
function EvalTab() {
  const [evalPanel, setEvalPanel] = useState("inspector");
  const [health, setHealth] = useState(null);

  // Panel 1: Query Inspector
  const [inspQuery, setInspQuery] = useState("");
  const [inspResult, setInspResult] = useState(null);
  const [inspLoading, setInspLoading] = useState(false);

  // Panel 2: Benchmark Runner
  const [benchResult, setBenchResult] = useState(null);
  const [benchRunning, setBenchRunning] = useState(false);
  const [benchProgress, setBenchProgress] = useState(0);

  // Panel 3: RAG vs Baseline
  const [compQuery, setCompQuery] = useState("");
  const [compResult, setCompResult] = useState(null);
  const [compLoading, setCompLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/health`).then(r => r.json()).then(d => setHealth(d)).catch(() => setHealth(null));
  }, []);

  const runInspect = async () => {
    if (!inspQuery.trim()) return;
    setInspLoading(true); setInspResult(null);
    try {
      const r = await fetch(`${BASE}/api/eval/single`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: inspQuery, top_n: 5 }) });
      const data = await r.json();
      setInspResult(data);
    } catch { setInspResult({ error: "Failed to connect to backend" }); }
    setInspLoading(false);
  };

  const runBenchmark = async () => {
    setBenchRunning(true); setBenchResult(null); setBenchProgress(0);
    const fakeProgress = setInterval(() => setBenchProgress(p => Math.min(p + 2, 95)), 500);
    try {
      const r = await fetch(`${BASE}/api/eval/run`, { method: "POST" });
      const data = await r.json();
      setBenchResult(data); setBenchProgress(100);
    } catch { setBenchResult({ error: "Benchmark failed" }); }
    clearInterval(fakeProgress);
    setBenchRunning(false);
  };

  const runCompare = async () => {
    if (!compQuery.trim()) return;
    setCompLoading(true); setCompResult(null);
    try {
      const r = await fetch(`${BASE}/api/eval/compare`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: compQuery }) });
      const data = await r.json();
      setCompResult(data);
    } catch { setCompResult({ error: "Comparison failed" }); }
    setCompLoading(false);
  };

  const StatusDot = ({ ok }) => <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: ok ? "var(--green)" : "var(--red)", marginRight: 6 }} />;
  const SectionLabel = ({ children }) => <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: 2, color: "var(--text3)", textTransform: "uppercase", marginBottom: 6 }}>{children}</div>;
  const Card = ({ children, style: s }) => <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", ...s }}>{children}</div>;
  const GoldBtn = ({ onClick, disabled, children, style: s }) => (
    <button onClick={onClick} disabled={disabled} style={{ padding: "8px 20px", borderRadius: 6, fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: disabled ? "not-allowed" : "pointer", textTransform: "uppercase", background: disabled ? "rgba(200,168,75,0.1)" : "var(--gold-dim)", border: "1px solid rgba(200,168,75,0.4)", color: disabled ? "var(--text3)" : "var(--gold)", opacity: disabled ? 0.5 : 1, ...s }}>{children}</button>
  );

  const panelTabs = [
    { key: "inspector", label: "Query Inspector" },
    { key: "benchmark", label: "Benchmark (30Q)" },
    { key: "compare", label: "RAG vs Baseline" },
  ];

  const catColors = { lookup: "#5adb8a", comparison: "#3b8ae2", statistical: "#c8a84b", tactical: "#b482ff", hallucination_guard: "#e25555", squad: "#45b8c2" };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
      <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "var(--gold)", textTransform: "uppercase", marginBottom: 12, borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>RAG Evaluation Dashboard</div>

      {/* Health row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Chunks", value: health?.chunk_count ?? "?", ok: (health?.chunk_count || 0) > 0 },
          { label: "Players", value: health?.player_count ?? "?", ok: (health?.player_count || 0) > 0 },
          { label: "BM25", value: health?.bm25_loaded ? "Loaded" : "Missing", ok: health?.bm25_loaded },
          { label: "Retriever", value: health?.retriever_ready ? "Ready" : "Off", ok: health?.retriever_ready },
          { label: "LLM", value: health?.llm_ready ? "Ready" : "Off", ok: health?.llm_ready },
        ].map((m, i) => (
          <div key={i} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px" }}>
            <div style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: 2, color: "var(--text3)", textTransform: "uppercase", marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, color: m.ok ? "var(--green)" : "var(--red)" }}><StatusDot ok={m.ok} />{m.value}</div>
          </div>
        ))}
      </div>

      {/* Panel tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {panelTabs.map(t => (
          <button key={t.key} onClick={() => setEvalPanel(t.key)}
            style={{ padding: "6px 16px", borderRadius: 4, fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", background: evalPanel === t.key ? "var(--gold-dim)" : "transparent", border: evalPanel === t.key ? "1px solid rgba(200,168,75,0.4)" : "1px solid var(--border)", color: evalPanel === t.key ? "var(--gold)" : "var(--text3)" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel 1: Query Inspector */}
      {evalPanel === "inspector" && (
        <div>
          <SectionLabel>Analyse Single Query</SectionLabel>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input value={inspQuery} onChange={e => setInspQuery(e.target.value)} placeholder="e.g. Tell me about Erling Haaland"
              onKeyDown={e => e.key === "Enter" && runInspect()}
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border2)", borderRadius: 6, padding: "10px 12px", fontFamily: "Barlow,sans-serif", fontSize: 12, color: "var(--text)", outline: "none" }} />
            <GoldBtn onClick={runInspect} disabled={inspLoading || !inspQuery.trim()}>
              {inspLoading ? "Analysing..." : "Analyse"} {"\u2192"}
            </GoldBtn>
          </div>
          {inspResult && !inspResult.error && (
            <div>
              {/* Route info */}
              <Card style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                  <div>
                    <SectionLabel>Query Type</SectionLabel>
                    <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, color: catColors[inspResult.route_type] || "var(--gold)" }}>{inspResult.route_type}</span>
                  </div>
                  <div>
                    <SectionLabel>Vector Weight</SectionLabel>
                    <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, color: "var(--blue)" }}>{inspResult.retrieval_config?.vector_weight}</span>
                  </div>
                  <div>
                    <SectionLabel>BM25 Weight</SectionLabel>
                    <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, color: "#5adb8a" }}>{inspResult.retrieval_config?.bm25_weight}</span>
                  </div>
                  <div>
                    <SectionLabel>Decompose</SectionLabel>
                    <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, color: inspResult.retrieval_config?.decompose ? "var(--gold)" : "var(--text3)" }}>{inspResult.retrieval_config?.decompose ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <SectionLabel>Latency</SectionLabel>
                    <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{inspResult.latency_ms}ms</span>
                  </div>
                </div>
              </Card>
              {/* Retrieved chunks */}
              <SectionLabel>Top Retrieved Chunks</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(inspResult.results || []).map((r, i) => (
                  <Card key={i} style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 12, fontWeight: 700, color: "var(--blue)" }}>#{i + 1} {r.player_name || r.chunk_id}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 9, color: "var(--text3)" }}>vec: {r.vector_score}</span>
                        <span style={{ fontSize: 9, color: "var(--text3)" }}>bm25: {r.bm25_score}</span>
                        <span style={{ fontSize: 9, color: "var(--text3)" }}>rrf: {r.rrf_score}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: "var(--green)" }}>rerank: {r.rerank_score}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.5, fontFamily: "Barlow,sans-serif" }}>{r.text_preview}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {inspResult?.error && <Card><div style={{ color: "var(--red)", fontSize: 12 }}>{inspResult.error}</div></Card>}
        </div>
      )}

      {/* Panel 2: Benchmark Runner */}
      {evalPanel === "benchmark" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <GoldBtn onClick={runBenchmark} disabled={benchRunning}>
              {benchRunning ? "Running..." : "Run Benchmark (30 Queries)"} {"\u2192"}
            </GoldBtn>
            {benchRunning && (
              <div style={{ flex: 1, height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${benchProgress}%`, height: "100%", background: "var(--gold)", borderRadius: 3, transition: "width 0.3s" }} />
              </div>
            )}
          </div>
          {benchResult && !benchResult.error && (
            <div>
              {/* Overall stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                <Card>
                  <SectionLabel>Overall Precision</SectionLabel>
                  <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 28, fontWeight: 700, color: benchResult.overall_precision >= 0.85 ? "var(--green)" : benchResult.overall_precision >= 0.7 ? "var(--gold)" : "var(--red)" }}>{Math.round(benchResult.overall_precision * 100)}%</div>
                </Card>
                <Card>
                  <SectionLabel>Queries Run</SectionLabel>
                  <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{benchResult.total_queries}</div>
                </Card>
                <Card>
                  <SectionLabel>Avg Latency</SectionLabel>
                  <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{benchResult.avg_latency_ms}ms</div>
                </Card>
              </div>
              {/* Category breakdown - bar chart */}
              <SectionLabel>Category Breakdown</SectionLabel>
              <Card style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Object.entries(benchResult.by_category || {}).map(([cat, stats]) => (
                    <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 130, fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 600, color: catColors[cat] || "var(--text)", textTransform: "uppercase" }}>{cat.replace(/_/g, " ")}</div>
                      <div style={{ flex: 1, height: 18, background: "rgba(255,255,255,0.03)", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                        <div style={{ width: `${(stats.precision || 0) * 100}%`, height: "100%", background: catColors[cat] || "var(--gold)", borderRadius: 3, opacity: 0.6, transition: "width 0.5s" }} />
                        <span style={{ position: "absolute", right: 6, top: 2, fontSize: 10, fontWeight: 700, color: "var(--text)", fontFamily: "Oswald,sans-serif" }}>{stats.hits}/{stats.total}</span>
                      </div>
                      <div style={{ width: 50, fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 700, color: "var(--text3)", textAlign: "right" }}>{stats.avg_latency}ms</div>
                    </div>
                  ))}
                </div>
              </Card>
              {/* Details table */}
              <SectionLabel>Query Details</SectionLabel>
              <div style={{ maxHeight: 300, overflow: "auto" }}>
                {(benchResult.details || []).map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", background: d.hit ? "var(--green)" : "var(--red)", display: "inline-block", flexShrink: 0, opacity: 0.7 }} />
                    <span style={{ flex: 1, fontSize: 11, fontFamily: "Barlow,sans-serif", color: d.hit ? "var(--text)" : "var(--red)" }}>{d.query}</span>
                    <span style={{ fontSize: 9, fontFamily: "Barlow Condensed,sans-serif", color: catColors[d.category] || "var(--text3)", textTransform: "uppercase", fontWeight: 600, width: 80, textAlign: "right" }}>{d.category}</span>
                    <span style={{ fontSize: 10, fontFamily: "Oswald,sans-serif", color: "var(--text3)", width: 45, textAlign: "right" }}>{d.latency_ms}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {benchResult?.error && <Card><div style={{ color: "var(--red)", fontSize: 12 }}>{benchResult.error}</div></Card>}
        </div>
      )}

      {/* Panel 3: RAG vs Baseline */}
      {evalPanel === "compare" && (
        <div>
          <SectionLabel>Compare RAG vs Standalone LLM</SectionLabel>
          <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 10, fontFamily: "Barlow,sans-serif" }}>
            Run the same query through the RAG pipeline (with retrieval context) and a standalone LLM (no context). This proves RAG produces grounded, accurate responses.
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input value={compQuery} onChange={e => setCompQuery(e.target.value)} placeholder="e.g. How many goals has Haaland scored?"
              onKeyDown={e => e.key === "Enter" && runCompare()}
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border2)", borderRadius: 6, padding: "10px 12px", fontFamily: "Barlow,sans-serif", fontSize: 12, color: "var(--text)", outline: "none" }} />
            <GoldBtn onClick={runCompare} disabled={compLoading || !compQuery.trim()}>
              {compLoading ? "Comparing..." : "Compare"} {"\u2192"}
            </GoldBtn>
          </div>
          {/* Preset queries */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {["How many goals has Haaland scored?", "What are Salah's FPL points?", "What is Messi's FPL data?", "Best differential midfielder?"].map(q => (
              <button key={q} onClick={() => { setCompQuery(q); }} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 10, fontFamily: "Barlow,sans-serif", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text2)" }}>{q}</button>
            ))}
          </div>
          {compResult && !compResult.error && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* RAG Response */}
              <Card style={{ borderColor: "rgba(90,219,138,0.3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--green)", textTransform: "uppercase" }}>RAG Response</span>
                  <span style={{ fontSize: 9, color: "var(--text3)" }}>{compResult.rag?.chunks_used || 0} chunks</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.6, color: "var(--text)", fontFamily: "Barlow,sans-serif", whiteSpace: "pre-wrap", marginBottom: 10 }}>{compResult.rag?.response}</div>
                {/* Verification badge */}
                {compResult.rag?.verification && compResult.rag.verification.total_claims > 0 && (
                  <div style={{ background: "rgba(90,219,138,0.1)", borderRadius: 4, padding: "4px 8px", display: "inline-block", marginBottom: 8 }}>
                    <span style={{ fontSize: 9, color: "var(--green)", fontFamily: "Barlow Condensed,sans-serif", fontWeight: 600 }}>
                      Grounded: {Math.round(compResult.rag.verification.faithfulness_score * 100)}% ({compResult.rag.verification.verified}/{compResult.rag.verification.total_claims} claims)
                    </span>
                  </div>
                )}
                {/* Sources */}
                {(compResult.rag?.sources || []).length > 0 && (
                  <div>
                    <div style={{ fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Barlow Condensed,sans-serif", fontWeight: 600 }}>Sources</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {compResult.rag.sources.slice(0, 5).map((s, i) => (
                        <span key={i} style={{ fontSize: 9, background: "rgba(59,138,226,0.08)", border: "1px solid rgba(59,138,226,0.2)", borderRadius: 3, padding: "2px 6px", color: "#7ab0f5" }}>{s.player_name || s.chunk_type}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Token usage */}
                {compResult.rag?.usage && (
                  <div style={{ fontSize: 8, color: "var(--text3)", marginTop: 8, fontFamily: "Barlow Condensed,sans-serif" }}>
                    Tokens: {compResult.rag.usage.input_tokens} in / {compResult.rag.usage.output_tokens} out
                  </div>
                )}
              </Card>
              {/* Baseline Response */}
              <Card style={{ borderColor: "rgba(226,85,85,0.3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "Barlow Condensed,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--red)", textTransform: "uppercase" }}>Baseline LLM (No RAG)</span>
                  <span style={{ fontSize: 9, color: "var(--text3)" }}>0 chunks</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.6, color: "var(--text)", fontFamily: "Barlow,sans-serif", whiteSpace: "pre-wrap", marginBottom: 10 }}>{compResult.baseline?.response}</div>
                <div style={{ background: "rgba(226,85,85,0.1)", borderRadius: 4, padding: "4px 8px", display: "inline-block", marginBottom: 8 }}>
                  <span style={{ fontSize: 9, color: "var(--red)", fontFamily: "Barlow Condensed,sans-serif", fontWeight: 600 }}>No grounding â€” may contain hallucinations</span>
                </div>
                {compResult.baseline?.usage && (
                  <div style={{ fontSize: 8, color: "var(--text3)", marginTop: 8, fontFamily: "Barlow Condensed,sans-serif" }}>
                    Tokens: {compResult.baseline.usage.input_tokens} in / {compResult.baseline.usage.output_tokens} out
                  </div>
                )}
              </Card>
            </div>
          )}
          {compResult?.error && <Card><div style={{ color: "var(--red)", fontSize: 12 }}>{compResult.error}</div></Card>}
        </div>
      )}
    </div>
  );
}

// ===================================================================
// MAIN APP
// ===================================================================
function normCostGlobal(p) { const c = parseFloat(p?.cost) || 0; return c > 50 ? c / 10 : c; }

export default function App() {
  const [players, setPlayers] = useState([]);
  const [formation, setFormation] = useState("433");
  const [squad, setSquad] = useState({});
  const [activeTab, setActiveTab] = useState("My Squad");
  const [modalPlayer, setModalPlayer] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const aiSendRef = useRef(null);

  // Load players
  useEffect(() => {
    fetchPlayers({ limit: 500 }).then(data => { setPlayers(data); if (data.length) setBackendOnline(true); });
  }, []);

  // Squad management
  const addToSquad = useCallback((player) => {
    setSquad(prev => {
      const rows = FORMATIONS[formation] || [];
      const allKeys = rows.flatMap((row, ri) => row.map((slot, si) => ({ key: `${ri}_${si}`, pos: slot.pos })));
      const playerPos = player.position || "MID";
      const generalPos = POS_MAP[playerPos] || playerPos;
      // First try matching position
      const posMatch = allKeys.find(s => !prev[s.key] && (POS_MAP[s.pos] === generalPos || s.pos === playerPos));
      if (posMatch) return { ...prev, [posMatch.key]: player };
      // Then any empty
      const any = allKeys.find(s => !prev[s.key]);
      if (any) return { ...prev, [any.key]: player };
      return prev;
    });
  }, [formation]);

  const removeFromSquad = useCallback((playerId) => {
    setSquad(prev => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (next[k] && (next[k].id === playerId || next[k].sm_id === playerId)) {
          next[k] = null;
          break;
        }
      }
      return next;
    });
  }, []);

  const dropToSlot = useCallback((key, player) => {
    setSquad(prev => {
      const next = { ...prev };
      // Remove from old slot if already placed
      for (const k of Object.keys(next)) {
        if (next[k] && (next[k].id === player.id || next[k].sm_id === player.sm_id)) {
          // If dropping to same slot, do nothing
          if (k === key) return prev;
          // Swap if target is occupied
          if (next[key]) {
            const temp = next[key];
            next[key] = next[k];
            next[k] = temp;
            return next;
          }
          next[k] = null;
          break;
        }
      }
      next[key] = player;
      return next;
    });
  }, []);

  const autoPick = useCallback(() => {
    if (!players.length) return;
    const rows = FORMATIONS[formation] || [];
    const newSquad = {};
    const used = new Set();
    rows.forEach((row, ri) => {
      row.forEach((slot, si) => {
        const key = `${ri}_${si}`;
        const generalPos = POS_MAP[slot.pos] || slot.pos;
        const match = players.find(p => !used.has(p.id || p.sm_id) && p.position === generalPos);
        if (match) {
          newSquad[key] = match;
          used.add(match.id || match.sm_id);
        }
      });
    });
    setSquad(newSquad);
  }, [players, formation]);

  const clearSquad = useCallback(() => setSquad({}), []);

  // Derived state
  const chemistry = useMemo(() => calcChemistry(squad, formation), [squad, formation]);
  const squadIds = useMemo(() => new Set(Object.values(squad).filter(Boolean).map(p => String(p.id || p.sm_id))), [squad]);
  const spent = useMemo(() => Object.values(squad).filter(Boolean).reduce((s, p) => s + normCost(p), 0), [squad]);
  const remaining = BUDGET - spent;
  const count = Object.values(squad).filter(Boolean).length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gridTemplateRows: "48px 1fr", height: "100vh", background: "var(--bg)", color: "var(--text)", overflow: "hidden" }}>
      <TopBar activeTab={activeTab} onTab={setActiveTab} chemistry={chemistry} backendOnline={backendOnline} />
      {activeTab === "My Squad" && (
        <>
          <LeftPanel players={players} squad={squad} remaining={remaining} onAdd={addToSquad} onRemove={removeFromSquad} onPlayerClick={setModalPlayer} />
          <div style={{ gridColumn: 2, gridRow: 2, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <PitchControls formation={formation} onFormation={setFormation} onAutoPick={autoPick} onClear={clearSquad} spent={spent} remaining={remaining} count={count} />
            <FootballPitch formation={formation} squad={squad} onRemove={removeFromSquad} onPlayerClick={setModalPlayer} onDropToSlot={dropToSlot} />
          </div>
        </>
      )}
      {activeTab === "Stats" && <div style={{ gridColumn: "1/-1", gridRow: 2, display: "flex", overflow: "hidden" }}><StatsTab players={players} onPlayerClick={setModalPlayer} /></div>}
      {activeTab === "News" && <div style={{ gridColumn: "1/-1", gridRow: 2, overflow: "auto" }}><NewsTab /></div>}
      {activeTab === "Leagues" && <div style={{ gridColumn: "1/-1", gridRow: 2, overflow: "auto" }}><LeaguesTab /></div>}
      {activeTab === "Eval" && <div style={{ gridColumn: "1/-1", gridRow: 2, overflow: "auto" }}><EvalTab /></div>}
      <AnimatePresence>{modalPlayer && <PlayerModal player={modalPlayer} inSquad={squadIds.has(String(modalPlayer.id || modalPlayer.sm_id))} onClose={() => setModalPlayer(null)} onAdd={addToSquad} onRemove={removeFromSquad} onAskAI={q => { if (aiSendRef.current) aiSendRef.current(q); }} />}</AnimatePresence>
      <AIFloat squad={squad} sendRef={aiSendRef} />
    </div>
  );
}
