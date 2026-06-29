import { useState } from 'react'
import { Box, Avatar, Button, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';

import { AccessTime, CalendarMonth, Cancel, Edit, ImageOutlined, Person, Save } from '@mui/icons-material';

import formatDate from "@/utils/formatData";


const MOCK_COURSES = [
    {
        _id: "c1",
        title: "Principles of Editorial Typography",
        description: "Mastering the art of vertical rhythm and grid systems in modern layouts.",
        instructor: "Prof. Elena Vance",
        price: 49.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-4RyxXWB8IUCic-qoLQ4EWgkpQP7vaIAHtj06pZI3LZ8vD2OcC8zeKsS6y37-_EN6kfozKSivVsPCvKQuKoM5upcvmPDCpOa-GsOga-g56nl6Of62X2qf0Mq1oJsndVd5BK1zVORBLT3k4Xv-k9J7pijQN95gpviYSlnLR10ZubsVZMg7tqqglLKuD3GM-SzPMLbvrsij032WrK8B8ltinjArQY70neME6vpo2bj5Sdj4SUBzoBff10ChjoIH-_QZDIiCRcvI4gc",
        isPublished: true,
        averageRating: 4.5,
        totalReviews: 120,
        category: "Visual Arts",
        totalLessons: 12,
        progress: { completedLessons: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"], completed: false },
        progressPercentage: 65,
    },
    {
        _id: "c2",
        title: "Sustainable Urban Development",
        description: "Exploring the intersection of green spaces and metropolitan growth.",
        instructor: "Dr. Marco Ricci",
        price: 69.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuArxY19W-3x56GfLe5VNlSw-5vv4D9YgsypdmoRrHrHTubg8nJ5w1_y2v0r48rhtcnZXVKa2ofn85riiSlmKC7a7pCvsvFyUZsKVCIiGJw_zqQtEIu2_bAKyxrWXBVDEAqZ4SsiXcg9QMB9cL3LLyCOFERatVyWjHXVF3EGEbIPWvj7M-HWw43CCWlg7ooTRG9nJC_nwz4wlp_c4mlK5Or_t4g6xxzK25NQ7-y09AGfjF_RaWf_B5W_XcZQoMMK_XEQjrOO8265Icw",
        isPublished: true,
        averageRating: 4.2,
        totalReviews: 85,
        category: "Architecture",
        totalLessons: 10,
        progress: { completedLessons: ["l1", "l2"], completed: false },
        progressPercentage: 20,
    },
    {
        _id: "c3",
        title: "Advanced Color Psychologies",
        description: "Deep Boxe into the psychology of color and its impact on design perception.",
        instructor: "Nina Okafor",
        price: 59.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBob8YhIicfO5okmxnHaGfM-VSpIAaHQbvEi-xefXYz3h5Ew33zYvgca-TYoDCKvo80kz5x399AiuJd8BqaEacli0QbBWIYiGuX3AKRFDtdCXIZcAFrNM8o7tex3Ll7si1bl9xRyGrAmf9p0wv4mSX0IhAZiA46WV4LafiMkGgPEI-rbxy8B1HuAmEiiovgBwE2oLvLFuk4EbHpEwl184QCVQXkcqeP1AaXFUIwUeYYm-3VYpnD-Iu98ZLhIL0Hh3rYNdRL3Y8olHs",
        isPublished: true,
        averageRating: 4.8,
        totalReviews: 210,
        category: "Design",
        totalLessons: 24,
        progress: { completedLessons: ["l1", "l2", "l3", "l4", "l5"], completed: false },
        progressPercentage: 21,
    },
    {
        _id: "c4",
        title: "Editorial Voice & Copywriting",
        description: "Craft a compelling editorial voice and master the art of persuasive copy.",
        instructor: "James Thornton",
        price: 39.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzp81XCKxm1nig-ySw023PZPFV27R5OWpiQpCLNy0wSa1IqhN6ALLA977b09RBnhQurQQA1qD548_7Blce2yICNqhN6Wd4Pqt2cDiax0j1-5jyt3p3iFHdlCDmX82dofcnuQiau8I6Jh5NvUQW2HaxNDLsMqB30cfuSO1iSPJM_cLdKOPgxUcmsWnazDHRQ3QH2g_R5mB5wQOhjOtXsxa2twglOMM2L37kiCZuHKONl8ApM4RtNdMzd1sW9kGffklpaS3-tFqSRTQ",
        isPublished: true,
        averageRating: 4.6,
        totalReviews: 150,
        category: "Writing",
        totalLessons: 12,
        progress: { completedLessons: [], completed: false },
        progressPercentage: 0,
    },
    {
        _id: "c5",
        title: "Grid Systems in Modern Design",
        description: "Master foundational grid systems that underpin every great editorial layout.",
        instructor: "Prof. Elena Vance",
        price: 44.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-4RyxXWB8IUCic-qoLQ4EWgkpQP7vaIAHtj06pZI3LZ8vD2OcC8zeKsS6y37-_EN6kfozKSivVsPCvKQuKoM5upcvmPDCpOa-GsOga-g56nl6Of62X2qf0Mq1oJsndVd5BK1zVORBLT3k4Xv-k9J7pijQN95gpviYSlnLR10ZubsVZMg7tqqglLKuD3GM-SzPMLbvrsij032WrK8B8ltinjArQY70neME6vpo2bj5Sdj4SUBzoBff10ChjoIH-_QZDIiCRcvI4gc",
        isPublished: true,
        averageRating: 4.3,
        totalReviews: 98,
        category: "Visual Arts",
        totalLessons: 18,
        progress: { completedLessons: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l11", "l12", "l13", "l14", "l15", "l16", "l17", "l18"], completed: true },
        progressPercentage: 100,
    },
];

const ProfileTab = ({ user }) => {

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: user.name, profilePicture: user.profilePicture, bio: user.bio });
    const [saved, setSaved] = useState({ ...form });

    const handleSave = () => {
        setSaved({ ...form });
        setEditing(false);
    };

    const handleCancel = () => {
        setForm({ ...saved });
        setEditing(false);
    };

    return (
        <Box className="space-y-8 max-w-3xl">

            {/* Hero card */}
            <Paper elevation={0} className="bg-white! rounded-xl! shadow-sm! overflow-hidden!">

                {/* Banner */}
                <Box
                    className="h-28 w-full"
                    style={{ background: "linear-gradient(135deg, #1a146b 0%, #312e81 100%)" }}
                />
                {/* Avatar and actions */}
                <Box className="px-8 pb-6 -mt-10 flex items-end justify-between">
                    <Box className="relative">
                        <Avatar
                            src={editing ? form.profilePicture : saved.profilePicture}
                            alt={user.name}
                            sx={{
                                width: 80, height: 80,
                                border: "4px solid white",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                            }} />
                        {!editing && (
                            <Tooltip title="Edit profile">
                                <IconButton
                                    size="small"
                                    onClick={() => setEditing(true)}
                                    className="absolute! -bottom-1! -right-1! bg-indigo-900! text-white! shadow!"
                                    sx={{ width: 26, height: 26 }}>
                                    <Edit sx={{ fontSize: 13 }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    {editing && (
                        <Box className="flex gap-2 mb-1">
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<Save fontSize="small" />}
                                onClick={handleSave}
                                className="bg-indigo-900! text-white! text-[10px]! font-bold! uppercase! tracking-widest! rounded-lg!">
                                Save
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Cancel fontSize="small" />}
                                onClick={handleCancel}
                                className="border-slate-300! text-slate-600! text-[10px]! font-bold! uppercase! tracking-widest! rounded-lg!">
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Fields */}
                <Box className="px-8 pb-8 space-y-5">
                    {editing ? (
                        <>
                            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Box>
                                    <Box component="label" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Full Name
                                    </Box>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem", fontSize: "0.875rem" } }}
                                    />
                                </Box>
                                <Box>
                                    <Box component="label" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Profile Picture URL
                                    </Box>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={form.profilePicture}
                                        onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
                                        placeholder="https://example.com/avatar.jpg"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                                                    <ImageOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                                                </Box>
                                            ),
                                            endAdornment: form.profilePicture ? (
                                                <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                                                    <Avatar
                                                        src={form.profilePicture}
                                                        sx={{ width: 24, height: 24 }}
                                                        onError={(e) => { e.target.src = ""; }}
                                                    />
                                                </Box>
                                            ) : null,
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem", fontSize: "0.875rem" } }}
                                    />
                                    <Typography className="text-[10px]! text-slate-400! mt-1! block!">
                                        Paste any image URL — preview updates live
                                    </Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Box component="label" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
                                    Bio
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                    placeholder="Tell us a little about yourself…"
                                    variant="outlined"
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem", fontSize: "0.875rem" } }}
                                />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box>
                                <Typography className="text-2xl! font-bold! text-indigo-950! tracking-tight!">
                                    {saved.name}
                                </Typography>
                                <Typography className="text-sm! text-slate-400! mt-0.5!">{user.email}</Typography>
                            </Box>
                            {saved.bio ? (
                                <Typography className="text-sm! text-slate-600! leading-relaxed!">{saved.bio}</Typography>
                            ) : (
                                <Typography className="text-sm! text-slate-400! italic!">No bio added yet.</Typography>
                            )}
                        </>
                    )}
                </Box>
            </Paper>

            {/* User info */}
            <Box className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Paper elevation={0} className="bg-white! rounded-xl! shadow-sm! p-5! flex items-center gap-4">
                    <Box className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                        <Person sx={{ fontSize: 20, color: "#312e81" }} />
                    </Box>
                    <Box>
                        <Typography className="text-[10px]! uppercase! tracking-widest! text-slate-400! block!">Role</Typography>
                        <Typography className="text-sm! font-semibold! text-indigo-950! capitalize!">{user.role}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={0} className="bg-white! rounded-xl! shadow-sm! p-5! flex items-center gap-4">
                    <Box className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <CalendarMonth sx={{ fontSize: 20, color: "#0d9488" }} />
                    </Box>
                    <Box>
                        <Typography className="text-[10px]! uppercase! tracking-widest! text-slate-400! block!">Member Since</Typography>
                        <Typography className="text-sm! font-semibold! text-indigo-950">{formatDate(user.createdAt)}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={0} className="bg-white! rounded-xl! shadow-sm! p-5! flex items-center gap-4">
                    <Box className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <AccessTime sx={{ fontSize: 20, color: "#d97706" }} />
                    </Box>
                    <Box>
                        <Typography className="text-[10px]! uppercase! tracking-widest! text-slate-400! block!">Last Updated</Typography>
                        <Typography className="text-sm! font-semibold! text-indigo-950">{formatDate(user.updatedAt)}</Typography>
                    </Box>
                </Paper>
            </Box>

            {/* Stats */}
            <Box className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {[
                    { label: "Courses Enrolled", value: MOCK_COURSES.length, accent: "border-indigo-800" },
                    { label: "Completed", value: MOCK_COURSES.filter(c => c.progressPercentage === 100).length, accent: "border-green-500" }
                ].map(({ label, value, badge, accent }) => (
                    <Paper key={label} elevation={0} className={`bg-white! p-5! rounded-xl! border-l-4! ${accent} shadow-sm!`}>
                        <Typography className="text-[10px]! uppercase! tracking-widest! text-slate-400! block! mb-2!">
                            {label}
                        </Typography>
                        <Box className="flex items-baseline gap-1.5">
                            <Typography className="text-2xl! font-bold! text-indigo-950! tracking-tight!">{value}</Typography>
                            {badge && <span className="text-xs font-semibold text-teal-600">{badge}</span>}
                        </Box>
                    </Paper>
                ))}
            </Box>

        </Box>
    );
}

export default ProfileTab;