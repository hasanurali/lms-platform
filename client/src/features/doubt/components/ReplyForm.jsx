import React from 'react'
import { Box, Typography, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { inputSx, btnPrimary, btnGhost } from '../constants/doubtConstants'
import doubtReplySchema from '../schema/doubtReplySchema';
import useAddDoubtReply from "../hooks/useAddDoubtReply"
import handleFieldApiErrors from "@/utils/handleFieldApiErrors"
import useMarkDoubtAnswered from '../hooks/useMarkDoubtAnswered';
import useMarkDoubtClosed from "../hooks/useMarkDoubtClosed"

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
            sx={{ p: "16px 22px", borderTop: "1px solid #eceef0" }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#191c1e", mb: 1.5 }}>
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
                        placeholder="Write your reply..."
                        error={!!errors.message}
                        helperText={errors.message?.message || " "}
                        sx={{ ...inputSx, mb: 0.5 }}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                )}
            />

            <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>

                <Button
                    type='submit'
                    disabled={!isDirty || isaddDoubtReplyPending}
                    sx={btnPrimary}
                >
                    {isaddDoubtReplyPending ? "Sending..." : "Send Reply"}
                </Button>

                {isValidToMark && (selected.doubt?.status === "open" && <Button
                    onClick={handleMarkAnswer}
                    disabled={isMarkAnswerPending}
                    sx={btnGhost}>
                    {isMarkAnswerPending ? "Marking..." : "Mark as Answered"}
                </Button>
                )}

                {isCurrentUser && <Button
                    onClick={handleMarkClose}
                    disabled={isMarkClosePending}
                    sx={{ ...btnGhost, "&:hover": { background: "#ffdad6", color: "#ba1a1a" } }}
                >
                    {isMarkClosePending ? "Closing..." : "Close Doubt"}
                </Button>}

            </Box>
        </Box>
    )
}

export default ReplyForm