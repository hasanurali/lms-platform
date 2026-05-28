import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";

import { ENDPOINTS } from "@/api/endpoints"


const OtpActions = ({ canResend, timerLabel, handleResend }) => {

    const location = useLocation();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1.5,
                pt: 2.5,
                borderTop: "1px solid #eceef0",
            }}
        >
            {/* Resend */}
            <Box
                component="button"
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: "none",
                    cursor: canResend ? "pointer" : "default",
                    color: canResend ? "#1a146b" : "#505f76",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: { xs: 12, sm: 13 },
                    fontWeight: 600,
                    opacity: canResend ? 1 : 0.8,
                    transition: "color 0.2s",
                    p: 0,
                }}
            >
                <RefreshIcon sx={{ fontSize: 14 }} />

                Resend Code

                {!canResend && (
                    <Box
                        component="span"
                        sx={{
                            color: "#00423c",
                            fontWeight: 700,
                        }}
                    >
                        {timerLabel}
                    </Box>
                )}
            </Box>

            {/* Change email */}
            {location.state?.from === ENDPOINTS.AUTH.LOGIN && <Box
                component={RouterLink}
                to={"/auth/login"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#505f76",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: { xs: 12, sm: 13 },
                    fontWeight: 600,
                    p: 0,
                    transition: "color 0.2s",
                    "&:hover": {
                        color: "#1a146b",
                    },
                }}
            >
                <EditIcon sx={{ fontSize: 14 }} />
                Change Email
            </Box>}
        </Box>
    );
};

export default OtpActions;