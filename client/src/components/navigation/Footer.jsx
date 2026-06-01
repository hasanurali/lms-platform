import { Box, Typography } from '@mui/material';
import React from 'react'

const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Institutional Access", "Contact", "Careers"];

const Footer = () => {

    return (
        <Box
            component="footer"
            sx={{ py: 6, px: { xs: 3, md: 5 }, background: "#e6e8ea", borderTop: "1px solid #d8dadc" }}
        >
            <Box sx={{
                maxWidth: 1600, mx: "auto",
                display: "flex", flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between", alignItems: "center",
                gap: 3,
            }}>
                <Typography sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18, fontWeight: 700, color: "#1a146b",
                    letterSpacing: "-0.01em",
                }}>
                    The Scholarly Editorial
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: { xs: 2, md: 4 } }}>
                    {FOOTER_LINKS.map(link => (
                        <Typography
                            key={link}
                            component="a" href="#"
                            sx={{
                                fontSize: 13, color: "#474651",
                                textDecoration: "none", transition: "color 0.2s",
                                "&:hover": { color: "#1a146b" },
                            }}
                        >
                            {link}
                        </Typography>
                    ))}
                </Box>

                <Typography sx={{ fontSize: 12, color: "#777682", textAlign: { xs: "center", md: "right" } }}>
                    © 2024 The Scholarly Editorial.<br />Curated for the modern polymath.
                </Typography>
            </Box>
        </Box>
    )
}

export default Footer