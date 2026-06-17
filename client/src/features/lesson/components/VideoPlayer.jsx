import React, { useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const VideoPlayer = ({ url, title }) => {

    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);

    const videoRef = useRef(null);
    const controlsTimer = useRef(null);


    // Handle video play
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setPlaying(p => !p);
    };

    // Handle video mutation
    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !muted;
        setMuted(m => !m);
    };

    // Handle video full screen
    const handleFullscreen = () => {
        if (videoRef.current) videoRef.current.requestFullscreen();
    };

    // Handle video time update
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const cur = videoRef.current.currentTime;
        const dur = videoRef.current.duration || 1;
        setCurrentTime(cur);
        setProgress((cur / dur) * 100);
    };

    // Handle video metadata loading
    const handleLoadedMetadata = () => {
        if (videoRef.current) setDuration(videoRef.current.duration);
    };

    // Handle seeking bar
    const handleSeek = (e) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pct * videoRef.current.duration;
    };

    // Handle show/remove controll on mouse move
    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimer.current);
        controlsTimer.current = setTimeout(() => {
            if (playing) setShowControls(false);
        }, 2500);
    };

    // Formate video time
    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    return (
        <Box
            sx={{
                position: "relative", width: "100%", background: "#000",
                borderRadius: "14px", overflow: "hidden",
                aspectRatio: "16/9",
                cursor: "pointer",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => playing && setShowControls(false)}
            onClick={togglePlay}
        >
            <video
                ref={videoRef}
                src={url}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setPlaying(false)}
            />

            {/* Play/Pause center icon */}
            {!playing && (
                <Box sx={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(0,0,0,0.3)",
                }}>
                    <Box sx={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "rgba(255,255,255,0.9)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}>
                        <PlayArrowIcon sx={{ fontSize: 40, color: "#1a146b", ml: "4px" }} />
                    </Box>
                </Box>
            )}

            {/* Controls overlay */}
            <Box sx={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                p: "16px 20px 12px",
                opacity: showControls ? 1 : 0,
                transition: "opacity 0.3s",
            }}
                onClick={e => e.stopPropagation()}
            >
                {/* Progress bar */}
                <Box
                    onClick={handleSeek}
                    sx={{
                        height: 4, background: "rgba(255,255,255,0.3)",
                        borderRadius: 2, mb: 1.5, cursor: "pointer",
                        "&:hover": { height: 6 }, transition: "height 0.15s",
                    }}
                >
                    <Box sx={{
                        height: "100%", width: `${progress}%`,
                        background: "linear-gradient(90deg, #1a146b, #44b5a8)",
                        borderRadius: 2,
                    }} />
                </Box>

                {/* Bottom controls */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton onClick={togglePlay} size="small" sx={{ color: "white", p: 0.5 }}>
                            {playing ? <PauseIcon sx={{ fontSize: 22 }} /> : <PlayArrowIcon sx={{ fontSize: 22 }} />}
                        </IconButton>
                        <IconButton onClick={toggleMute} size="small" sx={{ color: "white", p: 0.5 }}>
                            {muted ? <VolumeOffIcon sx={{ fontSize: 20 }} /> : <VolumeUpIcon sx={{ fontSize: 20 }} />}
                        </IconButton>
                        <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.8)", ml: 0.5 }}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleFullscreen} size="small" sx={{ color: "white", p: 0.5 }}>
                        <FullscreenIcon sx={{ fontSize: 22 }} />
                    </IconButton>
                </Box>

            </Box>
        </Box>
    );
};

export default VideoPlayer;