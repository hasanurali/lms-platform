import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";

import { Delete } from "@mui/icons-material";

const DeleteConfirmDialog = ({ open, onClose, course }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            slotProps={{
                paper: { sx: { borderRadius: "16px" } }
            }}>
            <DialogContent sx={{ px: 3, py: 3 }}>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>

                    <Box sx={{
                        width: 48, height: 48, borderRadius: "50%",
                        bgcolor: "#fee2e2", display: "flex",
                        alignItems: "center", justifyContent: "center",
                    }}>
                        <Delete sx={{ fontSize: 22, color: "#dc2626" }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1a146b" }}>
                        Delete Course?
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, textAlign: "center" }}>
                        <strong>"{course?.title}"</strong> will be permanently deleted. This cannot be undone.
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1.5, width: "100%", pt: 0.5 }}>
                        <Button fullWidth variant="outlined" onClick={onClose}
                            sx={{ borderColor: "#e2e8f0", color: "#64748b", borderRadius: "8px", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>
                            Cancel
                        </Button>
                        <Button fullWidth variant="contained" onClick={onClose}
                            sx={{ bgcolor: "#dc2626", borderRadius: "8px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", "&:hover": { bgcolor: "#b91c1c" } }}>
                            Delete
                        </Button>
                    </Box>

                </Box>

            </DialogContent>
        </Dialog>
    );
}


export default DeleteConfirmDialog;