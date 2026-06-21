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
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#191c1e", display: "flex", gap: "7px" }}>
                        {reply.author?.name}
                        <Box component="span" sx={{ backgroundColor: "#E0E3EA", padding: "0px 5px", paddingTop: "0.7px", borderRadius: "18px", fontSize: "12px"}}>{reply.author?.role}</Box>
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: "#a0a0a8" }}>{timeConverter(reply.createdAt)}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, color: "#474651", lineHeight: 1.65 }}>{reply.message}</Typography>
            </Box>
        </Box>
    )
};

export default ReplyBubble;