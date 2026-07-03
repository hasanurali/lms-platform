import { Box, Button, TextField, Typography } from "@mui/material";

import VideoUpload from "./VideoUpload"
import { useState } from "react";

const AddLessonForm = ({ moduleId, onCancel, onSuccess }) => {

    const [data, setData] = useState({ title: "", content: "" })
    const [videoFile, setVideoFile] = useState(null)
    const [videoError, setVideoError] = useState("")


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log("Lesson:", data, videoFile)

    }

    return (
        <Box sx={{
            border: "1px solid #e0e7ff", borderRadius: "12px",
            bgcolor: "#fafbff", p: 2.5, mt: 1,
        }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#1a146b", textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
                New Lesson
            </Typography>

            <Box component={"form"} onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                {/* Title */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Lesson Title *
                    </Typography>
                    <TextField onChange={handleChange} name="title" value={data.title} fullWidth size="small" placeholder="e.g. Introduction to JWT"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.8rem", bgcolor: "white" } }} />
                </Box>

                {/* Video */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Video File *
                    </Typography>
                    <VideoUpload file={videoFile} onChange={(e) => { setVideoFile(e.target.files[0]); setVideoError(""); }} />
                    {videoError && <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.5 }}>{videoError}</Typography>}
                </Box>

                {/* Content */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Content <Typography component="span" sx={{ fontSize: 9, color: "#cbd5e1", textTransform: "none", letterSpacing: 0 }}>optional · max 1000 chars</Typography>
                    </Typography>

                    <TextField onChange={handleChange} name="content" value={data.content} fullWidth multiline rows={2} size="small"
                        placeholder="Write lesson notes or description…"
                        helperText={`${data.content?.length ?? 0}/1000`}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.8rem", bgcolor: "white" } }}
                    />
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1.5, pt: 0.5 }}>
                    <Button type="submit" variant="contained" size="small" onClick={onSuccess}
                        sx={{ bgcolor: "#1a146b", borderRadius: "8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", px: 2.5, "&:hover": { bgcolor: "#312e81" } }}>
                        Add Lesson
                    </Button>
                    <Button size="small" onClick={onCancel}
                        sx={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddLessonForm;