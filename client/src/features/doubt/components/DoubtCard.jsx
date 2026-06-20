import React from 'react'
import { Box, Typography } from '@mui/material';
import StatusChip from './StatusChip';
import timeConverter from "@/utils/timeConverter";

const DoubtCard = ({ doubt, selected, onClick }) => {

        return (
            <Box
                onClick={onClick}
                sx={{
                    p: "14px 16px", borderRadius: "10px", cursor: "pointer",
                    background: selected ? "rgba(26,20,107,0.05)" : "#fff",
                    border: "1px solid", borderColor: selected ? "#1a146b" : "#eceef0",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "#1a146b", background: "rgba(26,20,107,0.03)" },
                }}
            >
                <Box sx={{ mb: 0.75 }}><StatusChip status={doubt.status} /></Box>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#191c1e", mb: 0.4, lineHeight: 1.3 }}>
                    {doubt.title}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#a0a0a8" }}>{timeConverter(doubt?.lastReplyAt)}</Typography>
            </Box>
        )
    };

    export default DoubtCard;