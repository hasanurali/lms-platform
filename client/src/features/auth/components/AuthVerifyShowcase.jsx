import React from "react";
import { Box, Typography } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const AuthVerifyShowcase = () => {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(145deg, #1a146b 0%, #312e81 55%, #003d38 100%)",
        p: "52px 44px",
        position: "relative",
        overflow: "hidden",
        minHeight: 520,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.07,
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(49,46,129,0.45)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            fontWeight: 700,
            color: "rgba(226,223,255,0.95)",
            letterSpacing: "-0.01em",
            mb: 5,
          }}
        >
          The Scholarly Editorial
        </Typography>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.5,
            py: 0.5,
            mb: 2.5,
            background: "rgba(0,66,60,0.65)",
            borderRadius: "999px",
            border: "1px solid rgba(107,216,203,0.3)",
          }}
        >
          <Typography
            sx={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(107,216,203,0.9)",
            }}
          >
            Secure Access
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 30,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            mb: 2.5,
          }}
        >
          Protecting Your
          <br />
          Intellectual Journey.
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "rgba(226,223,255,0.6)",
            lineHeight: 1.8,
            fontWeight: 300,
            maxWidth: 280,
          }}
        >
          Verification ensures your private library and curated
          resources remain exclusive to you.
        </Typography>
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <VerifiedUserIcon
          sx={{
            fontSize: 18,
            color: "rgba(107,216,203,0.85)",
          }}
        />

        <Typography
          sx={{
            fontSize: 12,
            color: "rgba(226,223,255,0.65)",
            fontWeight: 500,
          }}
        >
          Two-Factor Authentication Active
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthVerifyShowcase;