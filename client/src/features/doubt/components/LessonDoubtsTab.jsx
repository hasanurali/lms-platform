import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast"

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
import useAuthUser from "@/features/auth/hooks/useAuthUser"
import useStore from "@/store/store";
import useDoubtSocket from "@/socket/hooks/useDoubtSocket";


const LessonDoubtsTab = ({ lessonId: lessonIdProp, courseId, defaultSelectedId, onBack }) => {

  const { control, handleSubmit, reset, formState: { errors, isDirty }, setError } = useForm({
    resolver: zodResolver(createDoubtSchema),
    defaultValues: { title: "", description: "" }
  });

  const [selectedId, setSelectedId] = useState(defaultSelectedId ?? null);
  const [showForm, setShowForm] = useState(false);
  const repliesContainerRef = useRef(null);
  const currentInstructorId = useStore((state) => state.currentInstructorId);

  const { data: user } = useAuthUser();
  const isValidToReply = user.role === "admin" || currentInstructorId === user._id;

  const { data: doubtsData } = useFetchLessonDoubt(lessonIdProp);
  const doubts = doubtsData?.data ?? [];

  useDoubtSocket({ doubtId: selectedId, lessonId: lessonIdProp });

  const { mutate: createDoubtMutate, isPending: isCreateDoubtPending } = useCreateDoubt(lessonIdProp)
  const onSubmit = (data) => {
    createDoubtMutate({ lesson: lessonIdProp, course: courseId, ...data }, {
      onSuccess: () => { reset(); setShowForm(false); },
      onError: (error) => { handleFieldApiErrors(error, setError); }
    })
  };

  const { data: doubtDetailsData, isPending: isDoubtDetailsPending } = useFetchDoubtDetails(selectedId)
  const selected = doubtDetailsData?.data;
  const lessonId = selected?.doubt?.lesson?._id;
  const isCurrentUser = selected?.doubt?.student?._id === user._id;

  useEffect(() => {
    if (selected?.replies && repliesContainerRef.current) {
      repliesContainerRef.current.scrollTo({
        top: repliesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [selected?.replies?.length]);

  // Dashboard mode 
  if (onBack) {
    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "calc(100vh - 120px)", md: "calc(100vh - 140px)" },
      }}>

        {/* Back button */}
        <Box
          onClick={onBack}
          sx={{
            display: "flex", alignItems: "center", gap: 1, mb: 2,
            cursor: "pointer", width: "fit-content", color: "#64748b",
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#1a146b",
              transform: "translateX(-2px)"
            },
          }}>
          <ArrowBackIcon sx={{ fontSize: 15 }} />
          <Typography sx={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Back to Doubts
          </Typography>
        </Box>

        {/* Chat panel */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", minHeight: 0 }}>
          <Box sx={{
            width: "100%", maxWidth: { xs: "100%", md: "1100px", lg: "1200px" },
            bgcolor: "white", borderRadius: "14px", border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
            overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0,
          }}>

            {selected ? (
              <>
                {/* Header Section */}
                <Box sx={{
                  px: { xs: 2.5, md: 3 },
                  py: 1.5, borderBottom: "1px solid #e2e8f0",
                  bgcolor: "white", flexShrink: 0,
                }}>

                  {/* Status chips and question titles */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <StatusChip status={selected.doubt?.status} />
                    <Typography sx={{
                      fontFamily: "Inter, sans-serif", fontSize: { xs: 15, md: 17 },
                      fontWeight: 700, color: "#0f172a", lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                    }}>
                      {selected.doubt?.title}
                    </Typography>
                  </Box>

                  <Typography sx={{
                    fontSize: 11, color: "#64748b",
                    display: "flex", alignItems: "center",
                    flexWrap: "wrap", gap: "4px", mt: 0.5,
                  }}>
                    <Box component="span" sx={{ fontWeight: 500 }}>{selected.doubt?.course?.title}</Box>
                    <Box component="span" sx={{ color: "#94a3b8" }}>·</Box>
                    <Box component="span">{selected.doubt?.lesson?.title}</Box>
                  </Typography>
                </Box>

                {/* Message area */}
                <Box
                  ref={repliesContainerRef}
                  sx={{
                    px: { xs: 2.5, md: 3 },
                    py: 2, display: "flex",
                    flexDirection: "column",
                    gap: 2, flex: 1,
                    overflowY: "auto",
                    bgcolor: "#f8fafc",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}>

                  {!selected.replies?.length ? (
                    <Box sx={{ m: "auto", py: 4, textAlign: "center" }}>
                      <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>
                        No replies yet.
                      </Typography>
                    </Box>
                  ) : (
                    selected.replies?.map(r => <ReplyBubble key={r._id} reply={r} />)
                  )}
                </Box>

                {/* Reply form */}
                <Box sx={{
                  px: { xs: 2.5, md: 3 },
                  py: 1.5, borderTop: "1px solid #e2e8f0",
                  bgcolor: "white", flexShrink: 0
                }}>

                  {(isValidToReply || isCurrentUser) && selected.doubt?.status !== "closed" && (
                    <ReplyForm
                      selected={selected}
                      lessonId={lessonIdProp || lessonId}
                      isCurrentUser={isCurrentUser}
                      isValidToMark={isValidToReply}
                    />
                  )}

                  {selected.doubt?.status === "closed" && (
                    <Box sx={{ py: 0.5, textAlign: "center" }}>
                      <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                        This doubt is closed.
                      </Typography>
                    </Box>
                  )}

                </Box>
              </>
            ) : (
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>Loading doubt…</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }


  // Lesson page mode 
  return (
    <Box sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
      gap: 3,
      alignItems: "flex-start",
    }}>

      {/* Left column */}
      <Box sx={{ display: "flex", flexDirection: "column", height: "700px" }}>

        {/* Ask doubt button */}
        <Box sx={{ mb: 1.5, flexShrink: 0 }}>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              startIcon={<AddIcon sx={{ fontSize: "16px !important" }} />}
              sx={{ ...btnPrimary, width: "100%" }}
            >
              Ask a Doubt
            </Button>
          )}

          {showForm && (
            <Box component="form" onSubmit={handleSubmit(onSubmit)}
              sx={{ background: "#fff", borderRadius: "12px", p: 2, border: "1px solid rgba(26,20,107,0.1)" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1a146b", mb: 1.25 }}>
                Your Question
              </Typography>
              <Controller name="title" control={control} render={({ field }) => (
                <TextField {...field} fullWidth placeholder="What would you like to ask?"
                  error={!!errors.title} helperText={errors.title?.message || " "}
                  sx={{ ...inputSx, mb: 0.5 }} slotProps={{ inputLabel: { shrink: true } }} />
              )} />
              <Controller name="description" control={control} render={({ field }) => (
                <TextField {...field} multiline rows={3} fullWidth placeholder="Describe your question..."
                  error={!!errors.description} helperText={errors.description?.message || " "}
                  sx={{ ...inputSx, mb: 1 }} />
              )} />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button type="submit" sx={btnPrimary} disabled={!isDirty || isCreateDoubtPending}>
                  {isCreateDoubtPending ? "Submitting..." : "Submit"}
                </Button>
                <Button onClick={() => { setShowForm(false); reset() }} sx={btnGhost}>Cancel</Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Doubt list */}
        <Box sx={{
          display: "flex", flexDirection: "column", gap: 1.5,
          flexGrow: 1, overflowY: "auto", pr: 0.5,
          "::-webkit-scrollbar": { width: "6px" },
          "::-webkit-scrollbar-thumb": { background: "#eceef0", borderRadius: "4px" }
        }}>
          {doubts.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <Typography sx={{ fontSize: 13, color: "#a0a0a8" }}>No doubts for this lesson yet.</Typography>
            </Box>
          ) : (
            doubts.map(d => (
              <DoubtCard key={d._id} doubt={d} selected={d._id === selectedId} onClick={setSelectedId} />
            ))
          )}
        </Box>
      </Box>

      {/* Right conversation */}
      {selected ? (
        <Box sx={{
          background: "#fff", borderRadius: "14px", border: "1px solid #eceef0",
          overflow: "hidden", display: "flex", flexDirection: "column", height: "700px"
        }}>
          <Box sx={{ p: "18px 22px", borderBottom: "1px solid #eceef0", background: "#fff", zIndex: 1 }}>
            <Box sx={{ mb: 1 }}><StatusChip status={selected.doubt?.status} /></Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 17, md: 20 }, fontWeight: 800, color: "#191c1e", lineHeight: 1.2 }}>
              {selected.doubt?.title}
            </Typography>
            <Typography sx={{ fontSize: { xs: 12, md: 14 }, color: "gray", lineHeight: 1.2, display: "flex", alignItems: "center", gap: "4px", paddingTop: "2px" }}>
              {selected.doubt?.course?.title}
              <Box component="span">•</Box>
              {selected.doubt?.lesson?.title}
            </Typography>
          </Box>

          <Box ref={repliesContainerRef} sx={{
            p: "18px 22px", display: "flex", flexDirection: "column", gap: 2,
            flexGrow: 1, overflowY: "auto", background: "#fafafa",
            scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
          }}>
            {!selected.replies?.length ? (
              <Box sx={{ m: "auto", py: 4, textAlign: "center" }}>
                <Typography sx={{ fontSize: 13, color: "#a0a0a8" }}>No replies yet.</Typography>
              </Box>
            ) : (
              selected.replies?.map(r => <ReplyBubble key={r._id} reply={r} />)
            )}
          </Box>

          <Box sx={{ borderTop: "1px solid #eceef0", background: "#fff", p: 1.5 }}>
            {(isValidToReply || isCurrentUser) && selected.doubt?.status !== "closed" && (
              <ReplyForm selected={selected} lessonId={lessonIdProp || lessonId} isCurrentUser={isCurrentUser} isValidToMark={isValidToReply} />
            )}
            {selected.doubt?.status === "closed" && (
              <Box sx={{ p: "10px 22px", background: "#f7f9fb", borderRadius: "8px", textAlign: "center" }}>
                <Typography sx={{ fontSize: 12, color: "#a0a0a8" }}>This doubt is closed.</Typography>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ background: "#fff", borderRadius: "14px", border: "1px solid #eceef0", height: "700px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontSize: 13, color: "#a0a0a8" }}>Select a doubt to view.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default LessonDoubtsTab;