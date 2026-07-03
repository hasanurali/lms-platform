import { useState } from "react";
import { Box, Button, CircularProgress, Collapse, Paper, TextField, Typography } from "@mui/material";

import { Add, VideoLibrary } from "@mui/icons-material";

import StepBadge from './StepBadge'
import ModuleBlock from "./ModuleBlock"

const CurriculumPanel = ({ courseId }) => {
    const [title, setTitle] = useState("")
    const [modules, setModules] = useState([]);
    const [addingModule, setAddingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [isAddingPending, setIsAddingPending] = useState(false);

    const handleAddModule = () => {
        setIsAddingPending(true);

        console.log("Module:", { courseId, title });

        setModules(prev => [...prev, { _id: Date.now().toString(), title, order: prev.length + 1, lessons: [] }]);
        setAddingModule(false);
        setIsAddingPending(false);
    };

    const locked = courseId;

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
                            {locked ? "Save course details first" : `${modules.length} modules · ${modules.reduce((a, m) => a + m.lessons.length, 0)} lessons`}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ px: 3, py: 3, display: "flex", flexDirection: "column", gap: 2 }}>

                {/* Empty state */}
                {modules.length === 0 && !addingModule && (
                    <Box sx={{ textAlign: "center", py: 5 }}>
                        <VideoLibrary sx={{ fontSize: 36, color: "#e2e8f0", display: "block", mx: "auto", mb: 1.5 }} />
                        <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>No modules yet. Add your first module below.</Typography>
                    </Box>
                )}

                {/* Module list */}
                {modules.map((module, mIdx) => (
                    <ModuleBlock
                        key={module._id}
                        module={module}
                        moduleIdx={mIdx}
                        courseId={courseId}
                    />
                ))}

                {/* Add module form */}
                <Collapse in={addingModule}>
                    <Box component="form" onSubmit={handleAddModule} noValidate
                        sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2.5, border: "1px solid #e0e7ff", borderRadius: "12px", bgcolor: "#fafbff" }}>

                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#1a146b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            New Module
                        </Typography>
                        <TextField onChange={(e) => setTitle(e.target.value)} name="title" value={title} autoFocus fullWidth size="small" placeholder="e.g. Authentication"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem", bgcolor: "white" } }} />


                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <Button type="submit" variant="contained" size="small" disabled={isAddingPending}
                                startIcon={isAddingPending ? <CircularProgress size={12} sx={{ color: "white" }} /> : null}
                                sx={{ bgcolor: "#1a146b", borderRadius: "8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", px: 2.5, "&:hover": { bgcolor: "#312e81" } }}>
                                {isAddingPending ? "Adding..." : "Add Module"}
                            </Button>
                            <Button size="small" onClick={() => { setAddingModule(false); mReset(); }}
                                sx={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Collapse>

                {/* Add module button */}
                {!addingModule && (
                    <Button fullWidth variant="outlined" startIcon={<Add />} onClick={() => setAddingModule(true)}
                        sx={{ borderColor: "#1a146b", color: "#1a146b", borderRadius: "12px", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", py: 1.4, "&:hover": { bgcolor: "#eef2ff", borderColor: "#312e81" } }}>
                        Add Module
                    </Button>
                )}

            </Box>
        </Paper>
    );
}

export default CurriculumPanel;