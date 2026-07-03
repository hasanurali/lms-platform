import { useState } from "react";
import { Box, Button, Collapse, Paper, TextField, Typography } from "@mui/material";

import { Add, DragIndicator } from "@mui/icons-material";

import LessonRow from "./LessonRow";
import AddLessonForm from "./AddLessonForm";

const ModuleBlock = ({ module, moduleIdx, courseId }) => {
    const [addingLesson, setAddingLesson] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [lessons, setLessons] = useState(module.lessons ?? []);

    return (
        <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>
            {/* Module header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2.5, py: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <DragIndicator sx={{ fontSize: 17, color: "#cbd5e1", cursor: "grab", flexShrink: 0 }} />

                {editingTitle ? (
                    <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                        <TextField autoFocus size="small" defaultValue={module.title} fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.85rem", bgcolor: "white" } }} />
                        <Button size="small" variant="contained"
                            onClick={() => setEditingTitle(false)}
                            sx={{ bgcolor: "#1a146b", borderRadius: "7px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", px: 1.5, minWidth: 0, whiteSpace: "nowrap", "&:hover": { bgcolor: "#312e81" } }}>
                            Save
                        </Button>
                        <Button size="small" onClick={() => setEditingTitle(false)}
                            sx={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase", minWidth: 0 }}>
                            Cancel
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Module {moduleIdx + 1}
                            </Typography>
                            <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 700, color: "#1a146b", lineHeight: 1.2 }}>
                                {module.title}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button size="small" onClick={() => setEditingTitle(true)}
                                sx={{ minWidth: 0, px: 1.5, py: 0.5, fontSize: 11, fontWeight: 600, color: "#1a146b", bgcolor: "#e0e7ff", borderRadius: "6px", textTransform: "none", "&:hover": { bgcolor: "#c7d2fe" } }}>
                                Edit
                            </Button>
                            <Button size="small"
                                sx={{ minWidth: 0, px: 1.5, py: 0.5, fontSize: 11, fontWeight: 600, color: "#dc2626", bgcolor: "#fee2e2", borderRadius: "6px", textTransform: "none", "&:hover": { bgcolor: "#fecaca" } }}>
                                Delete
                            </Button>
                        </Box>
                    </>
                )}
            </Box>

            {/* Lessons */}
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {lessons.length === 0 && !addingLesson && (
                    <Typography sx={{ fontSize: 12, color: "#94a3b8", textAlign: "center", py: 1.5 }}>
                        No lessons yet.
                    </Typography>
                )}

                {lessons.map((lesson, lIdx) => (
                    <LessonRow key={lesson._id} lesson={lesson} lessonIdx={lIdx}
                        onDelete={() => setLessons(prev => prev.filter(l => l._id !== lesson._id))} />
                ))}

                {/* Add lesson form */}
                <Collapse in={addingLesson}>
                    <AddLessonForm
                        moduleId={module._id}
                        onCancel={() => setAddingLesson(false)}
                        onSuccess={() => setAddingLesson(false)}
                    />
                </Collapse>

                {!addingLesson && (
                    <Button variant="contained" startIcon={<Add sx={{ fontSize: 14 }} />}
                        onClick={() => setAddingLesson(true)}
                        sx={{ bgcolor: "#1a146b", borderRadius: "9px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", py: 1.1, mt: 0.5, "&:hover": { bgcolor: "#312e81" } }}>
                        Add Lesson
                    </Button>
                )}
            </Box>
        </Paper>
    );
}

export default ModuleBlock;