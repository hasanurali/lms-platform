import { useRef } from "react";
import { Box, Typography } from "@mui/material";

import { UploadFile } from "@mui/icons-material";

const VideoUpload = ({ file, existingVideoUrl, onChange, isSaving }) => {
    const ref = useRef(null);

    const getFileNameFromUrl = (url) => {
        if (!url) return "";
        return url.substring(url.lastIndexOf("/") + 1);
    };

    return (
        <Box>
            <input ref={ref} type="file" accept=".mp4,.mkv,.webm,.avi" style={{ display: "none" }} onClick={(e) => { e.target.value = null; }} onChange={onChange} />
            <Box
                onClick={() => (!isSaving && ref.current.click())}
                sx={{
                    height: 100, borderRadius: "10px",
                    border: file ? "2px solid #0d9488" : "2px dashed #e2e8f0",
                    bgcolor: file ? "#f0fdfa" : "#f8fafc",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", gap: 2, px: 3,
                    ...(!isSaving && { "&:hover": { borderColor: "#0d9488", bgcolor: "#f0fdfa" } }),
                    transition: "all 0.2s",
                }}
            >
                <UploadFile sx={{ fontSize: 28, color: file ? "#0d9488" : "#cbd5e1", flexShrink: 0 }} />
                <Box>
                    {file ? (
                        <>
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#0d9488" }}>{file.name}</Typography>
                            <Typography sx={{ fontSize: 10, color: "#64748b", mt: 0.3 }}>
                                {(file.size / (1024 * 1024)).toFixed(1)} MB · Click to change
                            </Typography>
                        </>
                    ) : existingVideoUrl ? (
                        <>
                            <Typography noWrap sx={{ fontSize: { xs: 11, sm: 12 }, fontWeight: 700, color: "#0d9488" }}>
                                {getFileNameFromUrl(existingVideoUrl)}
                            </Typography>
                            <Typography sx={{ fontSize: 10, color: "#0d9488", fontWeight: 500, mt: 0.3 }}>
                                Saved Video · Click to replace
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>Upload Video</Typography>
                            <Typography sx={{ fontSize: 10, color: "#cbd5e1", mt: 0.3 }}>MP4, MKV, WEBM, AVI · Max 500MB</Typography>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default VideoUpload;