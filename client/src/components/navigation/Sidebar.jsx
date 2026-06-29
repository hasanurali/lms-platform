import React from 'react'
import { Box, Avatar, Typography } from '@mui/material';

import { Logout, MenuBook, Person } from '@mui/icons-material';

const NAV_ITEMS = [
    { label: "Profile", icon: <Person fontSize="small" />, id: "profile" },
    { label: "Courses", icon: <MenuBook fontSize="small" />, id: "courses" },
];

const Sidebar = ({ activeTab, setActiveTab, user }) => {
    return (
        <Box component="aside" className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-50 border-r border-slate-100">

            {/* User info */}
            <Box className="px-6 py-6 flex items-center gap-3">
                <Avatar
                    src={user?.profilePicture}
                    alt={user?.name}
                    sx={{ width: 40, height: 40, border: "2px solid #e0e7ff" }} />
                <Box>
                    <Typography className="text-indigo-900! font-semibold! text-xs! block! tracking-wide!">
                        {user?.name}
                    </Typography>
                    <Typography className="text-slate-400! tracking-widest! text-[10px]! block! mt-0.5! capitalize!">
                        {user?.role}
                    </Typography>
                </Box>
            </Box>

            <Box className="mx-6! border-slate-100! mb-2!" />

            {/* Nav */}
            <Box component="nav" className="flex-1 space-y-0.5 mt-2">
                {NAV_ITEMS.map(({ label, icon, id }) =>
                    activeTab === id ? (
                        <Box
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className="flex items-center gap-3 bg-white text-indigo-700 rounded-l-full ml-4 pl-4 py-3 shadow-sm cursor-pointer">
                            {icon}
                            <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
                        </Box>
                    ) : (
                        <Box
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className="flex items-center gap-3 text-slate-500 pl-8 py-3 hover:text-indigo-900 hover:translate-x-1 transition-all duration-150 cursor-pointer">
                            {icon}
                            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
                        </Box>
                    )
                )}
            </Box>

            {/* Bottom */}
            <Box className="mx-6! border-slate-100!" />
            <Box className="pt-1 pb-4">
                <Box className="flex items-center gap-3 text-slate-500 pl-8 py-3 hover:text-red-500 transition-colors cursor-pointer">
                    <Logout fontSize="small" />
                    <Box component="span" className="text-xs font-medium uppercase tracking-wide">Logout</Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Sidebar;