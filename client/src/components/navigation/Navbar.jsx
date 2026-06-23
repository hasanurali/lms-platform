import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Container, IconButton } from "@mui/material";
import { Link as RouterLink, NavLink, useLocation } from "react-router-dom";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import ForumIcon from "@mui/icons-material/Forum";
import MailOutlineIcon from "@mui/icons-material/MailOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

import useAuthUser from "@/features/auth/hooks/useAuthUser";
import useLogout from "@/features/auth/hooks/useLogout";
import useStore from "@/store/store";


const NAV_LINKS = [{ page: "Home", link: "/" }, { page: "Courses", link: "/courses" }];
const MOBILE_NAV_LINKS = [{ page: "Home", link: "/" }, { page: "Courses", link: "/courses" }, { page: "Profile", link: "#" }];

const Navbar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const scrolled = useStore((state) => state.scrolled);

    const { data: user } = useAuthUser();
    const { mutate: logout, isPending } = useLogout();

    const location = useLocation();
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <Box component="header" sx={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            background: scrolled ? "rgba(247,249,251,0.97)" : "rgba(247,249,251,0.82)",
            backdropFilter: "blur(20px)",
            boxShadow: scrolled ? "0 2px 20px rgba(25,28,30,0.08)" : "0 1px 0 rgba(200,197,211,0.2)",
            transition: "all 0.3s",
            py: scrolled ? 1 : 2,
        }}>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: { xs: 3, md: 5 }, maxWidth: 1600, mx: "auto" }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 17, md: 20 }, fontWeight: 700, color: "#1a146b", letterSpacing: "-0.02em" }}>
                    The Scholarly Editorial
                </Typography>
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 5 }}>
                    {NAV_LINKS.map((link) => (
                        <Typography key={link.link} component={NavLink} to={link.link} sx={{
                            fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#474651", textDecoration: "none", transition: "color 0.2s", "&:hover": { color: "#1a146b" },
                            '&.active': {
                                color: 'primary.main',
                                fontWeight: 'bold',
                            }
                        }} >
                            {link.page}
                        </Typography>
                    ))}
                </Box>
                {user ?
                    <Box
                        sx={{
                            width: "35px",
                            height: "35px",
                            display: { xs: "none", md: "flex" },
                            position: "relative"
                        }}>
                        <Box
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            component="img"
                            src={user?.profilePicture}
                            alt="profile.png"
                            sx={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                        <IconButton sx={{ color: "#1a146b" }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>

                        {isMenuOpen && <Box sx={{ width: "130px", height: "88px", backgroundColor: "white", position: "absolute", top: "45px", right: "3px", paddingY: "3px", borderRadius: "5px", color: "#1a146b", boxShadow: 1 }}>
                            <Box className="flex items-center hover:bg-[#f5f5f5] cursor-pointer">
                                <IconButton sx={{ padding: "none" }}>
                                    <AccountCircleIcon sx={{ fontSize: 25 }} />
                                </IconButton>
                                <Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.5px" }}>Profile</Typography>
                            </Box>

                            <Box onClick={!isPending ? logout : undefined}
                                className="flex items-center hover:bg-[#f5f5f5] cursor-pointer"
                                sx={{
                                    pointerEvents: isPending ? "none" : "auto",
                                    opacity: isPending ? 0.5 : 1
                                }}>
                                <IconButton sx={{ color: "red", padding: "none" }}>
                                    <LogoutIcon sx={{ fontSize: 25 }} />
                                </IconButton>
                                <Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.5px" }}>Logout</Typography>
                            </Box>
                        </Box>}

                    </Box>
                    :
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
                        <Typography component={RouterLink} to={"/auth/login"} sx={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#474651", textDecoration: "none", "&:hover": { opacity: 0.7 } }}>
                            Sign In
                        </Typography>
                        <Button component={RouterLink} to={"/auth/register"} sx={{ px: 3, py: 1.25, background: "#1a146b", color: "white", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 11, boxShadow: "0 4px 16px rgba(26,20,107,0.2)", "&:hover": { background: "#1a146b", opacity: 0.88 } }}>
                            Start Your Journey
                        </Button>
                    </Box>
                }
                <IconButton sx={{ display: { md: "none" }, color: "#1a146b" }} onClick={() => setMobileOpen(o => !o)}>
                    {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

            {
                mobileOpen && (
                    <Box sx={{ display: { md: "none" }, background: "#fff", borderTop: "1px solid #eceef0", px: 3, py: 2, flexDirection: "column", gap: 2 }}>
                        {MOBILE_NAV_LINKS.map(link => (
                            <Typography key={link.link} component={NavLink} to={link.link} sx={{
                                display: "block", fontSize: 14, fontWeight: 600, color: "#191c1e", textDecoration: "none", py: 0.5,
                                '&.active': {
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                }
                            }}>
                                {link.page}
                            </Typography>
                        ))}
                    </Box>
                )
            }

        </Box >

    )
}

export default Navbar