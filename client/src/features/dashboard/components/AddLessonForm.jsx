import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import VideoUpload from "./VideoUpload"
import createLessonSchema from "@/features/lesson/schema/createLessonSchema";
import useCreateLesson from "@/features/lesson/hooks/useCreateLesson";
import handleFieldApiErrors from "@/utils/handleFieldApiErrors"
import updateLessonSchema from "@/features/lesson/schema/updateLessonSchema"
import useUpdateLesson from "@/features/lesson/hooks/useUpdateLesson"

const AddLessonForm = ({ module, lessonEdit, currentLesson, onCurrentLesson, onCancel, onSuccess }) => {

    const [videoFile, setVideoFile] = useState(null)
    const [videoError, setVideoError] = useState("")

    // Lesson form handler
    const { control, handleSubmit, formState: { errors, isDirty }, setError, reset, setValue } = useForm({
        resolver: zodResolver(lessonEdit ? updateLessonSchema : createLessonSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    });

    const isFormDirty = isDirty || !!videoFile;

    const { mutate: createLessonMutate, isPending: isCreateLessonPending, isSuccess: isCreateSuccess } = useCreateLesson(module._id);
    const { mutate: updateLessonMutate, isPending: isUpdateLessonPending, isSuccess: isUpdateSuccess } = useUpdateLesson(module._id);
    const onSubmit = (data) => {
        if (!lessonEdit && !videoFile) {
            setVideoError("Video is required");
            return;
        }

        const formData = new FormData();
        if (data.content !== undefined || lessonEdit) formData.append("title", data.title);
        if (data.content !== undefined) formData.append("content", data.content);
        formData.append("video", videoFile);

        let calledMutate = lessonEdit ? updateLessonMutate : createLessonMutate;
        calledMutate({ id: lessonEdit ? currentLesson._id : module._id, data: formData }, {
            onSuccess: () => {
                reset()
                onSuccess()
                setVideoFile(null)
                setVideoError("")
                onCurrentLesson(null)
            },
            onError: (error) => {
                handleFieldApiErrors(error, setError);
            }
        })
    }

    const handleCancle = () => {
        onCancel()
        reset()
        setVideoFile(null)
        setVideoError("")
        onCurrentLesson(null)
    }

    useEffect(() => {
        if (lessonEdit) {
            setValue("title", currentLesson?.title)
            setValue("content", currentLesson?.content)
        }
    }, [lessonEdit, currentLesson]);

    return (
        <Box sx={{
            border: "1px solid #e0e7ff", borderRadius: "12px",
            bgcolor: "#fafbff", p: 2.5, mt: 1,
        }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#1a146b", textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
                {lessonEdit ? "Edit Lesson" : "New Lesson"}
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
                                disabled={isCreateLessonPending || isUpdateLessonPending}
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
                    <VideoUpload
                        file={videoFile}
                        existingVideoUrl={currentLesson?.video}
                        onChange={(e) => {
                            setVideoFile(e.target.files[0]);
                            setVideoError("");
                        }}
                        isSaving={isCreateLessonPending || isUpdateLessonPending} />
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
                                disabled={isCreateLessonPending || isUpdateLessonPending}
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
                    <Button disabled={!isFormDirty || isCreateLessonPending || isUpdateLessonPending} type="submit" variant="contained" size="small"
                        sx={{ bgcolor: "#1a146b", borderRadius: "8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", px: 2.5, ...(!isDirty || isCreateLessonPending || isUpdateLessonPending && { "&:hover": { bgcolor: "#312e81" } }) }}>
                        {(isCreateLessonPending || isUpdateLessonPending) ? (lessonEdit ? "Saving..." : "Adding...") : (lessonEdit ? "Save Lesson" : "Add Lesson")}
                    </Button>
                    <Button disabled={isCreateLessonPending || isUpdateLessonPending} size="small" onClick={handleCancle}
                        sx={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddLessonForm;