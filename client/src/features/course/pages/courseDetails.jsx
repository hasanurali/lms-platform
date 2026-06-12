import React, { useState } from "react";
import { Box, Typography, Button, IconButton, LinearProgress, Container, Stack, Pagination } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import ModuleAccordion from "../components/ModuleAccordion";
import { TABS, FEATURE_CARDS, INCLUSIONS } from "../constants/courseData"
import RenderStars from "../components/RenderStars";
import useFetchFullCourse from "../hooks/useFetchFullCourse"
import useAuthUser from "@/features/auth/hooks/useAuthUser"
import useEnrollCourse from "@/features/enrollment/hooks/useEnrollCourse";
import useFetchEnrolledCourses from "@/features/enrollment/hooks/useFetchEnrolledCourses";
import ReviewCard from "@/features/review/components/ReviewCard";
import useFetchReviews from "@/features/review/hooks/useFetchReviews";


const CourseDetailsPage = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1)

  const navigate = useNavigate();

  // Get course id from params  
  const { id } = useParams()

  // Fetch user
  const { data: user } = useAuthUser()

  // Fetch reviews
  const { data: reviews } = useFetchReviews(id);

  // Handle fetching full course details
  const { data: courseData, isPending: courseDataPending, error: courseDataErr } = useFetchFullCourse(id);
  if (courseDataErr?.response?.status) {
    navigate("/courses")
  };

  // Check enrollment
  let isEnrolled;
  const { data: enrolledCourseData } = useFetchEnrolledCourses();
  isEnrolled = !!enrolledCourseData?.data?.find(({ course }) => course._id === id);

  // Handle enrollment
  const { mutate } = useEnrollCourse(id);
  const handleEnrollment = () => {

    if (!user) {
      navigate("/auth/register")
    };

    if (isEnrolled) return;

    mutate(id, {

      onSuccess: (data) => {
        if (data?.success) {
          isEnrolled = true;
          toast.success(data?.message);
        }
      }

    });
  };

  // Destructure all values
  if (!courseData) return null;
  const { course, modules = [], progress } = courseData?.data;
  const { title, description, instructor, price, thumbnail, averageRating = 0, totalReviews = 0 } = course;

  // Calculate price and total lessons
  const isFree = price === 0;
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0);

  // Handle review pagination
  const handleChange = (e, value) => {
    setPage(value)
  };

  if (courseDataPending) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ background: "#f7f9fb", color: "#191c1e", fontFamily: "'DM Sans', sans-serif" }}>

      <Box sx={{ pt: "64px" }}>

        {/* Hero */}
        <Box sx={{
          background: "linear-gradient(135deg, #1a146b 0%, #312e81 100%)",
          color: "white", py: { xs: 8, md: 12 }, px: { xs: 3, md: 5 },
          position: "relative", overflow: "hidden",
        }}>
          <Box sx={{ position: "absolute", bottom: -96, right: -96, width: 384, height: 384, background: "rgba(137,245,231,0.08)", borderRadius: "50%", filter: "blur(60px)" }} />

          <Box sx={{ maxWidth: 1200, mx: "auto", display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: { xs: 6, lg: 12 }, alignItems: "center", position: "relative", zIndex: 1 }}>
            {/* Left */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "inline-flex", width: "fit-content", px: 1.5, py: 0.5, background: "#89f5e7", borderRadius: "4px" }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#005049" }}>
                  Advanced Curation
                </Typography>
              </Box>

              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 32, md: 48, lg: 56 }, fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.0 }}>
                {title}
              </Typography>

              <Typography sx={{ fontSize: { xs: 14, md: 16 }, color: "rgba(226,223,255,0.8)", lineHeight: 1.75, maxWidth: 520 }}>
                {description}
              </Typography>

              {/* Rating row */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <RenderStars rating={averageRating} size={16} color="#89f5e7" gap={0.25} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#89f5e7" }}>{averageRating > 0 ? averageRating.toFixed(1) : "New"}</Typography>
                {totalReviews > 0 && <Typography sx={{ fontSize: 12, color: "rgba(226,223,255,0.6)" }}>({totalReviews.toLocaleString()} reviews)</Typography>}
                <Typography sx={{ fontSize: 12, color: "rgba(226,223,255,0.6)" }}>• {modules.length} Modules • {totalLessons} Lessons</Typography>
              </Box>

              {/* Instructor pill */}
              {instructor && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box component="img" src={instructor.profilePicture} alt={instructor.name} sx={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }} />
                  <Typography sx={{ fontSize: 13, color: "rgba(226,223,255,0.85)", fontWeight: 500 }}>{instructor.name}</Typography>
                </Box>
              )}

              {/* CTA */}
              <Box sx={{ pt: 1 }}>
                <Button onClick={handleEnrollment} sx={{ px: 4, py: 1.75, background: "white", color: "#1a146b", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", "&:hover": { background: "#89f5e7" }, transition: "background 0.2s" }}>
                  {isEnrolled ? "Continue Learning" : isFree ? "Enroll Free" : `Enroll Now — $${price}`}
                </Button>
              </Box>
            </Box>

            {/* Right video thumbnail */}
            <Box sx={{
              aspectRatio: "16/9", borderRadius: "14px", overflow: "hidden",
              position: "relative", cursor: "pointer", boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              "&:hover img": { transform: "scale(1.05)" },
              "&:hover .play-overlay": { background: "rgba(26,20,107,0.1)" },
            }}>
              <Box component="img" src={thumbnail} alt={title} sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s" }} />
              <Box className="play-overlay" sx={{ position: "absolute", inset: 0, background: "rgba(26,20,107,0.2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}>
                <Box sx={{ width: 72, height: 72, background: "rgba(255,255,255,0.92)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
                  <PlayArrowIcon sx={{ fontSize: 36, color: "#1a146b", ml: "3px" }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Progress bar (enrolled only) */}
        {isEnrolled && (
          <Box sx={{ background: "#fff", borderBottom: "1px solid #eceef0", py: 2, px: { xs: 3, md: 5 } }}>
            <Box sx={{ maxWidth: 1200, mx: "auto", display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress variant="determinate" value={progress.percentage} sx={{ height: 6, borderRadius: 4, background: "#eceef0", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #1a146b, #44b5a8)", borderRadius: 4 } }} />
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1a146b", whiteSpace: "nowrap" }}>
                {progress.percentage}% Complete
              </Typography>
            </Box>
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ position: "sticky", top: 64, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", zIndex: 40, borderBottom: "1px solid #eceef0" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 5 }, display: "flex", gap: { xs: 3, md: 6 }, overflowX: "auto" }}>
            {TABS.map((tab, i) => (
              <Box key={tab} component="button" onClick={() => setActiveTab(i)} sx={{
                py: "20px", border: "none", background: "none", cursor: "pointer",
                borderBottom: "2px solid",
                borderBottomColor: activeTab === i ? "#1a146b" : "transparent",
                color: activeTab === i ? "#1a146b" : "#505f76",
                fontFamily: "'DM Sans', sans-serif", fontWeight: activeTab === i ? 700 : 500,
                fontSize: 13, letterSpacing: "0.02em", whiteSpace: "nowrap",
                transition: "all 0.2s",
                "&:hover": { color: "#1a146b" },
              }}>
                {tab}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Content tab*/}
        {
          activeTab === 0 && <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 5 }, py: { xs: 6, md: 10 }, display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: { xs: 8, lg: 10 } }}>

            {/* Main column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>

              {/* About */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#44b5a8", mb: 1 }}>The Syllabus</Typography>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 26, md: 34 }, fontWeight: 800, color: "#1a146b", letterSpacing: "-0.02em" }}>
                    Redefining Editorial Mastery
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 15, color: "#474651", lineHeight: 1.8 }}>{description}</Typography>

                {/* Feature cards */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, pt: 2 }}>
                  {FEATURE_CARDS.map(({ Icon, title: t, desc }) => (
                    <Box key={t} sx={{ background: "#ffffff", p: 4, borderRadius: "14px", boxShadow: "0 2px 8px rgba(25,28,30,0.06)", display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Icon sx={{ fontSize: 28, color: "#1a146b" }} />
                      <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#191c1e" }}>{t}</Typography>
                      <Typography sx={{ fontSize: 13, color: "#505f76", lineHeight: 1.65 }}>{desc}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Curriculum */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#44b5a8", mb: 1 }}>The Roadmap</Typography>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 26, md: 34 }, fontWeight: 800, color: "#1a146b", letterSpacing: "-0.02em" }}>
                      Curriculum Breakdown
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#505f76" }}>
                    {modules?.length} Modules • {totalLessons} Lessons
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {modules?.map((module, i) => (
                    <ModuleAccordion key={module._id} module={module} index={i} isEnrolled={isEnrolled} />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Sidebar */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

              {/* Instructor card */}
              {instructor && (
                <Box sx={{
                  background: "linear-gradient(145deg, #1a146b 0%, #312e81 100%)",
                  color: "white", p: 4, borderRadius: "16px",
                  position: "relative", overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(26,20,107,0.25)",
                }}>
                  <Box sx={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, background: "rgba(137,245,231,0.06)", borderRadius: "50%", filter: "blur(32px)" }} />
                  <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <Box component="img" src={instructor.profilePicture} alt={instructor.name} sx={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.2)" }} />
                    <Box>
                      <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "white" }}>{instructor.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: "rgba(226,223,255,0.65)" }}>{instructor.email}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, color: "rgba(226,223,255,0.8)", lineHeight: 1.7 }}>
                      Learn directly from a field expert with years of real-world experience.
                    </Typography>
                    <Button sx={{ py: 1.25, background: "rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", "&:hover": { background: "rgba(255,255,255,0.18)" }, transition: "background 0.2s" }}>
                      View Full Profile
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Inclusions */}
              <Box sx={{ background: "#f2f4f6", p: 4, borderRadius: "16px" }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#1a146b", mb: 3 }}>Inclusions</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {INCLUSIONS.map(item => (
                    <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                      <DoneAllIcon sx={{ fontSize: 18, color: "#44b5a8", mt: "1px", flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 13, color: "#474651", lineHeight: 1.5 }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Rating breakdown */}
              <Box sx={{ background: "#ffffff", p: 4, borderRadius: "16px", boxShadow: "0 2px 8px rgba(25,28,30,0.06)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: "#1a146b", lineHeight: 1 }}>
                    {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                  </Typography>
                  <Box>
                    <RenderStars rating={averageRating} size={16} gap={0.25} />
                    <Typography sx={{ fontSize: 11, color: "#777682", mt: 0.5 }}>{totalReviews.toLocaleString()} reviews</Typography>
                  </Box>
                </Box>

                {/* Bar chart */}
                {Object.entries(course.ratingDistribution ?? {}).reverse().map(([star, count]) => {
                  const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                  return (
                    <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                      <Typography sx={{ fontSize: 11, color: "#777682", width: 10, textAlign: "right" }}>{star}</Typography>
                      <StarIcon sx={{ fontSize: 12, color: "#44b5a8" }} />
                      <Box sx={{ flex: 1, height: 6, borderRadius: 4, background: "#eceef0", overflow: "hidden" }}>
                        <Box sx={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #1a146b, #44b5a8)", borderRadius: 4 }} />
                      </Box>
                      <Typography sx={{ fontSize: 11, color: "#777682", width: 28, textAlign: "right" }}>{pct}%</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        }

        {/* Doubt tab */}
        {activeTab === 1 && (
          <Box>doubt</Box>
        )}

        {/* Review tab with pagination */}
        {activeTab === 2 && (
          !reviews?.data?.data?.length ?
            <Box sx={{
              height: 300,
              display: "flex", justifyContent: "center", alignItems: "center"
            }}>
              <Typography color="primary">No reviews yet.</Typography>
            </Box>
            :
            <Stack spacing={2}>

              <Box sx={{
                maxWidth: "100%",
                mx: "auto",
                px: { xs: 2, md: 5 }, py: { xs: 6, md: 10 },
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}>
                {reviews?.data?.data?.map(review => <ReviewCard key={review._id} review={review} />)}
              </Box>

              <Pagination
                count={reviews?.data?.pagination?.pages}
                page={page}
                onChange={handleChange}
                variant="outlined"
                color="primary"
                sx={{
                  justifyItems: "center",
                  paddingTop: "20px",
                  paddingBottom: "20px"
                }} />

            </Stack>
        )}

      </Box>
    </Box >
  );
}

export default CourseDetailsPage;