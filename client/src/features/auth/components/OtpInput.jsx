import React from "react";
import { Box, Typography } from "@mui/material";

const OtpInput = ({ otp, errors, inputRefs, handlePaste, handleChange, handleKeyDown }) => {

    const hasError = !!errors?.otp;

    return (
        <>
            {/* OTP inputs */}
            <Box
                onPaste={handlePaste}
                sx={{
                    display: "flex",
                    gap: { xs: "6px", sm: "10px" },
                    mb: 0.5,
                    flexWrap: "nowrap",
                    width: "100%",
                }}
            >
                {otp.map((digit, i) => (
                    <Box
                        key={i}
                        component="input"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        ref={(el) => (inputRefs.current[i] = el)}
                        onChange={(e) => handleChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onFocus={(e) => e.target.select()}
                        onFocusCapture={(e) => {
                            e.target.style.background = "#ffffff";
                            e.target.style.borderColor = hasError
                                ? "#ba1a1a"
                                : "#1a146b";

                            e.target.style.boxShadow = hasError
                                ? "0 0 0 3px rgba(186,26,26,0.08)"
                                : "0 0 0 3px rgba(26,20,107,0.08)";
                        }}
                        onBlurCapture={(e) => {
                            e.target.style.background = digit
                                ? "#eef0ff"
                                : "#eceef0";

                            e.target.style.borderColor = hasError
                                ? "#ba1a1a"
                                : digit
                                    ? "#1a146b"
                                    : "transparent";

                            e.target.style.boxShadow = "none";
                        }}
                        style={{
                            flex: "1 1 0",
                            minWidth: 0,
                            width: "100%",
                            aspectRatio: "1",
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            color: "#191c1e",
                            background: digit ? "#eef0ff" : "#eceef0",
                            border: `2px solid ${hasError
                                ? "#ba1a1a"
                                : digit
                                    ? "#1a146b"
                                    : "transparent"
                                }`,
                            borderRadius: 10,
                            outline: "none",
                            cursor: "text",
                            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                            boxSizing: "border-box",
                        }}
                    />
                ))}
            </Box>

            {/* Error */}
            <Box sx={{ minHeight: 24, mb: 2, mt: 0.75, pl: 0.5 }}>
                {hasError && (
                    <Typography
                        sx={{
                            fontSize: 11,
                            color: "#ba1a1a",
                            fontWeight: 500,
                        }}
                    >
                        {errors?.otp?.message}
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default OtpInput;