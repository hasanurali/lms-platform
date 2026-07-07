import { useState } from "react";
import { Box, Button, CircularProgress, Paper, TextField, Typography, } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Save } from "@mui/icons-material";
import DoneAllIcon from '@mui/icons-material/DoneAll';

import StepBadge from "./StepBadge";
import ThumbnailUpload from "./ThumbnailUpload"
import createCourseSchema from "@/features/course/schema/createCourse";
import useCreateCourse from "@/features/course/hooks/useCreateCourse";
import handleFieldApiErrors from '@/utils/handleFieldApiErrors'

const CourseDetailsPanel = ({ onSaved }) => {

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [thumbnailError, setThumbnailError] = useState("");
    const [isSaved, setIsSaved] = useState(false)

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
        setThumbnailError("");
    }

    const { control, handleSubmit, formState: { errors, isDirty }, setError } = useForm({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0
        }
    });

    const { mutate: createCourseMutate, isPending } = useCreateCourse();
    const onSubmit = (data) => {

        if (!thumbnailFile) {
            setThumbnailError("Thumbnail is required");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.price !== undefined) formData.append("price", data.price);
        formData.append("thumbnail", thumbnailFile);

        createCourseMutate(formData, {
            onSuccess: (res) => {
                setIsSaved(true)
                onSaved(res.data?._id)
            },
            onError: (error) => {
                handleFieldApiErrors(error, setError);
            }
        })

    };

    return (
        <Paper onSubmit={handleSubmit(onSubmit)} elevation={0} component="form" noValidate
            sx={{ bgcolor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 1.5 }}>
                <StepBadge number={1} done={false} />
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1a146b" }}>Course Details</Typography>
            </Box>

            <Box sx={{ px: 3, py: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>

                {/* Title */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Course Title *
                    </Typography>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth size="small" placeholder="e.g. Node.js Backend Mastery"
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
                                disabled={isSaved || isPending}
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        )}
                    />
                </Box>

                {/* Description */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Description *
                    </Typography>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth multiline rows={4} size="small" placeholder="Write course description..."
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
                                disabled={isSaved || isPending}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />
                </Box>

                {/* Price */}
                <Box sx={{ display: "none" }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Price (USD)
                    </Typography>
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth size="small" type="number" placeholder="49.99"
                                slotProps={{
                                    input: {
                                        startAdornment: <Typography sx={{ mr: 0.5, color: "#94a3b8", fontSize: 14 }}>$</Typography>
                                    }
                                }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
                                disabled={isSaved || isPending}
                                error={!!errors.price}
                                helperText={errors.price?.message}
                            />
                        )}
                    />
                </Box>

                {/* Thumbnail */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Thumbnail *
                    </Typography>
                    <ThumbnailUpload preview={thumbnailPreview} onChange={handleFile} isSaved={isSaved || isPending} />
                    {thumbnailError && <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.5 }}>{thumbnailError}</Typography>}
                </Box>

                {/* Save */}
                <Button type="submit" fullWidth variant="contained" disabled={isPending || isSaved}
                    startIcon={!isSaved && (isPending ? <CircularProgress size={14} sx={{ color: "white" }} /> : <Save fontSize="small" />)}
                    endIcon={isSaved && <DoneAllIcon fontSize="small" />}
                    sx={{ bgcolor: "#1a146b", borderRadius: "10px", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", py: 1.4, "&:hover": { bgcolor: "#312e81" }, "&:disabled": { bgcolor: "#c7d2fe" } }}>
                    {isPending ? "Saving..." : isSaved ? "Course Saved" : "Save Course"}
                </Button>
            </Box>
        </Paper>
    );
}

export default CourseDetailsPanel;