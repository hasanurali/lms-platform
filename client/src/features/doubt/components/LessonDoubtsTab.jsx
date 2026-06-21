import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast"

import AddIcon from "@mui/icons-material/Add";

import { btnPrimary, btnGhost, inputSx } from "../constants/doubtConstants"
import DoubtCard from "./DoubtCard"
import ReplyBubble from "./ReplyBubble"
import StatusChip from "./StatusChip";
import createDoubtSchema from "../schema/createDoubtSehema";
import handleFieldApiErrors from "@/utils/handleFieldApiErrors"
import useCreateDoubt from "../hooks/useCreateDoubt"
import useFetchLessonDoubt from "../hooks/useFetchLessonDoubt"
import useFetchDoubtDetails from "../hooks/useFetchDoubtDetails"
import ReplyForm from "./ReplyForm";


const LessonDoubtsTab = ({ lessonId, courseId }) => {

  const { control, handleSubmit, reset, formState: { errors, isDirty }, setError } = useForm({
    resolver: zodResolver(createDoubtSchema),
    defaultValues: {
      title: "",
      description: ""
    }
  });

  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch doubts
  const { data: doubtsData } = useFetchLessonDoubt(lessonId);
  const doubts = doubtsData?.data ?? [];

  // Create doubts
  const { mutate: createDoubtMutate, isPending: isCreateDoubtPending } = useCreateDoubt(lessonId)
  const onSubmit = (data) => {
    createDoubtMutate({ lesson: lessonId, course: courseId, ...data }, {
      onSuccess: () => {
        reset(); setShowForm(false);
      },
      onError: (error) => {
        handleFieldApiErrors(error, setError);
      }
    })
  };

  // Fetch doubt details
  const { data: doubtDetailsData, isPending: isDoubtDetailsPending } = useFetchDoubtDetails(selectedId)
  const selected = doubtDetailsData?.data;

  return (
    <Box sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
      gap: 3, alignItems: "flex-start",
    }}>

      {/* Left list */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

        {/* Ask button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            startIcon={<AddIcon sx={{ fontSize: "16px !important" }} />}
            sx={{ ...btnPrimary, mb: 0.5 }}
          >
            Ask a Doubt
          </Button>
        )}

        {/* Create form */}
        {showForm && (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              background: "#fff", borderRadius: "12px", p: 2,
              border: "1px solid rgba(26,20,107,0.1)", mb: 0.5,
            }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1a146b", mb: 1.25 }}>
              Your Question
            </Typography>

            {/* Title field */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="What would you like to ask?"
                  error={!!errors.title}
                  helperText={errors.title?.message || " "}
                  sx={{ ...inputSx, mb: 0.5 }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />

            {/* Description field */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline rows={3} fullWidth
                  placeholder="Describe your question..."
                  error={!!errors.description}
                  helperText={errors.description?.message || " "}
                  sx={{ ...inputSx, mb: 1 }}
                />
              )}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                type="submit"
                sx={btnPrimary}
                disabled={!isDirty || isCreateDoubtPending}
              >
                {isCreateDoubtPending ? "Submitting..." : "Submit"}
              </Button>
              <Button onClick={() => { setShowForm(false); reset() }} sx={btnGhost}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {/* Doubt list */}
        {doubts.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography sx={{ fontSize: 13, color: "#a0a0a8" }}>
              No doubts for this lesson yet.
            </Typography>
          </Box>
        ) : (
          doubts.map(d => (
            <DoubtCard
              key={d._id}
              doubt={d}
              selected={d._id === selectedId}
              onClick={setSelectedId}
            />
          ))
        )}
      </Box>

      {/* Right conversation */}
      {selected ? (
        <Box sx={{ background: "#fff", borderRadius: "14px", border: "1px solid #eceef0", overflow: "hidden" }}>

          {/* Header */}
          <Box sx={{ p: "18px 22px", borderBottom: "1px solid #eceef0" }}>
            <Box sx={{ mb: 1 }}><StatusChip status={selected.doubt?.status} /></Box>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 17, md: 20 }, fontWeight: 800,
              color: "#191c1e", lineHeight: 1.2,
            }}>
              {selected.doubt?.title}
            </Typography>
            <Typography sx={{
              fontSize: { xs: 12, md: 14 },
              color: "gray", lineHeight: 1.2,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              paddingTop: "2px"
            }}>
              {selected.doubt?.course?.title}
              <Box component="span">•</Box>
              {selected.doubt?.lesson?.title}
            </Typography>
          </Box>

          {/* Replies */}
          <Box sx={{ p: "18px 22px", display: "flex", flexDirection: "column", gap: 2, minHeight: 120 }}>
            {!selected.replies?.length ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography sx={{ fontSize: 13, color: "#a0a0a8" }}>No replies yet.</Typography>
              </Box>
            ) : (
              selected.replies?.map(r => <ReplyBubble key={r._id} reply={r} />)
            )}
          </Box>

          {/* Reply form */}
          {selected.doubt?.status !== "closed" && <ReplyForm selected={selected} lessonId={lessonId}/>}

          {selected.doubt?.status === "closed" && (
            <Box sx={{ p: "14px 22px", borderTop: "1px solid #eceef0", background: "#f7f9fb", textAlign: "center" }}>
              <Typography sx={{ fontSize: 12, color: "#a0a0a8" }}>This doubt is closed.</Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{
          background: "#fff", borderRadius: "14px", border: "1px solid #eceef0",
          p: 5, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Typography sx={{ fontSize: 13, color: "#a0a0a8" }}>Select a doubt to view.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default LessonDoubtsTab;