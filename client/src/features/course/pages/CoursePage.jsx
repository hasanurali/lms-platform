import React, { useState } from "react";
import { Box, Typography, Button, IconButton, TextField, Checkbox, FormControlLabel, Slider, Radio, RadioGroup, Select, MenuItem, Container, InputAdornment, Stack, Pagination } from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import CourseCard from "../components/CourseCard";
import useFetchCourses from "../hooks/useFetchCourses"


const CoursePage = () => {

    const [page, setPage] = useState(1);

    const handleChange = (e, value) => {
        setPage(value);
    };

    const { data, isPending } = useFetchCourses(page)

    if (isPending) {
        return <div className="h-screen pt-20">Loding...</div>
    }

    return (
        <Box sx={{ background: "#f7f9fb", minHeight: "100vh", color: "#191c1e", fontFamily: "'DM Sans', sans-serif" }}>

            {/* Page body */}
            <Box sx={{ pt: "64px", pb: 10, px: { xs: 2, md: 5 }, maxWidth: 1400, mx: "auto" }}>

                {/* Page header */}
                <Box sx={{ pt: { xs: 5, md: 7 }, mb: 6 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#005049", mb: 1, display: "block" }}>
                        Course Catalog
                    </Typography>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 30, md: 44 }, fontWeight: 800, color: "#1a146b", letterSpacing: "-0.03em", mb: 1.5 }}>
                        Master Modern Development Skills
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: "#505f76", maxWidth: 560, lineHeight: 1.75 }}>
                        Learn MERN Stack, Backend Engineering, System Design, AI Integration and more through structured learning paths and practical projects.                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: { xs: 0, lg: 6 }, alignItems: "flex-start" }}>

                    {/* Pagination */}
                    <Stack spacing={2}>

                        {/* Grid */}
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }, gap: 5 }}>
                            {data?.data?.data?.map(course => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </Box>


                        <Pagination
                            count={data?.data?.pagination?.pages}
                            page={page}
                            onChange={handleChange}
                            variant="outlined"
                            color="primary"
                            sx={{
                                justifyItems: "center",
                                paddingTop: "30px"
                            }} />

                    </Stack>

                </Box>
            </Box>
        </Box>
    );
};

export default CoursePage;