import { useState } from 'react'
import { Box, Chip, Paper, Typography, Pagination } from "@mui/material";
import { CheckCircleOutlineOutlined, MenuBook, RadioButtonUnchecked, RemoveCircleOutlineOutlined, } from "@mui/icons-material";

import InstructorDoubtsCourseItem from "./InstructorDoubtsCourseItem"
import SelectCourseState from "./SelectCourseState"
import EmptyDoubts from './EmptyDoubts'
import DoubtCard from "@/features/doubt/components/DoubtCard"
import useInfiniteMyCourses from "@/features/course/hooks/useInfiniteMyCourses"
import useFetchCourseDoubts from '@/features/doubt/hooks/useFetchCourseDoubts';
import { COURSES_DOUBTS_PER_PAGE } from "../constants/dashboardConstants"


export const STATUS = {
  open: { label: "Open", bg: "#fef3c7", color: "#92400e", icon: <RadioButtonUnchecked sx={{ fontSize: 12 }} /> },
  answered: { label: "Answered", bg: "#d1fae5", color: "#065f46", icon: <CheckCircleOutlineOutlined sx={{ fontSize: 12 }} /> },
  closed: { label: "Closed", bg: "#e2e8f0", color: "#475569", icon: <RemoveCircleOutlineOutlined sx={{ fontSize: 12 }} /> },
};


const InstructorDoubtsTab = () => {

  const [page, setPage] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDoubtId, setSelectedDoubtId] = useState(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMyCourses();
  const courses = data?.pages.flatMap((page) => page.data.data) || [];

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollHeight - scrollTop <= clientHeight + 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };


  // Fetch doubt by selected course id
  const { data: doubtsData } = useFetchCourseDoubts(selectedCourse?._id, page);

  const doubts = doubtsData?.data?.data ?? [];
  const pagination = doubtsData?.data?.pagination;
  const stats = doubtsData?.data?.stats;


  if (selectedDoubtId) {
    return <div>Doubt form</div>
  }


  return (
    <Box sx={{ maxWidth: "100%" }}>

      {/* Header */}
      <Typography sx={{
        fontSize: { xs: 16, sm: 18 }, fontWeight: 700,
        color: "#1a146b", letterSpacing: "-0.02em", mb: 3,
      }}>
        Student Doubts
      </Typography>

      {/* Main layout */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "270px 1fr" },
        gap: 3,
        alignItems: "start",
      }}>

        {/* Left course list */}
        <Paper elevation={0} sx={{
          bgcolor: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          position: { md: "sticky" },
          top: { md: 88 },
        }}>
          <Box sx={{
            px: 2.5, pt: 2, pb: 1.5,
            borderBottom: "1px solid #f1f5f9",
          }}>
            <Typography sx={{
              fontSize: 10, fontWeight: 700, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: "0.12em",
            }}>
              Your Courses
            </Typography>
          </Box>

          <Box
            onScroll={handleScroll}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              maxHeight: { xs: "300px", md: "calc(100vh - 205px)" },
              overflowY: "auto",
              p: 1.5,
              "::-webkit-scrollbar": { width: "4px" },
              "::-webkit-scrollbar-thumb": { background: "#e2e8f0", borderRadius: "4px" },
              "::-webkit-scrollbar-track": { background: "transparent" },
            }}
          >
            {courses?.length > 0 ? (
              courses.map(course => (
                <InstructorDoubtsCourseItem
                  key={course._id}
                  course={course}
                  selected={selectedCourse?._id === course._id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedDoubtId(null);
                  }}
                />
              ))
            ) : (
              <Box sx={{
                py: 8, display: "flex",
                flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 1.5,
              }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: "50%",
                  bgcolor: "#f8fafc", border: "2px dashed #e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MenuBook sx={{ fontSize: 20, color: "#cbd5e1" }} />
                </Box>
                <Typography sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                  No courses yet
                </Typography>
              </Box>
            )}

            {isFetchingNextPage && (
              <Box sx={{ py: 2, textAlign: "center" }}>
                <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                  Loading more…
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Right doubts panel */}
        <Box>
          {!selectedCourse ? (
            <Paper elevation={0} sx={{
              bgcolor: "white", borderRadius: "16px",
              border: "1px solid #f1f5f9",
              minHeight: 380,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <SelectCourseState />
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

              {/* Panel header */}
              <Box sx={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                gap: 2, flexWrap: "wrap",
              }}>
                <Box>
                  <Typography sx={{
                    fontSize: { xs: 14, sm: 15 },
                    fontWeight: 700, color: "#1a146b", lineHeight: 1.3,
                  }}>
                    {selectedCourse?.title}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.3 }}>
                    {pagination?.total ?? 0} doubt{doubts.length !== 1 ? "s" : ""}
                    {" · "}
                    <Box component="span" sx={{
                      color: "#94a3b8",
                      fontWeight: 400,
                    }}>
                      {stats?.open ?? 0} open
                    </Box>
                  </Typography>
                </Box>

                {doubts.length > 0 && (
                  <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                    {["open", "answered", "closed"].map(status => {
                      const count = stats?.[status];
                      if (!count) return null;
                      const s = STATUS[status];
                      return (
                        <Chip
                          key={status}
                          label={`${s.label} ${count}`}
                          size="small"
                          sx={{
                            height: 22, fontSize: 10,
                            fontWeight: 700, letterSpacing: "0.04em",
                            bgcolor: s.bg, color: s.color,
                            border: "none",
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              </Box>

              {/* Cards */}
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}>
                {doubts.length === 0 ? (
                  <Paper elevation={0} sx={{
                    bgcolor: "white", borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                    <EmptyDoubts courseName={selectedCourse?.title} />
                  </Paper>
                ) : (
                  <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 1.5,
                  }}>
                    {doubts.map(doubt => (
                      <DoubtCard
                        key={doubt._id}
                        doubt={doubt}
                        selected={false}
                        onClick={() => setSelectedDoubtId(doubt._id)}
                        isDashboardDoubt={true}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Pagination */}
              {pagination?.pages > 1 && (
                <Box sx={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                  pt: 2, mt: 2,
                  borderTop: "1px solid #f1f5f9",
                }}>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                    Showing{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "#475569" }}>
                      {(page - 1) * COURSES_DOUBTS_PER_PAGE + 1}–{Math.min(page * COURSES_DOUBTS_PER_PAGE, pagination?.total)}
                    </Box>
                    {" "}of{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "#475569" }}>
                      {pagination?.total}
                    </Box>
                  </Typography>
                  <Pagination
                    count={pagination?.pages}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    size="small"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#475569",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      },
                      "& .MuiPaginationItem-root.Mui-selected": {
                        bgcolor: "#1a146b",
                        color: "white",
                        borderColor: "#1a146b",
                        "&:hover": { bgcolor: "#312e81" },
                      },
                    }}
                  />
                </Box>
              )}

            </Box>
          )}
        </Box>
      </Box>
    </Box>

  );
};

export default InstructorDoubtsTab;
