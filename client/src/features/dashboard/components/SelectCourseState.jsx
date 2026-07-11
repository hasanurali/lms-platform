import { Box, Typography } from '@mui/material';

import { MenuBook } from '@mui/icons-material';


const SelectCourseState = () => {

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 165px)", textAlign: "center" }}>
            <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "#f8fafc", border: "2px dashed #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <MenuBook sx={{ fontSize: 24, color: "#cbd5e1" }} />
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", mb: 0.5 }}>Select a course</Typography>
            <Typography sx={{ fontSize: 12, color: "#cbd5e1" }}>Choose a course from the left to view its doubts</Typography>
        </Box>
    );
}

export default SelectCourseState;