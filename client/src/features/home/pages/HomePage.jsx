import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Container, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import ForumIcon from "@mui/icons-material/Forum";
import MailOutlineIcon from "@mui/icons-material/MailOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import SectionReavealWrapper from "../components/SectionReavealWrapper"
import { INSTITUTIONS, PHILOSOPHY } from "../constants/homeData"
import CourseCard from "@/features/course/components/CourseCard";
import useAuthUser from "@/features/auth/hooks/useAuthUser";
import useFetchCourses from "@/features/course/hooks/useFetchCourses";
import useStore from "@/store/store";


const HomePage = () => {

  const orbRef = useRef(null);

  const setScrolled = useStore((state) => state.setScrolled);

  const { data: user } = useAuthUser();
  const { data } = useFetchCourses(1, 3);

  // Orb animation
  useEffect(() => {
    const handleMove = (e) => {
      if (!orbRef.current) return;
      const x = (window.innerWidth / 2 - e.pageX) / 40;
      const y = (window.innerHeight / 2 - e.pageY) / 40;
      orbRef.current.style.transform = `translate(${x}px, ${y}px) rotateX(${-y}deg) rotateY(${x}deg)`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box sx={{ paddingTop: "60px", background: "#f7f9fb", color: "#191c1e", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero section*/}
      <Box component="section" sx={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pt: "80px", overflow: "hidden" }}>

        {/* Bg image */}
        <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Box component="img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmPy7eM9ieXcxKBc_qEmj7iEr9PPT4PD0KDfmQ6M44QjjOHOZiHkdkKvpU0Ghzb_4Jj3YvTj2ZYtkKEE53HUi1X-y42x6gwv3rtdNEnyXmssBN3215amNP60XnF4XHoniKzqUBS4uwbre4qBLytwnlVqkDVUBTNkdNnS9Ay5tgSvr1q75Nj9BUZrvvEg2oW--thL9903oA5hDnQPaROv5EKYyL156UEaF3IrKlJNIq54mSGq5bx30EfCgh1p25561NvEN4PWBB5g8" alt="Ball.png" sx={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.1)", filter: "blur(2px)", opacity: 0.4 }} />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #f7f9fb 0%, transparent 30%, transparent 70%, #f2f4f6 100%)" }} />
        </Box>

        {/* Orb */}
        <Box sx={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", perspective: "1000px" }}>
          <Box ref={orbRef} sx={{
            width: { xs: 220, md: 400 }, height: { xs: 220, md: 400 },
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, rgba(137,245,231,0.2), rgba(26,20,107,0.1))",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(200,197,211,0.2)",
            boxShadow: "0 32px 80px rgba(26,20,107,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            animation: "floatOrb 6s ease-in-out infinite",
            "@keyframes floatOrb": { "0%,100%": { transform: "translateY(0) rotate(0deg)" }, "50%": { transform: "translateY(-20px) rotate(5deg)" } },
          }}>
            <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", borderTop: "1px solid rgba(137,245,231,0.3)", transform: "rotate(45deg)" }} />
            <Box sx={{ position: "absolute", inset: 16, borderRadius: "50%", borderBottom: "1px solid rgba(49,46,129,0.2)", transform: "rotate(-12deg)" }} />
            <AutoAwesomeIcon sx={{ fontSize: { xs: 60, md: 100 }, color: "rgba(26,20,107,0.15)" }} />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 860, px: 3 }}>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: "2.5rem", sm: "3.5rem", md: "5rem", lg: "5.5rem" }, fontWeight: 800, color: "#1a146b", letterSpacing: "-0.03em", lineHeight: 0.95, mb: 4 }}>
            Master In Demand Skills With<br />Expert-Led{" "}
            <Box component="span" sx={{ color: "#44b5a8", fontStyle: "italic", fontWeight: 300 }}>Courses</Box>.
          </Typography>
          <Typography sx={{ fontSize: { xs: 15, md: 18 }, color: "#474651", maxWidth: 600, mx: "auto", mb: 6, lineHeight: 1.75 }}>
            Learn full-stack development, AI, system design, and more through structured courses, projects and mentorship.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, justifyContent: "center" }}>
            <Button component={RouterLink} to={user ? "/courses" : "/auth/register"} sx={{ px: 5, py: 2, background: "linear-gradient(135deg, #1a146b 0%, #312e81 100%)", color: "white", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, boxShadow: "0 16px 40px rgba(26,20,107,0.3)", "&:hover": { background: "linear-gradient(135deg, #1a146b 0%, #312e81 100%)", opacity: 0.9, transform: "translateY(-2px)" }, "&:active": { transform: "scale(0.97)" }, transition: "all 0.3s" }}>
              Start Learning
            </Button>
            <Button component={RouterLink} to={"/courses"} sx={{ px: 5, py: 2, background: "#e6e8ea", color: "#505f76", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, "&:hover": { background: "#e0e3e5" }, transition: "background 0.2s" }}>
              Browse Courses
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Trust bar */}
      <Box component="section" sx={{ py: 8, borderTop: "1px solid rgba(200,197,211,0.15)", borderBottom: "1px solid rgba(200,197,211,0.15)", background: "rgba(242,244,246,0.5)" }}>
        <Container maxWidth="xl">
          <SectionReavealWrapper>
            <Typography sx={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#777682", mb: 4 }}>
              Trusted By Thousands Of Learners Worldwide
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "32px 64px", opacity: 0.4, filter: "grayscale(1) contrast(1.2)" }}>
              {INSTITUTIONS.map(inst => (
                <Typography key={inst} sx={{ fontSize: { xs: 13, md: 16 }, fontWeight: 900, letterSpacing: "-0.02em", color: "#191c1e" }}>{inst}</Typography>
              ))}
            </Box>
          </SectionReavealWrapper>
        </Container>
      </Box>

      {/* Featured Fellowships */}
      <Box component="section" sx={{ py: { xs: 10, md: 16 }, background: "#f7f9fb" }}>
        <Container maxWidth="xl">
          <SectionReavealWrapper>
            <Box sx={{ textAlign: "center", mb: 10 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#44b5a8", mb: 1.5 }}>Top Rated Courses</Typography>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 28, md: 44 }, fontWeight: 800, color: "#1a146b", letterSpacing: "-0.03em" }}>Popular Courses</Typography>
            </Box>
          </SectionReavealWrapper>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: { xs: 4, md: 5 } }}>
            {data?.data?.data?.map((course, i) => (
              <SectionReavealWrapper key={course._id} delay={i * 0.1}>
                <CourseCard course={course} />
              </SectionReavealWrapper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Philosophy */}
      <Box component="section" sx={{ py: { xs: 10, md: 16 }, px: { xs: 3, md: 5 }, background: "rgba(242,244,246,0.35)", overflow: "hidden" }}>
        <Box sx={{ maxWidth: 1600, mx: "auto", display: "flex", flexDirection: { xs: "column", lg: "row" }, alignItems: "center", gap: { xs: 8, lg: 20 } }}>

          {/* Left */}
          <SectionReavealWrapper sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 560 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#44b5a8" }}>Why Learn With Us</Typography>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 30, md: 52 }, fontWeight: 800, color: "#1a146b", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Learn By Building Real Projects
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {PHILOSOPHY.map(p => (
                  <Box key={p.title} sx={{ pl: 3, borderLeft: "2px solid rgba(26,20,107,0.1)" }}>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a146b", mb: 1 }}>{p.title}</Typography>
                    <Typography sx={{ fontSize: 15, color: "#474651", lineHeight: 1.8 }}>{p.desc}</Typography>
                  </Box>
                ))}
              </Box>
              <Box
                component={RouterLink}
                to={"/courses"}
                sx={{
                  display: "flex", alignItems: "center", gap: 2, mt: 2,
                  background: "none", border: "none", cursor: "pointer",
                  color: "#1a146b", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: 11, letterSpacing: "0.14em",
                  textTransform: "uppercase", p: 0,
                  "& .line": { width: 48, height: 2, background: "#1a146b", transition: "width 0.3s" },
                  "&:hover .line": { width: 64 },
                }}
              >
                Explore All Courses
                <Box className="line" />
              </Box>
            </Box>
          </SectionReavealWrapper>

          {/* Right image */}
          <SectionReavealWrapper delay={0.15} sx={{ flex: 1, width: "100%" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: { md: 6 } }}>
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgFZJzOGsBZQt77rwG3kmx9WLGy-_2gHONZwEO2ZFxS0_hm01uoeqQb_OU0YftUUrdekEHdiv2gq9s3VJRQzxdQzVLBdEZoRg_FXOZMNu1AQsMRWS-8DH8jVEJ3YaT411eHpC_iT-b2WDeAw1hP7LlF1NkzQ3fzz48C_BKZ4rwSIiq2T7gYb9dQXtV74_Ta41d9sjBrZoKwdn0mX1y1IDD1sV5tX8Hz_4-T9hiLWuSpYNa7IC5xFyf_6A5lrYxlgw-dw8mLowqr-Y",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDyBi89Lqta4AOWV_X8Ze3OiTUigffINXKEcaeQO-TGswXPaudL9-wpz5ZdXkW6jyvpYcdZUdf8s0oFYn0kO-qxs9XbvmHQ0oZSR9SINAs8YkDTeTGmIE1SdaNAiBBIBn_CDnyMd27ByhFiYJgdSJy_9aECLfQlrfWreQ1IJNW0ne7LSwd15O9lyB492Cn7tbgmNyIWckLn_GyFt0q3aQLLgq6OpNtJw_C-v0W84OGUjx9T806RSljWtWU5QSKjlC7nTGOxzdF715o",
                ].map((src, i) => (
                  <Box key={i} sx={{ borderRadius: "16px", overflow: "hidden", height: i === 0 ? 200 : 260, boxShadow: "0 8px 32px rgba(25,28,30,0.1)", "&:hover img": { transform: "scale(1.06)" } }}>
                    <Box component="img" src={src} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
                  </Box>
                ))}
              </Box>
              <Box sx={{ borderRadius: "16px", overflow: "hidden", height: { xs: 360, md: 480 }, boxShadow: "0 8px 32px rgba(25,28,30,0.1)", "&:hover img": { transform: "scale(1.06)" } }}>
                <Box component="img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1qf_tewsl6rMVQ7yy6uAM1_N0IerQTmTaMc1v6r6CKbglL_ih9cfUgWN6OGRiXOluOlui439sXDJUJzLC8w9hKk_2H6oNpwR5yn4GHlyhPuFNSRSO0m7O7lP0nwxQvij39ULpEm_bAMAlbiYJyvl1MsG1TLsW0-K-W8TJHIuIB1QgtDge4rlopoPc8dj09KQZC0sdiwoV7hxiPiG1-mfroGFLFc3uQXzPqKvpeAJZRLKnq5bzh3mm6RSRRO9_z1CHbb9vdaot_vA" alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
              </Box>
            </Box>
          </SectionReavealWrapper>
        </Box>
      </Box>

      {/* Final cta */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 5 }, background: "#f7f9fb" }}>
        <Container maxWidth="xl">
          <SectionReavealWrapper>
            <Box sx={{
              background: "linear-gradient(135deg, #1a146b 0%, #312e81 100%)",
              borderRadius: { xs: "24px", md: "48px" },
              p: { xs: "48px 32px", md: "80px 96px" },
              textAlign: "center",
              position: "relative", overflow: "hidden",
              boxShadow: "0 40px 80px rgba(26,20,107,0.3)",
            }}>

              {/* Dot grid */}
              <Box sx={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 28, sm: 40, md: 60 }, fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, mb: 3, maxWidth: 800, mx: "auto" }}>
                  Ready To Start Your Learning Journey?
                </Typography>
                <Typography sx={{ fontSize: { xs: 15, md: 18 }, color: "rgba(226,223,255,0.75)", mb: 6, maxWidth: 560, mx: "auto", fontWeight: 300, lineHeight: 1.75 }}>
                  Join thousands of students learning modern technologies through hands-on projects and expert guidance.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", gap: 3 }}>
                  {!user && <Button component={RouterLink} to={"/auth/register"} sx={{ px: 5, py: 2, background: "#ffffff", color: "#1a146b", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", "&:hover": { background: "#89f5e7" }, transition: "background 0.2s" }}>
                    Get Started
                  </Button>}
                  <Button component={RouterLink} to={"/courses"} sx={{ px: 5, py: 2, border: "2px solid rgba(255,255,255,0.3)", color: "white", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, "&:hover": { background: "rgba(255,255,255,0.1)" }, transition: "background 0.2s" }}>
                    Explore Courses
                  </Button>
                </Box>
              </Box>
            </Box>
          </SectionReavealWrapper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;