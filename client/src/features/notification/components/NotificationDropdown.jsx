import React, { useEffect } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material';

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import NotificationCard from './NotificationCard';
import useMarkReadNotifications from '../hooks/useMarkReadNotification';

const NotificationDropdown = ({ onNotificationToggle, notifications, fetchNextPage, hasNextPage, isFetchingNextPage, isMobile, onMarkAllRead, isMarkAllReadPending, unreadCount = 0 }) => {

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        if (scrollHeight - scrollTop <= clientHeight + 50 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // Mark read notification when it clicks
    const { mutate: markNotificationMutate } = useMarkReadNotifications();
    const handleReadNotification = (id) => {
        markNotificationMutate(id)
    };

    return (
        <Box
            sx={isMobile ? {
                width: "100%", height: "100vh",
                bgcolor: "#ffffff",
                display: "flex", flexDirection: "column",
            }
                :
                {
                    position: "absolute", right: "4px", top: "40px",
                    width: "440px", height: "335px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px", boxShadow: 5,
                    border: "1px solid", borderColor: "#f1f5f9",
                    zIndex: 50,
                }
            }>

            {/* Triangle Pointer */}
            {!isMobile && (
                <Box
                    sx={{
                        position: "absolute", top: "-6px", right: "24px",
                        width: "16px", height: "16px",
                        backgroundColor: "#ffffff",
                        borderTop: "1px solid", borderLeft: "1px solid", borderColor: "#f1f5f9",
                        transform: "rotate(45deg)",
                    }} />
            )}

            {/* Header */}
            <Box sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                px: 2, py: 1.5, borderBottom: "1px solid #e2e8f0"
            }}>
                {/* Left title */}
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                    Notifications
                </Typography>

                {/* Right mark all read and close */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {unreadCount > 0 && (
                        <Button
                            onClick={onMarkAllRead}
                            startIcon={<DoneAllIcon sx={{ fontSize: "14px !important" }} />}
                            sx={{
                                fontSize: 11, fontWeight: 600, color: "#1a146b",
                                textTransform: "none", px: 1.25, py: 0.5,
                                borderRadius: "8px", minWidth: 0,
                                "&:hover": { background: "rgba(26,20,107,0.06)" },
                            }}>
                            {isMarkAllReadPending ? "Marking..." : "Mark all read"}
                        </Button>
                    )}
                    <IconButton onClick={() => onNotificationToggle(false)} sx={{ padding: "none" }}>
                        <CloseIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Notifications List */}
            <Box
                onScroll={handleScroll}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    height: "calc(100% - 67px)",
                    overflowY: "auto", overscrollBehavior: "contain", p: 1,
                    "::-webkit-scrollbar": { width: "6px" },
                    "::-webkit-scrollbar-thumb": { background: "#eceef0", borderRadius: "4px" }
                }}>
                {notifications.length > 0 ? (

                    notifications?.map((notification) => <NotificationCard key={notification._id} notification={notification} onReadNotification={handleReadNotification} />)

                ) : (
                    <Box
                        sx={{
                            height: "100%", display: "flex",
                            flexDirection: "column", justifyContent: "center",
                            alignItems: "center", gap: 1
                        }}>
                        <NotificationsNoneIcon sx={{ fontSize: 42, color: "#CBD5E1" }} />

                        <Typography
                            sx={{
                                fontSize: 14, color: "#64748B"
                            }}>
                            No notifications yet
                        </Typography>
                    </Box>
                )}

                {isFetchingNextPage && (
                    <Typography
                        sx={{
                            textAlign: "center",
                            py: 2, color: "#64748B"
                        }}
                    >
                        Loading...
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default NotificationDropdown