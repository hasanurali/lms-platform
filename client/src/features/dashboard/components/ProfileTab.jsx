import { useState, useRef } from 'react'
import { Box, Avatar, Button, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { AccessTime, CalendarMonth, Cancel, Edit, Person, Save, PhotoCamera } from '@mui/icons-material';

import formatDate from "@/utils/formatData";
import updateProfileSchema from "@/features/user/Schema/updateProfileSchema"
import useUpdateProfile from "@/features/user/hooks/useUpdateProfile"
import handleFieldApiErrors from "@/utils/handleFieldApiErrors"

const ProfileTab = ({ user, courses }) => {

    const [editing, setEditing] = useState(false);

    const fileRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(user.profilePicture);
    const [selectedFile, setSelectedFile] = useState(null);

    const { control, handleSubmit, reset, formState: { errors, isDirty }, setError } = useForm({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.name ?? "",
            bio: user.bio ?? "",
        },
    });


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const { mutate: updateProfileMutate, isPending: isUpdateProfilePending } = useUpdateProfile()
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("bio", data.bio ?? "");
        if (selectedFile) {
            formData.append("profilePicture", selectedFile);
        }

        updateProfileMutate(formData, {
            onSuccess: () => {
                setEditing(false);
                setSelectedFile(null);
            },
            onError: (error) => {
                handleFieldApiErrors(error, setError);
            }
        });
    };

    const handleCancel = () => {
        reset(); // resets to defaultValues
        setPreviewUrl(user.profilePicture);
        setSelectedFile(null);
        setEditing(false);
    };

    return (
        <Box className="space-y-8 max-w-3xl">

            {/* Hero card */}
            <Paper
                elevation={0}
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="bg-white! rounded-xl! shadow-sm! overflow-hidden!">

                {/* Banner */}
                <Box
                    className="h-28 w-full"
                    style={{ background: "linear-gradient(135deg, #1a146b 0%, #312e81 100%)" }}
                />

                {/* Avatar and actions */}
                <Box className="px-8 pb-6 -mt-10 flex items-end justify-between">
                    <Box className="relative">

                        {/* Hidden file input */}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {/* Avatar clickable when editing */}
                        <Box
                            onClick={editing ? () => fileRef.current.click() : undefined}
                            sx={{ position: "relative", width: 80, height: 80, cursor: editing ? "pointer" : "default" }}
                        >
                            <Avatar
                                src={previewUrl}
                                alt={user.name}
                                sx={{
                                    width: 80, height: 80,
                                    border: "4px solid white",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                }}
                            />

                            {/* Dark overlay with camera icon when editing */}
                            {editing && (
                                <Box sx={{
                                    position: "absolute", inset: 0,
                                    borderRadius: "50%",
                                    background: "rgba(0,0,0,0.45)",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                    border: "4px solid white",
                                    transition: "opacity 0.2s",
                                    "&:hover": { background: "rgba(0,0,0,0.6)" },
                                }}>
                                    <PhotoCamera sx={{ fontSize: 20, color: "white" }} />
                                    <Typography sx={{ fontSize: 8, color: "white", fontWeight: 700, letterSpacing: "0.05em", mt: 0.3 }}>
                                        CHANGE
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Edit pencil only when NOT editing */}
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

                        {/* Selected file name hint */}
                        {editing && selectedFile && (
                            <Typography sx={{
                                position: "absolute", top: "calc(100% + 6px)", left: "50%",
                                transform: "translateX(-50%)", whiteSpace: "nowrap",
                                fontSize: 9, color: "#64748b", fontWeight: 600,
                                maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                                {selectedFile.name}
                            </Typography>
                        )}
                    </Box>
                    {editing && (
                        <Box className="flex gap-2 mb-1">
                            <Button
                                type="submit"
                                size="small"
                                variant="contained"
                                startIcon={!isUpdateProfilePending && <Save fontSize="small" />}
                                disabled={!isDirty && !selectedFile}
                                className="bg-indigo-900! text-white! text-[10px]! font-bold! uppercase! tracking-widest! rounded-lg!">
                                {isUpdateProfilePending ? "Saving..." : "Save"}
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

                            {/* Name field*/}
                            <Box>
                                <Box component="label" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
                                    Full Name
                                </Box>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem", fontSize: "0.875rem" } }}
                                        />
                                    )}
                                />
                            </Box>

                            {/* Bio field */}
                            <Box>
                                <Box component="label" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
                                    Bio
                                </Box>
                                <Controller
                                    name="bio"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            size="small"
                                            variant="outlined"
                                            placeholder="Tell us a little about yourself…"
                                            error={!!errors.bio}
                                            helperText={
                                                errors.bio?.message
                                                    ? errors.bio.message
                                                    : `${field.value?.length ?? 0}/500`
                                            }
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem", fontSize: "0.875rem" } }}
                                        />
                                    )}
                                />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box>
                                <Typography className="text-2xl! font-bold! text-indigo-950! tracking-tight!">
                                    {user.name}
                                </Typography>
                                <Typography className="text-sm! text-slate-400! mt-0.5!">{user.email}</Typography>
                            </Box>
                            {user.bio ? (
                                <Typography className="text-sm! text-slate-600! leading-relaxed!">{user.bio}</Typography>
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
                {(user.role === "instructor"
                    ? [
                        { label: "Total Courses", value: courses?.length ?? 0, accent: "border-indigo-800" },
                        { label: "Published", value: courses?.filter(c => c.isPublished).length ?? 0, accent: "border-teal-500" },
                        { label: "Avg Rating", value: (() => { const rated = courses?.filter(c => c.averageRating > 0) ?? []; return rated.length ? (rated.reduce((a, c) => a + c.averageRating, 0) / rated.length).toFixed(1) : "—"; })(), accent: "border-amber-400" },
                    ]
                    : [
                        { label: "Courses Enrolled", value: courses?.length ?? 0, accent: "border-indigo-800" },
                        { label: "Completed", value: courses?.filter(c => c.progressPercentage === 100).length ?? 0, accent: "border-green-500" },
                    ]
                ).map(({ label, value, accent }) => (
                    <Paper key={label} elevation={0} className={`bg-white! p-5! rounded-xl! border-l-4! ${accent} shadow-sm!`}>
                        <Typography className="text-[10px]! uppercase! tracking-widest! text-slate-400! block! mb-2!">
                            {label}
                        </Typography>
                        <Typography className="text-2xl! font-bold! text-indigo-950! tracking-tight!">
                            {value}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}

export default ProfileTab;