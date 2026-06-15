import { Box } from "@mui/material"
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from '@mui/icons-material/StarHalf';

const RenderStars = ({ rating, size = 13, color = "#44b5a8", gap = 0 }) => {
  let isHalfComplete = false;
  return <Box sx={{ display: "flex", alignItems: "center", gap }}>
    {Array.from({ length: 5 }, (_, i) => (
      i < Math.floor(rating) ?
        <StarIcon key={i} sx={{ fontSize: size, color }} />
        :
        rating > Math.floor(rating) && !isHalfComplete ?
          (
            isHalfComplete = true,
            <StarHalfIcon key={i} sx={{ fontSize: size, color }} />
          )
          :
          <StarBorderIcon key={i} sx={{ fontSize: size, color: "#c8c5d3" }} />
    ))}
  </Box>
};


export default RenderStars;