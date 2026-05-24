import React from 'react'
import { Box, Typography } from '@mui/material'
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ForumIcon from "@mui/icons-material/Forum";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

// Features
const FEATURES = [
    { Icon: LibraryBooksIcon, label: "Editorial Library Access" },
    { Icon: ForumIcon, label: "Scholarly Discussion Forums" },
    { Icon: WorkspacePremiumIcon, label: "Fellow Certification" },
];

const AuthShowcase = () => {
    return (
        <Box
            className="hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between relative overflow-hidden"
            sx={{
                p: "60px 56px",
                background: "linear-gradient(145deg, #1a146b 0%, #312e81 55%, #003d38 100%)",
            }}
        >

            {/* Decorative orbs */}
            <Box sx={{
                position: "absolute", top: -80, right: -80, width: 300, height: 300,
                background: "rgba(107,216,203,0.12)", borderRadius: "50%",
                filter: "blur(80px)", pointerEvents: "none",
            }} />
            <Box sx={{
                position: "absolute", bottom: -60, left: -60, width: 200, height: 200,
                background: "rgba(195,192,255,0.08)", borderRadius: "50%",
                filter: "blur(60px)", pointerEvents: "none",
            }} />

            {/* Brand */}
            <Box sx={{ position: "relative", zIndex: 10 }}>
                <Typography sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 700,
                    color: "rgba(226,223,255,0.95)", letterSpacing: "-0.01em",
                }}>
                    The Scholarly Editorial
                </Typography>
                <Box sx={{ mt: 7, maxWidth: 380 }}>
                    <Typography sx={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                        textTransform: "uppercase", color: "rgba(107,216,203,0.85)",
                    }}>
                        Curated Excellence
                    </Typography>
                    <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        mt: 2, fontSize: 38, fontWeight: 800, color: "white",
                        lineHeight: 1.15, letterSpacing: "-0.02em",
                    }}>
                        Where intellectual<br />rigor meets<br />modern design.
                    </Typography>
                    <Typography sx={{
                        mt: 3, fontSize: 15, color: "rgba(226,223,255,0.7)",
                        lineHeight: 1.7, fontWeight: 300,
                    }}>
                        Join an elite collective of scholars, curators, and fellows
                        dedicated to the art of digital curation and high-level
                        educational synthesis.
                    </Typography>
                </Box>
            </Box>

            {/* Feature pills */}
            <Box sx={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: 1.5, mb: 5 }}>
                {FEATURES.map(({ Icon, label }) => (
                    <Box key={label} sx={{
                        display: "flex", alignItems: "center", gap: 1.5,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 2.5, px: 2, py: 1.25,
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                        <Icon sx={{ fontSize: 18, color: "rgba(107,216,203,0.85)" }} />
                        <Typography sx={{ fontSize: 13, color: "rgba(226,223,255,0.8)", fontWeight: 500 }}>
                            {label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Curator attribution */}
            <Box sx={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 1.75 }}>
                <Box
                    component="img"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFlCE8jF2Pt-J-_MTsSP75MJgBoACdVdxyKXi2tqOqQDt2zjj1iwy8KzcwkCXgHXqbflYMjheRtT1oWApkqciKhbFelW8EVcwt7fPh4IAMCdM32b8WHiYx5PI15KdHuByt1r1_GQbXfSMDG8YaGF-QbIcaseLwwnXabHp3K3iTgdMBSOg5jfIg815ri4KmAj6iehi9FmQ85tTM4fHA45WbLl7Nf3ayDNo0SM2vDPUuDySx4qZvcdkoVcKNyC18DlS4ORberwwq_Vs"
                    alt="Dr. Julian Vane"
                    sx={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(226,223,255,0.2)" }}
                />
                <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "white" }}>Dr. Julian Vane</Typography>
                    <Typography sx={{ fontSize: 12, color: "rgba(226,223,255,0.55)", fontWeight: 300 }}>Senior Editorial Fellow</Typography>
                </Box>
            </Box>

            {/* Background image overlay */}
            <Box sx={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.35, mixBlendMode: "overlay" }}>
                <Box
                    component="img"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-QGbLAeqNrKfihi55Iz8EN6Riu6qG_j_Z3FeSno2fxnGkGoh-GXNJJQ_Pz3H5s-amp0ZvsTKlviajeUVaF5cBbeaAuS0UHwBU3ACNH0D2Zn_4iVw0IDPP2J12astvwtWFmO7Y9rTDMj9Q8yB-otRYjcBpJLt27gHV-kjJfl1SlDQzkLNCdzFSv-PLtZVpoa7eTol7vu1Pcyv8GgjEmb9zHK3XIP5lPg4lbS7sPSUhzQq1tuWzrLy-3gJ2KMDmO92qplfG0vjPMHY"
                    alt=""
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Box>
        </Box>
    )
}

export default AuthShowcase