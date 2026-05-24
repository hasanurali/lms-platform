import React, { useState, useEffect, useRef } from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom"
import AuthShowcase from "../components/AuthShowcase";
import PasswordInput from "../components/PasswordInput";


const RegisterPage = () => {

  const [role, setRole] = useState("student");

  const formRef = useRef(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    const id = setTimeout(() => {
      el.style.transition = "all 0.9s cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box className="min-h-screen flex flex-row">

      {/* Left Panel */}
      <AuthShowcase />

      {/* Right Panel */}
      <Box className="flex-1 bg-[#f7f9fb] flex items-center justify-center p-8 md:p-12 lg:p-20 overflow-y-auto">
        <Box ref={formRef} className="w-full max-w-md">

          {/* Mobile logo */}
          <Typography className="md:hidden mb-8" sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20, fontWeight: 700, color: "#1a146b", letterSpacing: "-0.01em",
          }}>
            The Scholarly Editorial
          </Typography>

          {/* Header */}
          <Box className="mb-10">
            <Typography sx={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#00423c",
            }}>
              New Membership
            </Typography>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              mt: 1, fontSize: 34, fontWeight: 800,
              color: "#191c1e", letterSpacing: "-0.02em",
            }}>
              Begin Your Journey
            </Typography>
            <Typography sx={{ mt: 1.25, fontSize: 14, color: "#505f76", lineHeight: 1.65 }}>
              Complete your application to gain access to the editorial library
              and discussion forums.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={e => e.preventDefault()}
            className="flex flex-col gap-5"
          >

            {/* Full Name */}
            <TextField
              id="full_name"
              label="Full Name"
              placeholder="E.g. Jhon doe"
              variant="outlined"
              fullWidth

            />

            {/* Email */}
            <TextField
              id="email"
              label="Email Address"
              type="email"
              placeholder="example@gmail.com"
              variant="outlined"
              fullWidth

            />

            {/* Phone and Role */}
            <Box className="grid grid-cols-2 gap-4">
              <TextField
                id="phone"
                label="Phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                variant="outlined"
                fullWidth

              />
              <FormControl fullWidth variant="outlined">
                <InputLabel
                  id="role-label"
                  shrink
                  sx={{
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                  }}
                >
                  Account Type
                </InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  label="Account Type"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    borderRadius: 2.5,
                    backgroundColor: "#eceef0",
                    "& fieldset": { border: "2px solid transparent" },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                      "& fieldset": { borderColor: "#1a146b !important" },
                    },
                  }}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="instructor">Instructor</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Password */}
            <PasswordInput
              id="password"
            />

            {/* Confirm Password */}
            <PasswordInput
              id="confirm_password"
              label="Confirm Password"
            />

            {/* CTA */}
            <Box className="pt-2 flex flex-col gap-5">
              <Button
                type="submit"
                fullWidth
                endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
                sx={{
                  py: 2,
                  borderRadius: 2.5,
                  background: "linear-gradient(145deg, #1a146b 0%, #312e81 55%, #003d38 100%)",
                  color: "white",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontSize: 12,
                  boxShadow: "0 8px 24px rgba(26,20,107,0.25)",
                  "&:hover": {
                    opacity: 0.9,
                    transform: "translateY(-1px)",
                    background: "linear-gradient(145deg, #1a146b 0%, #312e81 55%, #003d38 100%)",
                  },
                  "&:active": { transform: "scale(0.98)" },
                  "&.Mui-disabled": { opacity: 0.45, color: "white" },
                  transition: "all 0.2s",
                }}
              >
                Join the Fellowship
              </Button>

              <Typography sx={{ textAlign: "center", fontSize: 13, color: "#505f76" }}>
                Already part of the editorial?{" "}
                <Box
                  component={RouterLink}
                  to={"/auth/login"}
                  sx={{
                    color: "#1a146b", fontWeight: 700, ml: "4px",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Log In
                </Box>
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box className="pt-10 text-center">
            <Typography sx={{
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(119,118,130,0.55)", lineHeight: 2,
            }}>
              By joining, you agree to our{" "}
              <Box component={RouterLink} href="#" sx={{ color: "inherit", "&:hover": { color: "#1a146b" }, transition: "color 0.2s" }}>
                Editorial Guidelines
              </Box>
              {" & "}
              <Box component={RouterLink} href="#" sx={{ color: "inherit", "&:hover": { color: "#1a146b" }, transition: "color 0.2s" }}>
                Privacy Charter
              </Box>.
            </Typography>
          </Box>

        </Box>
      </Box>

    </Box>
  );
};

export default RegisterPage;