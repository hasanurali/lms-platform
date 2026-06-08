import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Chip } from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from '@mui/icons-material/StarHalf';

const CourseCard = ({ course }) => {

  const { _id, title, description, price, averageRating, totalReviews, thumbnail } = course;

  const isFree = price === 0;

  const navigate = useNavigate()

  // Render 5 stars filled/half/empty based on averageRating
  const renderStars = () => {
    let isHalfComplete = false;
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.floor(averageRating) ?
        <StarIcon key={i} sx={{ fontSize: 13, color: "#44b5a8" }} />
        :
        averageRating > Math.floor(averageRating) && !isHalfComplete ?
          (
            isHalfComplete = true,
            <StarHalfIcon key={i} sx={{ fontSize: 13, color: "#44b5a8" }} />
          )
          :
          <StarBorderIcon key={i} sx={{ fontSize: 13, color: "#c8c5d3" }} />
    ))
  };


  return (
    <Box onClick={() => navigate(`/courses/${_id}`)} sx={{
      background: "#ffffff",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(25,28,30,0.06)",
      transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      border: "1px solid transparent",
      "&:hover": {
        boxShadow: "0 16px 48px rgba(25,28,30,0.14)",
        transform: "translateY(-4px)",
        borderColor: "rgba(26,20,107,0.08)",
      },
      "&:hover img": { transform: "scale(1.06)" },
      "&:hover .course-title": { color: "#44b5a8" },
    }}>

      {/* Thumbnail */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "rgba(0, 0, 0, 0.04)"
        }}
      >
        <Box
          component="img"
          src={thumbnail}
          alt={title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            "&:hover": {
              transform: "scale(1.05)",
            }
          }}
          onError={e => { e.currentTarget.src = "https://placeholder.com"; }}
        />

        {/* Price badge */}
        <Box sx={{
          position: "absolute", bottom: 10, right: 10,
          background: isFree ? "rgba(0,66,60,0.9)" : "rgba(26,20,107,0.9)",
          backdropFilter: "blur(8px)",
          px: 1.5, py: 0.5, borderRadius: "8px",
          zIndex: 1
        }}>
          <Typography sx={{ fontSize: 13, fontWeight: 900, color: "white", fontFamily: "'DM Sans', sans-serif" }}>
            {isFree ? "Free" : `$${price}`}
          </Typography>
        </Box>
      </Box>


      {/* Body */}
      <Box sx={{ p: "16px 18px", display: "flex", flexDirection: "column", flex: 1, gap: 1.25 }}>

        {/* Rating row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>{renderStars()}</Box>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#44b5a8" }}>
            {averageRating > 0 ? averageRating.toFixed(1) : "New"}
          </Typography>
          {totalReviews > 0 && (
            <Typography sx={{ fontSize: 10, color: "#777682" }}>
              ({totalReviews.toLocaleString()})
            </Typography>
          )}
        </Box>

        {/* Title */}
        <Typography
          className="course-title"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16, fontWeight: 700, color: "#1a146b",
            lineHeight: 1.35, transition: "color 0.2s",
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography sx={{
          fontSize: 12.5, color: "#505f76", lineHeight: 1.65,
          display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {description}
        </Typography>

        {/* Price */}
        <Box sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          pt: 1.5, mt: "auto",
          borderTop: "1px solid #eceef0",
        }}>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20, fontWeight: 900,
            color: isFree ? "#00423c" : "#1a146b",
          }}>
            {isFree ? "Free" : `$${price}`}
          </Typography>

        </Box>
      </Box>
    </Box >
  );
};

export default CourseCard;