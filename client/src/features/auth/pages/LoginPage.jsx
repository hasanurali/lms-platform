import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom"
import { TextField, Button, Typography, Box, Checkbox, FormControlLabel, IconButton, InputAdornment } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import PasswordInput from "../components/PasswordInput"


const LoginPage = () => {

  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    const id = setTimeout(() => {
      el.style.transition = "all 0.9s cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box>
      {/* Atmospheric background orbs */}
      <Box sx={{
        position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden",
      }}>
        <Box sx={{
          position: "absolute", top: "-10%", left: "-10%",
          width: "40%", height: "40%",
          background: "rgba(26,20,107,0.05)", filter: "blur(120px)", borderRadius: "50%",
        }} />
        <Box sx={{
          position: "absolute", bottom: 0, right: 0,
          width: "30%", height: "30%",
          background: "rgba(137,245,231,0.08)", filter: "blur(100px)", borderRadius: "50%",
        }} />

        {/* Decorative images — hidden below xl */}
        <Box sx={{
          display: { xs: "none", xl: "block" },
          position: "absolute", top: "50%", left: 80,
          transform: "translateY(-50%) rotate(-2deg)",
          width: 320, height: 480, borderRadius: 4, overflow: "hidden",
          opacity: 0.35, filter: "grayscale(1)",
          transition: "all 1s", "&:hover": { filter: "grayscale(0)", opacity: 0.5 },
        }}>
          <Box component="img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx4YVQ-SkvOiqdZ5owc17UoMGnbtreJ5m8MCD1tSIVYRMsPZRr3xyMLSjosfXhJ4XmBV2YRyuuAGrYi4p9-d2hputmkJic3VfWGyfAahqDwMFR3wepCq7j8ag7buPDsnS9S0XrwO8vEFzz7PtK96oppH4AOcD6bLf-kWd-gY2hYeSN9Cl5ArzsnHWb3KTXEBvrkGZEygmbeuWxjYj0Ku5q4gzxIIsNziOqHQBH56zqDW2dThQwA_gPWl71jsdwN39IriUhR1r5aXk"
            alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>
        <Box sx={{
          display: { xs: "none", xl: "block" },
          position: "absolute", bottom: 80, right: 80,
          transform: "rotate(3deg)",
          width: 280, height: 380, borderRadius: 4, overflow: "hidden",
          opacity: 0.28, filter: "grayscale(1)",
          transition: "all 1s", "&:hover": { filter: "grayscale(0)", opacity: 0.45 },
        }}>
          <Box component="img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6Eo7EApsC1-mIX5EIs2H8EKD0tX6Q7DBYpxaPQoVpX8W68s0vc0ikl1rJesSpCiCehF-_3698c67soiXAUxbqboqmp8q5LJ0JcyIxahtUak0NvBF3Y8XuoTZ3AhaWL1AMXnL_Vcdt2PdiUaE2_QB_hDr0SkqCwO1raEFDEpGJP3-FpOKgOI6bgBC_YTBNNWlr2oJpiIuM1coojVBVHO2z94az252v0Phat-lh3zk-NIMQ0QQYbI5VnAzBKZwDUsuz_Rsd7QyzBUk"
            alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>
      </Box>

      {/* Sticky header */}
      <Box
        component="header"
        className="fixed top-0 w-full z-50"
        sx={{
          background: "rgba(247,249,251,0.8)",
          backdropFilter: "blur(24px)",
          height: 80,
          display: "flex", alignItems: "center", justifyContent: "center",
          px: 4,
        }}
      >
        <Typography
          component="a"
          href="/"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26, fontWeight: 700, color: "#1a146b",
            letterSpacing: "-0.02em", textDecoration: "none",
          }}
        >
          The Scholarly Editorial
        </Typography>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        className="min-h-screen flex items-center justify-center px-6"
        sx={{ pt: "80px" }}
      >
        <Box ref={cardRef} className="w-full max-w-115">

          {/* Welcome heading */}
          <Box className="text-center mb-12">
            <Typography sx={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#00423c", marginTop: "15px"
            }}>
              Welcome Back
            </Typography>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              mt: 1.5, fontSize: 34, fontWeight: 800,
              color: "#191c1e", letterSpacing: "-0.02em",
            }}>
              Resume Your Curation
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 15, color: "#505f76", lineHeight: 1.65 }}>
              Sign in to access your library, collections, and editorial insights.
            </Typography>
          </Box>

          {/* Card */}
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 3,
              p: { xs: 4, sm: 5 },
              boxShadow: "0 12px 40px -12px rgba(25,28,30,0.1)",
            }}
          >
            <Box
              component="form"
              onSubmit={e => e.preventDefault()}
              className="flex flex-col gap-8"
            >
              {/* Email */}
              <TextField
                id="email"
                label="Email Address"
                type="email"
                placeholder="example@gmail.com"
                variant="outlined"
                fullWidth
                inputlabelprops={{ shrink: true }}
              />

              {/* Password */}
              <PasswordInput
                id="password"
              />

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
                sx={{
                  py: 1.9,
                  borderRadius: 2.5,
                  background: "linear-gradient(145deg, #1a146b 0%, #312e81 100%)",
                  color: "white",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontSize: 12,
                  boxShadow: "0 8px 24px rgba(26,20,107,0.22)",
                  "&:hover": {
                    opacity: 0.9,
                    transform: "scale(1.01)",
                    background: "linear-gradient(145deg, #1a146b 0%, #312e81 100%)",
                    boxShadow: "0 12px 32px rgba(26,20,107,0.3)",
                  },
                  "&:active": { transform: "scale(0.98)" },
                  transition: "all 0.25s",
                }}
              >
                Sign In
              </Button>
            </Box>

            {/* Join link */}
            <Box className="mt-10 pt-10 text-center">
              <Typography sx={{ fontSize: 14, color: "#505f76" }}>
                New to the editorial?{" "}
                <Box
                  component={RouterLink}
                  to={"/auth/register"}
                  sx={{
                    color: "#00423c", fontWeight: 700, ml: "4px",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                    textUnderlineOffset: "4px",
                    transition: "all 0.2s",
                  }}
                >
                  Join Now
                </Box>
              </Typography>
            </Box>
          </Box>

          {/* Footer links */}
          <Box className="mt-12 mb-5 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {["Privacy Policy", "Terms of Service", "Support"].map(link => (
              <Typography
                key={link}
                component={RouterLink}
                href="#"
                sx={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: "rgba(80,95,118,0.55)",
                  textDecoration: "none",
                  "&:hover": { color: "#1a146b" },
                  transition: "color 0.2s",
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>

        </Box>
      </Box>
    </Box>
  )
};

export default LoginPage;