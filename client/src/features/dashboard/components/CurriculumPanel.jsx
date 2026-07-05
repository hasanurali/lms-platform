import { useState } from "react";
import { Box, Button, CircularProgress, Collapse, Paper, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Add, VideoLibrary } from "@mui/icons-material";

import StepBadge from './StepBadge'
import ModuleBlock from "./ModuleBlock"
import createModuleSchema from "@/features/module/schema/createModule"
import useCreateModule from "@/features/module/hooks/useCreateModule"
import handleFieldApiErrors from "@/utils/handleFieldApiErrors"
import useFetchModule from "@/features/module/hooks/useFetchModule";

const CurriculumPanel = ({ courseId }) => {

    const [addingModule, setAddingModule] = useState(false);

    const { control, handleSubmit, formState: { errors, isDirty }, setError, reset } = useForm({
        resolver: zodResolver(createModuleSchema),
        defaultValues: {
            title: "",
        }
    });

    // Create module
    const { mutate: createModuleMutate, isPending: isCreateModulePending } = useCreateModule(courseId);
    const onSubmit = (data) => {
        if (!courseId) return;
        createModuleMutate({ id: courseId, title: data.title }, {
            onSuccess: () => {
                reset()
                setAddingModule(false);
            },
            onError: (error) => {
                handleFieldApiErrors(error, setError);
            }
        })
    };


    // Fetch course all modules
    const { data: modules } = useFetchModule(courseId)

    const locked = !courseId;

    return (
        <Paper elevation={0}

            sx={{ bgcolor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", opacity: locked ? 0.5 : 1, pointerEvents: locked ? "none" : "auto", transition: "opacity 0.3s" }}>

            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <StepBadge number={2} done={false} />
                    <Box>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1a146b" }}>Course Curriculum</Typography>
                        <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.1 }}>
                            {locked ? "Save course details first" : `${modules?.data?.length} modules`}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ px: 3, py: 3, display: "flex", flexDirection: "column", gap: 2 }}>

                {/* Empty state */}
                {modules?.data?.length === 0 && !addingModule && (
                    <Box sx={{ textAlign: "center", py: 5 }}>
                        <VideoLibrary sx={{ fontSize: 36, color: "#e2e8f0", display: "block", mx: "auto", mb: 1.5 }} />
                        <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>No modules yet. Add your first module below.</Typography>
                    </Box>
                )}

                {/* Module list */}
                {modules?.data?.map((module, i) => (
                    <ModuleBlock
                        key={module._id}
                        module={module}
                        order={i + 1}
                    />
                ))}

                {/* Add module form */}
                <Collapse in={addingModule}>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate
                        sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2.5, border: "1px solid #e0e7ff", borderRadius: "12px", bgcolor: "#fafbff" }}>

                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#1a146b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            New Module
                        </Typography>

                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    autoFocus fullWidth size="small" placeholder="e.g. Authentication"
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem", bgcolor: "white" } }}
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            )}
                        />

                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <Button type="submit" variant="contained" size="small" disabled={!isDirty || isCreateModulePending}
                                startIcon={isCreateModulePending ? <CircularProgress size={12} sx={{ color: "white" }} /> : null}
                                sx={{ bgcolor: "#1a146b", borderRadius: "8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", px: 2.5, "&:hover": { bgcolor: "#312e81" }, "&.Mui-disabled": { opacity: 0.45, color: "white" } }}>
                                {isCreateModulePending ? "Adding..." : "Add Module"}
                            </Button>
                            <Button size="small" onClick={() => { setAddingModule(false); reset(); }}
                                sx={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Collapse>

                {/* Add module button */}
                {!addingModule && (
                    <Button fullWidth variant="outlined" startIcon={<Add />} onClick={() => setAddingModule(true)}
                        sx={{
                            borderColor: "#1a146b", color: "#1a146b", borderRadius: "12px", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", py: 1.4, "&:hover": { bgcolor: "#eef2ff", borderColor: "#312e81" }, "&.Mui-disabled": { opacity: 0.45, color: "white" },
                            transition: "all 0.2s",
                        }}>
                        Add Module
                    </Button>
                )}

            </Box>
        </Paper>
    );
}

export default CurriculumPanel;