import { Link as RouterLink } from "react-router-dom"
import { Box, Typography } from '@mui/material';

import StatusChip from './StatusChip';
import timeConverter from "@/utils/timeConverter";


const DoubtCard = ({ doubt, selected, onClick, isLink = false, isDashboardDoubt = false }) => {

    const handleClick = () => {
        if (onClick) onClick(doubt._id);
    }

    return (
        <Box
            component={isLink && RouterLink}
            to={`/courses/${doubt.course}/lessons/${doubt.lesson}`}
            onClick={handleClick}
            sx={{
                p: "14px 16px", borderRadius: "10px", cursor: "pointer",
                background: selected ? "rgba(26,20,107,0.05)" : "#fff",
                border: "1px solid", borderColor: selected ? "#1a146b" : "#eceef0",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#1a146b", background: "rgba(26,20,107,0.03)" },
            }}
        >
            <Box sx={{ mb: 0.75 }}><StatusChip status={doubt.status} /></Box>
            <Typography sx={{
                fontWeight: 700,
                fontSize: { xs: 13, sm: 14, md: 15 },
                color: "#191c1e",
                mb: 0.4,
                lineHeight: 1.3,
            }}>
                {doubt.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.4, gap: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 11, color: "#a0a0a8", flexShrink: 0 }}>
                    {timeConverter(doubt?.lastReplyAt)}
                </Typography>
                {isDashboardDoubt && (
                    <Typography sx={{
                        fontSize: 11, color: "#64748b", fontWeight: 500,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                        {doubt.student?.name}
                    </Typography>
                )}
            </Box>
        </Box>
    )
};

export default DoubtCard;