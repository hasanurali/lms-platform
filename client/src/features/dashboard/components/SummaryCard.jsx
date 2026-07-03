import { Box, Typography } from "@mui/material";

const SummaryCard = ({ label, count, color, bgcolor, borderColor }) => {
    return (
        <Box sx={{
            bgcolor, border: `1px solid ${borderColor}`,
            borderRadius: "12px", p: 2, textAlign: "center",
        }}>
            <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700, color, display: "block" }}>
                {count}
            </Typography>
            <Typography sx={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>
                {label}
            </Typography>
        </Box>
    );
}

export default SummaryCard;