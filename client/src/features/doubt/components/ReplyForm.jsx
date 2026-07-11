import React from 'react'
import { Box, Typography, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import doubtReplySchema from '../schema/doubtReplySchema';
import useAddDoubtReply from "../hooks/useAddDoubtReply"
import handleFieldApiErrors from "@/utils/handleFieldApiErrors"
import useMarkDoubtAnswered from '../hooks/useMarkDoubtAnswered';
import useMarkDoubtClosed from "../hooks/useMarkDoubtClosed"
import { tightButtonBase } from "../constants/doubtConstants"

const ReplyForm = ({ selected, lessonId, isCurrentUser, isValidToMark }) => {

    const { control, handleSubmit, reset, formState: { errors, isDirty }, setError } = useForm({
        resolver: zodResolver(doubtReplySchema),
        defaultValues: {
            message: ""
        }
    });

    const doubtId = selected.doubt?._id;

    const { mutate: addDoubtReplyMutate, isPending: isaddDoubtReplyPending } = useAddDoubtReply(doubtId)
    const onSubmit = (data) => {
        addDoubtReplyMutate({ id: doubtId, data }, {
            onSuccess: () => {
                reset()
            },
            onError: (error) => {
                handleFieldApiErrors(error, setError);
            }
        })
    };

    const { mutate: markAnswerMutate, isPending: isMarkAnswerPending } = useMarkDoubtAnswered(lessonId, doubtId)
    const handleMarkAnswer = () => {
        markAnswerMutate(doubtId)
    };

    const { mutate: markCloseMutate, isPending: isMarkClosePending } = useMarkDoubtClosed(lessonId, doubtId)
    const handleMarkClose = () => {
        markCloseMutate(doubtId)
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ p: "4px 0px 0px 0px" }}>
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#334155", mb: 1, fontFamily: "Inter, sans-serif" }}>
                Add Reply
            </Typography>

            {/* Message field */}
            <Controller
                name="message"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={1.5}
                        placeholder="Write your reply..."
                        error={!!errors.message}
                        helperText={errors.message?.message}
                        slotProps={{
                            formHelperText: {
                                sx: { position: "absolute", bottom: -18, left: 2, fontSize: 10, m: 0 }
                            }
                        }}
                        sx={{
                            mb: errors.message ? 2.5 : 1.25,
                            "& .MuiInputBase-root": {
                                fontSize: 13, py: "8px", px: "12px",
                                bgcolor: "#f8fafc", borderRadius: "8px",
                                fontFamily: "Inter, sans-serif",
                                "& fieldset": { borderColor: "#e2e8f0" },
                                "&:hover fieldset": { borderColor: "#cbd5e1" },
                                "&.Mui-focused fieldset": { borderColor: "#1a146b", borderWidth: "1px" },
                            }
                        }}
                    />
                )}
            />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>

                <Button
                    type='submit'
                    disabled={!isDirty || isaddDoubtReplyPending}
                    sx={{
                        ...tightButtonBase, bgcolor: "#1a146b", color: "white",
                        "&:hover": { bgcolor: "#120e4d" },
                        "&:disabled": { bgcolor: "#f1f5f9", color: "#94a3b8" }
                    }}>
                    {isaddDoubtReplyPending ? "Sending..." : "Send Reply"}
                </Button>

                {isValidToMark && selected.doubt?.status === "open" && (
                    <Button
                        onClick={handleMarkAnswer}
                        disabled={isMarkAnswerPending}
                        sx={{
                            ...tightButtonBase, border: "1px solid #e2e8f0",
                            color: "#475569", bgcolor: "transparent",
                            "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" }
                        }}>
                        {isMarkAnswerPending ? "Marking..." : "Mark as Answered"}
                    </Button>
                )}

                {isCurrentUser && (
                    <Button
                        onClick={handleMarkClose}
                        disabled={isMarkClosePending}
                        sx={{
                            ...tightButtonBase, border: "1px solid #e2e8f0",
                            color: "#64748b", bgcolor: "transparent",
                            "&:hover": { background: "#fef2f2", color: "#991b1b", borderColor: "#fca5a5" }
                        }}>
                        {isMarkClosePending ? "Closing..." : "Close Doubt"}
                    </Button>
                )}

            </Box>
        </Box>
    )
}

export default ReplyForm;