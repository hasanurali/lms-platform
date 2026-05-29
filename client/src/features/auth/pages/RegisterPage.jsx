import React, { useState, useEffect, useRef } from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Box, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom"
import AuthShowcase from "../components/AuthShowcase";
import PasswordInput from "../components/PasswordInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import registerSchema from "../schemas/registerSchema";
import { useRegister } from "../hooks/useRegister";
import handleFieldApiErrors from "@/utils/handleFieldApiErrors";


const RegisterPage = () => {

  const formRef = useRef(null);

  // Setup react hook form
  const { control, handleSubmit, formState: { errors, isDirty }, setError } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "student",
      password: "",
      confirmPassword: "",
    }
  });


  const { mutate, isPending } = useRegister();
  const onSubmit = (data) => {

    // Destructure needed field
    const { confirmPassword, ...rest } = data;

    // Call the mutate function with required data
    mutate(rest, {
      onError: (error) => {
        handleFieldApiErrors(error, setError)
      },
    });
  };

  // Give transition effect on page load
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >

            {/* Full Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="name"
                  label="Full Name"
                  placeholder="E.g. John Doe"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      position: "absolute",
                      bottom: -18
                    },
                  }}
                  inputlabelprops={{ inputLabel: { shrink: true } }}
                />
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="example@gmail.com"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      position: "absolute",
                      bottom: -18
                    },
                  }}
                  inputlabelprops={{ inputLabel: { shrink: true } }}
                />
              )}
            />

            {/* Role */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined" error={!!errors.role}>
                  <InputLabel
                    id="role-label"
                    shrink
                    sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}
                  >
                    Account Type
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="role-label"
                    label="Account Type"
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
                  {errors.role && (
                    <Typography sx={{ fontSize: 11, color: "#ba1a1a", mt: 0.5, ml: 1.5 }}>
                      {errors.role.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="password"
                  {...field}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      position: "absolute",
                      bottom: -18
                    },
                  }}
                />
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="confirm-password"
                  label="Confirm Password"
                  {...field}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      position: "absolute",
                      bottom: -18
                    },
                  }}
                />
              )}
            />

            {/* CTA */}
            <Box className="pt-2 flex flex-col gap-5">
              <Button
                type="submit"
                fullWidth
                disabled={!isDirty || isPending}
                endIcon={isPending ? null : <ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
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
                {isPending ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CircularProgress size={16} sx={{ color: "white" }} />
                    <span>Creating Account...</span>
                  </Box>
                ) : "Join the Fellowship"}
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