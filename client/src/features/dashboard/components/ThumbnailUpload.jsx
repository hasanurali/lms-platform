import { useRef } from "react";
import { Box, Typography } from "@mui/material";

import { Image as ImageIcon } from "@mui/icons-material";


const ThumbnailUpload = ({ preview, onChange, isSaved }) => {
    const ref = useRef(null);

    return (
        <Box>
            <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: "none" }} onChange={onChange} />
            <Box
                onClick={() => (!isSaved && ref.current.click())}
                sx={{
                    height: 160, borderRadius: "12px",
                    border: preview ? "none" : "2px dashed #e2e8f0",
                    bgcolor: preview ? "transparent" : "#f8fafc",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", overflow: "hidden", position: "relative",
                    "&:hover .overlay": { opacity: 1 },
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: "#a5b4fc" },
                }}
            >
                {preview ? (
                    <>
                        <Box component="img" src={preview} alt="thumbnail"
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {!isSaved && <Box className="overlay" sx={{
                            position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.4)",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            opacity: 0, transition: "opacity 0.2s",
                        }}>
                            <ImageIcon sx={{ fontSize: 28, color: "white", mb: 0.5 }} />
                            <Typography sx={{ fontSize: 11, color: "white", fontWeight: 600 }}>Change Image</Typography>
                        </Box>}
                    </>
                ) : (
                    <Box sx={{ textAlign: "center" }}>
                        <ImageIcon sx={{ fontSize: 32, color: "#cbd5e1", display: "block", mx: "auto", mb: 1 }} />
                        <Typography sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Upload Thumbnail</Typography>
                        <Typography sx={{ fontSize: 10, color: "#cbd5e1", mt: 0.3 }}>JPG, PNG, WEBP · Max 2MB</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default ThumbnailUpload;