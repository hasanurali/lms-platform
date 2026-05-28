import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import AuthVerifyShowcase from "../components/AuthVerifyShowcase";
import OtpInput from "../components/OtpInput"
import OtpActions from "../components/OtpActions";
import handleFieldApiErrors from "@/utils/handleFieldApiErrors";
import verifyOtpSchema from "../schemas/verifyOtpSchema"
import useVerifyOtp from "../hooks/useVerifyOtp"
import useResendOtp from "../hooks/useResendOtp";


const OTP_LENGTH = 6;
const TIMER_START = 59;


const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [canResend, setCanResend] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading

  const inputRefs = useRef([]);
  const cardRef = useRef(null);

  const email = localStorage.getItem("verify-email")
  const navigate = useNavigate()

  const { handleSubmit, setValue, setError, clearErrors, formState: { errors }, } = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" }
  });

  // Entrance animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    const id = setTimeout(() => {
      el.style.transition = "all 0.9s cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 100);
    return () => clearTimeout(id);
  }, []);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  // Sync otp array
  const updateOtp = (next) => {
    setOtp(next);
    const joined = next.join("");
    setValue("otp", joined, { shouldValidate: joined.length === OTP_LENGTH });
    if (joined.length < OTP_LENGTH) clearErrors("otp");
  };

  // Get otp value and reflect in ui
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    updateOtp(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  // If user click backspase the focus shift to backward if previous input available
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // For handling paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    updateOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // For handlibg resend otp
  const { mutate: resendOtpMutate } = useResendOtp()
  const handleResend = () => {
    if (!canResend) return;

    // Call the mutate function with required data
    resendOtpMutate({ email }, {
      onError: (error) => {

        handleFieldApiErrors(error, setError)

        // Check user has valid email to send if not user must be login so correct email automatically save.
        const message = error.response?.data?.message || "";
        const isSessionExpired = message.includes("Verification session expired");
        if (isSessionExpired) {
          navigate("/auth/login", { replace: true });
        };

      }
    });

    setTimeLeft(TIMER_START);
    setCanResend(false);
    setStatus("idle");
    const empty = Array(OTP_LENGTH).fill("");
    setOtp(empty);
    setValue("otp", "");
    clearErrors("otp");
    inputRefs.current[0]?.focus();
  };

  // For handling otp varification
  const { mutate: verifyOtpMutate } = useVerifyOtp()
  const onSubmit = (data) => {
    if (status !== "idle") return;

    setStatus("loading");

    // Call the mutate function with required data
    verifyOtpMutate({ email, ...data }, {
      onError: (error) => {

        handleFieldApiErrors(error, setError)

        setCanResend(true);
        setStatus("idle");

        // Check user has valid email to send if not user must be login so correct email automatically save.
        const message = error.response?.data?.message || "";
        const isSessionExpired = message.includes("Verification session expired");
        if (isSessionExpired) {
          navigate("/auth/login", { replace: true });
        };

      },
    });
  };

  const isComplete = otp.join("").length === OTP_LENGTH;
  const timerLabel = `(0:${timeLeft < 10 ? "0" : ""}${timeLeft})`;

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f9fb",
      p: { xs: 0, sm: 3, md: 5 },
      boxSizing: "border-box",
    }}>

      {/* Background orbs */}
      <Box sx={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <Box sx={{
          position: "absolute", top: "15%", left: "-8%",
          width: 400, height: 400,
          background: "rgba(26,20,107,0.05)", borderRadius: "50%", filter: "blur(100px)",
        }} />
        <Box sx={{
          position: "absolute", bottom: "10%", right: "-8%",
          width: 350, height: 350,
          background: "rgba(107,216,203,0.07)", borderRadius: "50%", filter: "blur(90px)",
        }} />
      </Box>

      {/* Card */}
      <Box
        ref={cardRef}
        sx={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 900,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "420px 1fr" },
          background: "#fff",
          borderRadius: { xs: 0, sm: "18px" },
          overflow: "hidden",
          minHeight: { xs: "100vh", sm: "auto" },
          boxShadow: { xs: "none", sm: "0 2px 8px rgba(25,28,30,0.04), 0 20px 60px -20px rgba(25,28,30,0.14)" },
        }}
      >

        {/* Left Panel */}
        <AuthVerifyShowcase />

        {/* Right panel */}
        <Box sx={{
          p: { xs: "32px 20px 40px", sm: "52px 44px" },
          display: "flex", flexDirection: "column",
          justifyContent: { xs: "flex-start", md: "center" },
          overflow: "hidden", minWidth: 0,
        }}>

          {/* Mobile header */}
          <Box sx={{
            display: { xs: "flex", md: "none" }, alignItems: "center",
            justifyContent: "space-between", mb: 4, gap: 2,
          }}>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700,
              color: "#1a146b", letterSpacing: "-0.01em",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              The Scholarly Editorial
            </Typography>
            <Box sx={{
              display: "flex", alignItems: "center", gap: 0.75,
              px: 1.25, py: 0.5, flexShrink: 0,
              background: "rgba(0,66,60,0.08)", borderRadius: "999px",
              border: "1px solid rgba(0,66,60,0.15)",
            }}>
              <VerifiedUserIcon sx={{ fontSize: 12, color: "#00423c" }} />
              <Typography sx={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#00423c",
              }}>
                2FA
              </Typography>
            </Box>
          </Box>

          {/* Heading */}
          <Box sx={{ mb: 3.5 }}>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 24, sm: 26 }, fontWeight: 800, color: "#191c1e",
              letterSpacing: "-0.02em", mb: 1,
            }}>
              Verify Your Identity
            </Typography>
            <Typography sx={{ fontSize: { xs: 13, sm: 13.5 }, color: "#505f76", lineHeight: 1.7 }}>
              We've sent a unique code to {" "} your email. Enter it below to continue.
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>

            {/* OTP inputs */}
            <OtpInput
              otp={otp}
              errors={errors}
              inputRefs={inputRefs}
              handlePaste={handlePaste}
              handleChange={handleChange}
              handleKeyDown={handleKeyDown}
            />

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              disabled={!isComplete || status !== "idle"}
              endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
              sx={{
                py: "13px", borderRadius: "10px",
                background: "linear-gradient(145deg, #1a146b 0%, #312e81 100%)",
                color: "white", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                fontSize: 11, mb: 2.5,
                boxShadow: isComplete && status === "idle" ? "0 6px 20px rgba(26,20,107,0.26)" : "none",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                "&:hover": {
                  background: "linear-gradient(145deg, #1a146b 0%, #312e81 100%)",
                  opacity: 0.9,
                  transform: isComplete ? "translateY(-1px)" : "none",
                },
                "&:active": { transform: "scale(0.98)" },
                "&.Mui-disabled": { background: "#eceef0", color: "#c8c5d3", boxShadow: "none" },
              }}
            >
              {status === "loading" ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CircularProgress size={14} sx={{ color: "white" }} />
                  <span>Verifying...</span>
                </Box>
              ) : "Verified"}
            </Button>

            {/* Resend and Change Email */}
            <OtpActions
              canResend={canResend}
              timerLabel={timerLabel}
              handleResend={handleResend}
            />
          </Box>

          {/* Info banner */}
          <Box sx={{
            mt: 3, p: "14px 16px", background: "#f2f4f6",
            borderRadius: "12px", display: "flex", gap: 1.5, alignItems: "flex-start",
          }}>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: "#44b5a8", mt: "2px", flexShrink: 0 }} />
            <Typography sx={{ fontSize: { xs: 12, sm: 12.5 }, color: "#505f76", lineHeight: 1.7 }}>
              Haven't received the code? Check your spam folder or wait a moment before requesting a new one.
            </Typography>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOtpPage;