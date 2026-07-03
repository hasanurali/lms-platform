import { useEffect, useState } from "react";

import { Box } from "@mui/material"

import Sidebar from "@/components/navigation/Sidebar";
import ProfileTab from "../components/ProfileTab";
import CoursesTab from "../components/CoursesTab";
import DoubtsTab from '../components/DoubtsTab'
import useStore from "@/store/store"
import useAuthUser from "@/features/auth/hooks/useAuthUser";
import fetchEnrolledCourses from "@/features/enrollment/hooks/useFetchEnrolledCourses"
import useAllCoursesProgress from "@/features/progress/hooks/useAllCoursesProgress"
import InstructorCoursesTab from "../components/InstructorCoursesTab"
import InstructorDoubtsTab from "../components/InstructorDoubtsTab";
import ReviewsTab from "../components/ReviewsTab";

const Dashboard = () => {

  const { data: user, isPending } = useAuthUser();

  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);

  const { data: myEnroledCourses, isPending: isMyEnroledCoursesPending } = fetchEnrolledCourses()

  // Fetch course progress with useQueries and get data with destructure
  const progressResults = useAllCoursesProgress(myEnroledCourses?.data);
  const allProgressData = progressResults
    .filter(result => result.isSuccess)
    .map(result => result.data?.data);

  // Group Course with there progress to get easy access
  const groupedData = myEnroledCourses?.data.map((data, i) => {
    return {
      ...data.course,
      progress: { completedLessons: allProgressData[i]?.progress?.completedLessons, completed: allProgressData[i]?.progress?.completed },
      progressPercentage: allProgressData[i]?.progressPercentage
    }
  });

  if (isPending || isMyEnroledCoursesPending) {
    return <div className="pt-20">Loding...</div>
  }

  return (
    <Box className="flex min-h-screen bg-slate-50 w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <Box component="main" className="md:ml-64 flex-1 pt-20 pb-12 px-6 md:px-10">
        <Box className="max-w-7xl mx-auto">
          {activeTab === "profile" && <ProfileTab user={user} courses={groupedData} />}

          {/* Student tabs */}
          {user?.role === "student" && activeTab === "courses" && <CoursesTab courses={groupedData} />}
          {user?.role === "student" && activeTab === "doubts" && <DoubtsTab />}

          {/* Instructor tabs */}
          {user?.role === "instructor" && activeTab === "courses" && <InstructorCoursesTab courses={groupedData} />}
          {user?.role === "instructor" && activeTab === "doubts" && <InstructorDoubtsTab />}
          {user?.role === "instructor" && activeTab === "reviews" && <ReviewsTab />}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;