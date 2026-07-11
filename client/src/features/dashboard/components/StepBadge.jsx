import { Box, Typography } from "@mui/material";

import { CheckCircle } from "@mui/icons-material";

const StepBadge = ({ number, done }) => {
    return (
        <Box sx={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            bgcolor: done ? "#059669" : "#1a146b",
        }}>
            {done
                ? <CheckCircle sx={{ fontSize: 18, color: "white" }} />
                : <Typography sx={{ fontSize: 12, fontWeight: 700, color: "white" }}>{number}</Typography>
            }
        </Box>
    );
}

export default StepBadge;