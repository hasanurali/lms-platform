import { useState } from "react";
import { Box, Button, CircularProgress, Paper, TextField, Typography, } from "@mui/material";

import StepBadge from "./StepBadge";
import ThumbnailUpload from "./ThumbnailUpload"
import { Save } from "@mui/icons-material";

const CourseDetailsPanel = ({ onSaved }) => {
    const [data, setData] = useState({ title: "", descrption: "", price: 0 })
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [thumbnailError, setThumbnailError] = useState("");
    const [isPending, setIsPending] = useState(false);


    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
        setThumbnailError("");
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!thumbnailFile) {
            setThumbnailError("Thumbnail is required");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.price !== undefined) formData.append("price", data.price);
        formData.append("thumbnail", thumbnailFile);

        setIsPending(true);

        console.log("Course FormData:", [...formData.entries()]);
        setIsPending(false);
    };

    return (
        <Paper onSubmit={handleSubmit} elevation={0} component="form" noValidate
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
                    <TextField onChange={handleChange} name="title" value={data.title} fullWidth size="small" placeholder="e.g. Node.js Backend Mastery"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }} />
                </Box>


                {/* Description */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Description *
                    </Typography>
                    <TextField onChange={handleChange} name="descrption" value={data.descrption} fullWidth multiline rows={4} size="small" placeholder="Write course description..."
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }} />
                </Box>

                {/* Price */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Price (USD)
                    </Typography>
                    <TextField onChange={handleChange} name="price" value={data.price} fullWidth size="small" type="number" placeholder="49.99"
                        InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: "#94a3b8", fontSize: 14 }}>$</Typography> }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }} />
                </Box>

                {/* Thumbnail */}
                <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.8 }}>
                        Thumbnail *
                    </Typography>
                    <ThumbnailUpload preview={thumbnailPreview} onChange={handleFile} />
                    {thumbnailError && <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.5 }}>{thumbnailError}</Typography>}
                </Box>

                {/* Save */}
                <Button type="submit" fullWidth variant="contained" disabled={isPending}
                    startIcon={isPending ? <CircularProgress size={14} sx={{ color: "white" }} /> : <Save fontSize="small" />}
                    sx={{ bgcolor: "#1a146b", borderRadius: "10px", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", py: 1.4, "&:hover": { bgcolor: "#312e81" }, "&:disabled": { bgcolor: "#c7d2fe" } }}>
                    {isPending ? "Saving..." : "Save Course"}
                </Button>
            </Box>
        </Paper>
    );
}

export default CourseDetailsPanel;