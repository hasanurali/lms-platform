import { Box, Typography } from '@mui/material';

import { HelpCenterOutlined } from '@mui/icons-material';

const EmptyDoubts = ({ courseName }) => {

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 10, textAlign: "center" }}>
            <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <HelpCenterOutlined sx={{ fontSize: 26, color: "#1a146b" }} />
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1a146b", mb: 0.5 }}>No doubts yet</Typography>
            <Typography sx={{ fontSize: 12, color: "#94a3b8", maxWidth: 220 }}>
                Students haven't asked any questions in <strong>{courseName}</strong> yet.
            </Typography>
        </Box>
    );
}

export default EmptyDoubts;