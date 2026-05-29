import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#1a146b" },
        secondary: { main: "#505f76" },
        background: { default: "#f7f9fb" },
    },
    typography: { fontFamily: "'DM Sans', sans-serif" },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    backgroundColor: "#eceef0",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    "& fieldset": { border: "2px solid transparent" },
                    "&:hover fieldset": { borderColor: "transparent" },
                    "&.Mui-focused": {
                        backgroundColor: "#ffffff",
                        boxShadow: "0 0 0 4px rgba(26,20,107,0.08)",
                        "& fieldset": { borderColor: "#1a146b !important" },
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#474651",
                    "&.Mui-focused": { color: "#1a146b" },
                },
            },
        },
    },
});

export default theme;