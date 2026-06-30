import { Box, Paper, Typography } from '@mui/material';

import { QuestionAnswer } from '@mui/icons-material';

import DoubtCard from "@/features/doubt/components/DoubtCard"
import useFetchMyDoubts from "@/features/doubt/hooks/useFetchMyDoubts"


const DoubtsTab = () => {

    const { data: doubtsData } = useFetchMyDoubts();
    const doubts = doubtsData?.data ?? [];

    return (
        <Box className="space-y-6 max-w-5xl">

            {/* Header */}
            <Box>
                <Typography variant="h6" className="font-bold! text-indigo-950! tracking-tight!">
                    My Doubts
                </Typography>
                <Typography className="text-xs! text-slate-400! mt-0.5!">
                    {doubts.length} doubt{doubts.length !== 1 ? "s" : ""} across your enrolled courses
                </Typography>
            </Box>

            {/* Status summary */}
            {doubts.length > 0 && (
                <Box className="grid grid-cols-3 gap-4">
                    {[
                        { key: "open", label: "Open", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                        { key: "answered", label: "Answered", color: "text-green-600", bg: "bg-green-50 border-green-200" },
                        { key: "closed", label: "Closed", color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
                    ].map(({ key, label, color, bg }) => (
                        <Box key={key} className={`${bg} border rounded-xl p-4 text-center`}>
                            <span className={`text-2xl font-bold block ${color}`}>
                                {doubts.filter(d => d.status === key).length}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Doubts grid */}
            {doubts.length === 0 ? (
                <Paper elevation={0} className="bg-white! rounded-xl! shadow-sm!">
                    <Box className="flex flex-col items-center justify-center py-20 text-center">
                        <Box className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                            <QuestionAnswer sx={{ fontSize: 26, color: "#312e81" }} />
                        </Box>
                        <Typography className="text-sm! font-semibold! text-indigo-950! mb-1!">
                            No doubts yet
                        </Typography>
                        <Typography className="text-xs! text-slate-400!">
                            Questions you ask in lessons will show up here.
                        </Typography>
                    </Box>
                </Paper>
            ) : (
                <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doubts.map((doubt) => (
                        <DoubtCard key={doubt._id} doubt={doubt} isLink={true} />
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default DoubtsTab;