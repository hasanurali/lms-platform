import React from 'react'
import { Box, Avatar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

import getNotificationConfig from '@/utils/getNotificationConfig';
import getNotificationLink from '@/utils/getNotificationLink';
import timeConverter from "@/utils/timeConverter";

const NotificationCard = ({ notification, onReadNotification }) => {

    const navigate = useNavigate();

    const config = getNotificationConfig(notification.type);

    const handleNotificationClick = (notification) => {
        navigate(getNotificationLink(notification));
    };

    return (
        <Box
            onClick={() => { handleNotificationClick(notification), (!notification.isRead && onReadNotification(notification._id)) }}
            sx={{
                display: "flex", gap: 1.5, p: 1.5,
                borderRadius: 2, cursor: "pointer", transition: "all .2s ease",
                position: "relative",
                background: notification.isRead ? "#fff" : "rgba(26,20,107,0.03)",
                "&:hover": {
                    background: notification.isRead ? "#f8fafc" : "rgba(26,20,107,0.06)",
                },
            }}>

            {!notification.isRead && (
                <Box sx={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: "3px", background: "#1a146b",
                    borderRadius: "0 2px 2px 0",
                }} />
            )}

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

            {/* Unread dot */}
            {
                !notification.isRead && (
                    <Box sx={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "#1a146b", flexShrink: 0, mt: "6px",
                    }} />
                )
            }
        </Box >
    )
}

export default NotificationCard;