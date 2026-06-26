import React from 'react'
import { Box, Avatar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

import getNotificationConfig from '@/utils/getNotificationConfig';
import getNotificationLink from '@/utils/getNotificationLink';
import timeConverter from "@/utils/timeConverter";

const NotificationCard = ({ notification }) => {

    const navigate = useNavigate();

    const config = getNotificationConfig(notification.type);

    const handleNotificationClick = (notification) => {
        navigate(getNotificationLink(notification));
    };

    return (
        <Box
            onClick={() => handleNotificationClick(notification)}
            key={notification._id}
            sx={{
                display: "flex", gap: 1.5, p: 1.5,
                borderRadius: 2, cursor: "pointer", transition: "all .2s ease",
                "&:hover": {
                    bgcolor: "#F8FAFC",
                },
            }}>
            <Avatar
                sx={{
                    width: 38, height: 38,
                    bgcolor: config.bg, color: config.color,
                }}>
                {config.icon}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: 14, fontWeight: 600,
                        color: "#0F172A", lineHeight: 1.3,
                    }}>
                    {notification.title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13, color: "#64748B",
                        mt: 0.25, lineHeight: 1.4,
                    }}>
                    {notification.message}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 11, color: "#94A3B8", mt: 0.75,
                    }}>
                    {timeConverter(notification.createdAt)}
                </Typography>
            </Box>
        </Box>
    )
}

export default NotificationCard;