export const STATUS_STYLE = {
  open: { label: "Open", bg: "#fff8e1", color: "#a16207" },
  answered: { label: "Answered", bg: "#f0fdf4", color: "#15803d" },
  closed: { label: "Closed", bg: "#f1f5f9", color: "#64748b" },
};

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px", background: "#f7f9fb",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    "& fieldset": { border: "1px solid #eceef0" },
    "&.Mui-focused": {
      background: "#fff",
      boxShadow: "0 0 0 3px rgba(26,20,107,0.06)",
      "& fieldset": { borderColor: "#1a146b" },
    },
  },
};

export const btnPrimary = {
  px: 2.5, py: 1,
  background: "linear-gradient(135deg, #1a146b 0%, #312e81 100%)",
  color: "white", borderRadius: "8px",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 700, fontSize: 11, letterSpacing: "0.08em",
  textTransform: "none",
  "&:hover": { opacity: 0.9 },
  "&.Mui-disabled": { background: "#eceef0", color: "#c8c5d3" },
};

export const btnGhost = {
  px: 2.5, py: 1,
  background: "#eceef0", color: "#505f76", borderRadius: "8px",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 700, fontSize: 11, letterSpacing: "0.08em",
  textTransform: "none",
  "&:hover": { background: "#e0e3e5" },
};