import React from 'react'
import { Box, Typography } from '@mui/material';
import { STATUS_STYLE } from "../constants/doubtConstants"

const StatusChip = ({ status }) => {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE.open;
    return (
        <Box sx={{ display: "inline-flex", px: 1.25, py: 0.25, borderRadius: "999px", background: s.bg }}>
            <Typography sx={{ fontSize: { xs: 10, md: 11 }, fontWeight: 700, color: s.color }}>{s.label}</Typography>
        </Box>
    );
};

export default StatusChip;