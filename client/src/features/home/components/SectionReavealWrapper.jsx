import { Box } from "@mui/material";
import useScrollReveal from "../hooks/useScrollReveal";

const Reveal = ({ children, delay = 0, sx = {} }) => {
    const { ref, visible } = useScrollReveal();
    return (
        <Box ref={ref} sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: `opacity 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
            ...sx,
        }}>
            {children}
        </Box>
    );
};

export default Reveal;