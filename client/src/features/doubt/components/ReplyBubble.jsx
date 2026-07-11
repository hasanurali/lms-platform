import React from 'react'
import { Avatar, Box, Typography } from '@mui/material';
import timeConverter from "@/utils/timeConverter"

const ReplyBubble = ({ reply }) => {

    return (
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <Avatar src={reply.author?.profilePicture} sx={{
                width: 32, height: 32, fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
            </Avatar>

            <Box sx={{ flex: 1, background: "#f7f9fb", borderRadius: "10px", p: "10px 14px", border: "1px solid #eceef0" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0.5, gap: 1 }}>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap", minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 12, sm: 13 }, color: "#191c1e", whiteSpace: "nowrap" }}>
                            {reply.author?.name}
                        </Typography>
                        <Box component="span" sx={{
                            bgcolor: "#e0e3ea", px: 1, py: 0.1,
                            borderRadius: "18px", fontSize: 10,
                            fontWeight: 600, color: "#475569",
                            textTransform: "capitalize", flexShrink: 0,
                        }}>
                            {reply.author?.role}
                        </Box>
                    </Box>

                    <Typography sx={{ fontSize: 10, color: "#a0a0a8", flexShrink: 0, whiteSpace: "nowrap" }}>
                        {timeConverter(reply.createdAt)}
                    </Typography>

                </Box>
                <Typography sx={{ fontSize: 13, color: "#474651", lineHeight: 1.65 }}>{reply.message}</Typography>
            </Box>

        </Box>
    )
};

export default ReplyBubble;