import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import VideoUpload from "./VideoUpload"
import createLessonSchema from "@/features/lesson/schema/createLessonSchema";
import useCreateLesson from "@/features/lesson/hooks/useCreateLesson";
import handleFieldApiErrors from "@/utils/handleFieldApiErrors"

const AddLessonForm = ({ moduleId, onCancel, onSuccess }) => {

    const [videoFile, setVideoFile] = useState(null)
    const [videoError, setVideoError] = useState("")

    // Lesson form handler
    const { control, handleSubmit, formState: { errors, isDirty }, setError, reset } = useForm({
        resolver: zodResolver(createLessonSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    });

    const { mutate: createLessonModule, isPending: isCreateLessonPending } = useCreateLesson(moduleId);
    const onSubmit = (data) => {
        if (!videoFile) {
            setVideoError("Video is required");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        if (data.content !== undefined) formData.append("content", data.content);
        formData.append("video", videoFile);

        createLessonModule({ id: moduleId, data: formData }, {
            onSuccess: () => {
                reset()
                onSuccess()
                setVideoFile(null)
                setVideoError("")
            },
            onError: (error) => {
                handleFieldApiErrors(error, setError);
            }
        })
    }

    return (
        <Box sx={{
            border: "1px solid #e0e7ff", borderRadius: "12px",
            bgcolor: "#fafbff", p: 2.5, mt: 1,
        }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#1a146b", textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
                New Lesson
            </Typography>

            <Box component={"form"} onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                {/* Title */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Lesson Title *
                    </Typography>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth size="small" placeholder="e.g. Introduction to JWT"
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.8rem", bgcolor: "white" } }}
                                disabled={isCreateLessonPending}
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        )}
                    />
                </Box>

                {/* Video */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Video File *
                    </Typography>
                    <VideoUpload file={videoFile} onChange={(e) => { setVideoFile(e.target.files[0]); setVideoError(""); }} isSaving={isCreateLessonPending} />
                    {videoError && <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.5 }}>{videoError}</Typography>}
                </Box>

                {/* Content */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Content <Typography component="span" sx={{ fontSize: 9, color: "#cbd5e1", textTransform: "none", letterSpacing: 0 }}>optional · max 1000 chars</Typography>
                    </Typography>
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth multiline rows={2} size="small"
                                placeholder="Write lesson notes or description…"
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.8rem", bgcolor: "white" } }}
                                disabled={isCreateLessonPending}
                                error={!!errors.content}
                                helperText={
                                    <>
                                        {errors.content && <span style={{ display: 'block', color: 'red' }}>{errors.content.message}</span>}
                                        <span>{field.value?.length ?? 0}/1000</span>
                                    </>
                                }
                            />
                        )}
                    />
                </Box>

                {/* Actions */}
                <Box type="submit" sx={{ display: "flex", gap: 1.5, pt: 0.5 }}>
                    <Button disabled={!isDirty || isCreateLessonPending} type="submit" variant="contained" size="small"
                        sx={{ bgcolor: "#1a146b", borderRadius: "8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", px: 2.5, "&:hover": { bgcolor: "#312e81" } }}>
                        {isCreateLessonPending ? "Adding..." : "Add Lesson"}
                    </Button>
                    <Button disabled={isCreateLessonPending} size="small" onClick={onCancel}
                        sx={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddLessonForm;