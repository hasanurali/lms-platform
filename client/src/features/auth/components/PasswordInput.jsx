import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordInput = ({ label = "Password", placeholder = "••••••••", value, onChange, error, helperText, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            label={label}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            variant="outlined"
            fullWidth
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                edge="end"
                                tabIndex={-1}
                                sx={{
                                    color: "#777682",
                                    "&:hover": {
                                        color: "#1a146b",
                                    },
                                    mr: "-4px",
                                }}
                            >
                                {showPassword ? (
                                    <VisibilityIcon fontSize="small" />
                                ) : (
                                    <VisibilityOffIcon fontSize="small" />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
            {...props}
        />
    );
};

export default PasswordInput;