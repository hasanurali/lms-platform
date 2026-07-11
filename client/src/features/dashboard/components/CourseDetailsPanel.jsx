import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Paper, TextField, Typography, } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Save } from "@mui/icons-material";
import DoneAllIcon from '@mui/icons-material/DoneAll';

import StepBadge from "./StepBadge";
import ThumbnailUpload from "./ThumbnailUpload";
import createCourseSchema from "@/features/course/schema/createCourse";
import useCreateCourse from "@/features/course/hooks/useCreateCourse";
import handleFieldApiErrors from "@/utils/handleFieldApiErrors";
import useUpdateCourse from "@/features/course/hooks/useUpdateCourse";

const CourseDetailsPanel = ({ onSaved, course }) => {

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(course ? course?.thumbnail : "");
    const [thumbnailError, setThumbnailError] = useState("");
    const [isSaved, setIsSaved] = useState(false)
    const [editRenderCount, setEditRenderCount] = useState(0)

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
        setThumbnailError("");
    }

    const { control, handleSubmit, formState: { errors, isDirty }, setError, reset } = useForm({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0
        }
    });

    const isFormDirty = isDirty || !!thumbnailFile;

    const { mutate: createCourseMutate, isPending: isCreateCoursePending } = useCreateCourse();
    const { mutate: updateCourseMutate, isPending: isUpdateCoursePending } = useUpdateCourse();
    const onSubmit = (data) => {

        if (!course && !thumbnailFile) {
            setThumbnailError("Thumbnail is required");
            return;
        }

        const formData = new FormData();
        if (data.title !== undefined) formData.append("title", data.title);
        if (data.description !== undefined) formData.append("description", data.description);
        if (data.price !== undefined) formData.append("price", data.price);
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        const callMutation = course ? updateCourseMutate : createCourseMutate;
        callMutation(course ? { id: course?._id, data: formData } : formData, {
            onSuccess: (res) => {
                setIsSaved(true)
                if (!course) {
                    onSaved(res.data?._id)
                }
            },
            onError: (error) => {
                handleFieldApiErrors(error, setError);
            }
        })

    };

    useEffect(() => {
        if (course?._id) {
            reset({
                title: course?.title || "",
                description: course?.description || "",
                price: course?.price || 0,
            });
            onSaved(course?._id)
        }
    }, [course])

    return (
        <Paper onSubmit={handleSubmit(onSubmit)} elevation={0} component="form" noValidate
            sx={{ bgcolor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <StepBadge number={1} done={false} />
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1a146b" }}>Course Details</Typography>
                </Box>
                {(course && isSaved) ?
                    <Button onClick={() => { setIsSaved(false); setEditRenderCount(editRenderCount + 1) }} size="small" sx={{ minWidth: 0, px: 1.5, py: 0.5, fontSize: 11, fontWeight: 600, color: "#1a146b", bgcolor: "#e0e7ff", borderRadius: "6px", textTransform: "none", "&:hover": { bgcolor: "#c7d2fe" } }}>
                        Edit
                    </Button>
                    : (
                        editRenderCount > 0 && <Button onClick={() => setIsSaved(true)} size="small" sx={{ minWidth: 0, px: 1.2, py: 0.3, fontSize: 10, fontWeight: 600, color: "#dc2626", bgcolor: "#fee2e2", borderRadius: "6px", textTransform: "none", "&:hover": { bgcolor: "#fecaca" } }}>
                            Cancel
                        </Button>
                    )
                }
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
                                disabled={isSaved || isCreateCoursePending || isUpdateCoursePending}
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
                                disabled={isSaved || isCreateCoursePending || isUpdateCoursePending}
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
                                disabled={isSaved || isCreateCoursePending || isUpdateCoursePending}
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
                    <ThumbnailUpload preview={thumbnailPreview} onChange={handleFile} isSaved={isSaved || isCreateCoursePending || isUpdateCoursePending} />
                    {thumbnailError && <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.5 }}>{thumbnailError}</Typography>}
                </Box>

                {/* Save */}
                <Button type="submit" fullWidth variant="contained" disabled={!isFormDirty || isCreateCoursePending || isUpdateCoursePending || isSaved}
                    startIcon={!isSaved && ((isCreateCoursePending || isUpdateCoursePending) ? <CircularProgress size={14} sx={{ color: "white" }} /> : <Save fontSize="small" />)}
                    endIcon={isSaved && <DoneAllIcon fontSize="small" />}
                    sx={{ bgcolor: "#1a146b", borderRadius: "10px", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", py: 1.4, "&:hover": { bgcolor: "#312e81" }, "&:disabled": { bgcolor: "#c7d2fe" } }}>
                    {(isCreateCoursePending || isUpdateCoursePending) ? "Saving..." : isSaved ? "Course Saved" : "Save Course"}
                </Button>
            </Box>
        </Paper>
    );
}

export default CourseDetailsPanel;